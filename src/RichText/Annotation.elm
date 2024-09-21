module RichText.Annotation exposing
    ( selection, selectable, lift
    , add, addAtPath, addToBlock, addToInline, fromNode, clear, remove, removeAtPath, removeFromBlock, removeFromInline
    , annotateSelection, selectionFromAnnotations, clearSelectionAnnotations, isSelectable
    , doLift
    )

{-| This module contains common constants and functions used to annotate nodes.
Annotations can be added to elements and text to keep track of position when doing a complex
transform like a lift or join, as well as add flags to a node that you can use to effect behavior,
like if something is selectable.

    newElement =
        element |> Element.withAnnotations (Set.singleton selection)


# Annotations

@docs selection, selectable, lift


# Helpers

@docs add, addAtPath, addToBlock, addToInline, fromNode, clear, remove, removeAtPath, removeFromBlock, removeFromInline


# Selection

These methods are for marking selection, which is useful for keeping track of a user's selection
when defining your own transforms.

@docs annotateSelection, selectionFromAnnotations, clearSelectionAnnotations, isSelectable


# Lift

@docs doLift

-}

-- import RichText.Internal.Constants

import Array
import List.Extra
import RichText.Model.Element
import RichText.Model.InlineElement
import RichText.Model.Node
import RichText.Model.Selection
import RichText.Model.Text
import RichText.Node
import Set exposing (Set)


{-| Represents that a node is currently selected. This annotation is transient, e.g. it
should be cleared before a transform or command is complete. This annotation is also used when
rendering to annotate a selected node for decorators.
-}
selection : String
selection =
    Constants.selection


{-| Represents that a node can be selected. This annotation is not transient.
-}
selectable : String
selectable =
    Constants.selectable


{-| Represents that a node should be lifted. This annotation is transient, e.g. it should be
cleared before a transform or command is complete.
-}
lift : String
lift =
    Constants.lift


{-| Adds an annotation to the node at the given path. Returns an error if no node
exists at that path.

    Annotation.addAtPath "myAnnotation" path root

-}
addAtPath : String -> RichText.Model.Node.Path -> RichText.Model.Node.Block -> Result String RichText.Model.Node.Block
addAtPath annotation path node =
    case RichText.Node.nodeAt path node of
        Nothing ->
            Err "No block found at path"

        Just n ->
            RichText.Node.replace path (add annotation n) node


{-| Removes the given annotation from the node at the given path. Returns an error if no node
exists at that path.

    Annotation.removeAtPath "myAnnotation" path root

-}
removeAtPath : String -> RichText.Model.Node.Path -> RichText.Model.Node.Block -> Result String RichText.Model.Node.Block
removeAtPath annotation path node =
    case RichText.Node.nodeAt path node of
        Nothing ->
            Err "No block found at path"

        Just n ->
            RichText.Node.replace path (remove annotation n) node


{-| Removes the given annotation from the node if it exists.

    remove Annotation.selectable (Block horizontal_rule)
    --> Returns (Block horizontal_rule) with the selectable annotation removed

-}
remove : String -> RichText.Node.Node -> RichText.Node.Node
remove =
    toggle Set.remove


{-| Adds the given annotation to the node.

    add Annotation.selectable (Block horizontal_rule)
    --> Returns (Block horizontal_rule) with the selectable annotation added

-}
add : String -> RichText.Node.Node -> RichText.Node.Node
add =
    toggle Set.insert


{-| Helper which adds the given annotation to a block node.
-}
addToBlock : String -> RichText.Model.Node.Block -> RichText.Model.Node.Block
addToBlock a n =
    case add a (RichText.Node.Block n) of
        RichText.Node.Block b ->
            b

        _ ->
            n


{-| Helper which adds the given annotation to an inline node.
-}
addToInline : String -> RichText.Model.Node.Inline -> RichText.Model.Node.Inline
addToInline a n =
    case add a (RichText.Node.Inline n) of
        RichText.Node.Inline i ->
            i

        _ ->
            n


{-| Helper which removes the given annotation from a block node.
-}
removeFromBlock : String -> RichText.Model.Node.Block -> RichText.Model.Node.Block
removeFromBlock a n =
    case remove a (RichText.Node.Block n) of
        RichText.Node.Block b ->
            b

        _ ->
            n


{-| Helper which removes the given annotation from an inline node.
-}
removeFromInline : String -> RichText.Model.Node.Inline -> RichText.Model.Node.Inline
removeFromInline a n =
    case remove a (RichText.Node.Inline n) of
        RichText.Node.Inline i ->
            i

        _ ->
            n


toggleElementParameters : (String -> Set String -> Set String) -> String -> RichText.Model.Element.Element -> RichText.Model.Element.Element
toggleElementParameters func annotation parameters =
    let
        annotations =
            Element.annotations parameters
    in
    RichText.Model.Element.withAnnotations (func annotation annotations) parameters


toggle : (String -> Set String -> Set String) -> String -> RichText.Node.Node -> RichText.Node.Node
toggle func annotation node =
    case node of
        RichText.Node.Block bn ->
            let
                newParameters =
                    toggleElementParameters func annotation (RichText.Model.Node.element bn)

                newBlockNode =
                    bn |> RichText.Model.Node.withElement newParameters
            in
            RichText.Node.Block newBlockNode

        RichText.Node.Inline il ->
            RichText.Node.Inline <|
                case il of
                    RichText.Model.Node.InlineElement l ->
                        let
                            newParameters =
                                toggleElementParameters func annotation (RichText.Model.InlineElement.element l)
                        in
                        RichText.Model.Node.InlineElement <| RichText.Model.InlineElement.withElement newParameters l

                    RichText.Model.Node.Text tl ->
                        RichText.Model.Node.Text <| (tl |> RichText.Model.Text.withAnnotations (func annotation <| RichText.Model.Text.annotations tl))


{-| Removes the given annotation from this node and its children.

    clear Annotation.lift root
    --> Returns `root` but with all the lift annotations removed.

-}
clear : String -> RichText.Model.Node.Block -> RichText.Model.Node.Block
clear annotation root =
    case RichText.Node.map (remove annotation) (RichText.Node.Block root) of
        RichText.Node.Block bn ->
            bn

        _ ->
            root


{-| Helper method to extract annotations from a node.

    fromNode node
    --> Set ["__selectable__"]

-}
fromNode : RichText.Node.Node -> Set String
fromNode node =
    case node of
        RichText.Node.Block blockNode ->
            RichText.Model.Element.annotations <| RichText.Model.Node.element blockNode

        RichText.Node.Inline inlineLeaf ->
            case inlineLeaf of
                RichText.Model.Node.InlineElement p ->
                    RichText.Model.Element.annotations <| RichText.Model.InlineElement.element p

                RichText.Model.Node.Text p ->
                    RichText.Model.Text.annotations p


findPathsWithAnnotation : String -> RichText.Model.Node.Block -> List RichText.Model.Node.Path
findPathsWithAnnotation annotation node =
    RichText.Node.indexedFoldl
        (\path n agg ->
            if Set.member annotation <| fromNode n then
                path :: agg

            else
                agg
        )
        []
        (RichText.Node.Block node)


{-| Adds the selection annotation to the paths in the selection if they exist. This is useful
when defining your own transforms to keep track of which nodes are selected.

    markedRoot =
        annotateSelection normalizedSelection (State.root editorState)

-}
annotateSelection : RichText.Model.Selection.Selection -> RichText.Model.Node.Block -> RichText.Model.Node.Block
annotateSelection selection_ node =
    addSelectionAnnotationAtPath (RichText.Model.Selection.focusNode selection_) <| addSelectionAnnotationAtPath (RichText.Model.Selection.anchorNode selection_) node


addSelectionAnnotationAtPath : RichText.Model.Node.Path -> RichText.Model.Node.Block -> RichText.Model.Node.Block
addSelectionAnnotationAtPath nodePath node =
    Result.withDefault node (addAtPath selection nodePath node)


{-| Clears the selection annotation from the editor node. The selection annotation should be
transient, so it's important to clear the annotation once you're finished with it.

    clearSelectionAnnotations root
    --> Returns root but with the selection annotation removed

-}
clearSelectionAnnotations : RichText.Model.Node.Block -> RichText.Model.Node.Block
clearSelectionAnnotations =
    clear selection


{-| Derives the selection from selection annotations.

    selectionFromAnnotations root 0 0
    --> Just { anchorNode=[0], anchorOffset=0, focusNode=[1,2], focusOffset=0 }

-}
selectionFromAnnotations : RichText.Model.Node.Block -> Int -> Int -> Maybe RichText.Model.Selection.Selection
selectionFromAnnotations node anchorOffset focusOffset =
    case findNodeRangeFromSelectionAnnotations node of
        Nothing ->
            Nothing

        Just ( start, end ) ->
            Just (RichText.Model.Selection.range start anchorOffset end focusOffset)


findNodeRangeFromSelectionAnnotations : RichText.Model.Node.Block -> Maybe ( RichText.Model.Node.Path, RichText.Model.Node.Path )
findNodeRangeFromSelectionAnnotations node =
    let
        paths =
            findPathsWithAnnotation selection node
    in
    case paths of
        [] ->
            Nothing

        [ x ] ->
            Just ( x, x )

        end :: start :: _ ->
            Just ( start, end )


{-| True if a node has the `selectable` annotation or is Text, false otherwise.

    isSelectable (Inline textNode)
    --> True

-}
isSelectable : RichText.Node.Node -> Bool
isSelectable node =
    case node of
        RichText.Node.Block bn ->
            Set.member selectable (RichText.Model.Element.annotations (RichText.Model.Node.element bn))

        RichText.Node.Inline ln ->
            case ln of
                RichText.Model.Node.Text _ ->
                    True

                RichText.Model.Node.InlineElement l ->
                    Set.member selectable (RichText.Model.Element.annotations (RichText.Model.InlineElement.element l))


annotationsFromBlockNode : RichText.Model.Node.Block -> Set String
annotationsFromBlockNode node =
    RichText.Model.Element.annotations <| RichText.Model.Node.element node


liftConcatMapFunc : RichText.Node.Node -> List RichText.Node.Node
liftConcatMapFunc node =
    case node of
        RichText.Node.Block bn ->
            case RichText.Model.Node.childNodes bn of
                RichText.Model.Node.Leaf ->
                    [ node ]

                RichText.Model.Node.InlineChildren _ ->
                    [ node ]

                RichText.Model.Node.BlockChildren a ->
                    let
                        groupedBlockNodes =
                            List.Extra.groupWhile
                                (\n1 n2 ->
                                    Set.member
                                        lift
                                        (annotationsFromBlockNode n1)
                                        == Set.member
                                            lift
                                            (annotationsFromBlockNode n2)
                                )
                                (Array.toList (RichText.Model.Node.toBlockArray a))
                    in
                    List.map RichText.Node.Block <|
                        List.concatMap
                            (\( n, l ) ->
                                if Set.member lift (annotationsFromBlockNode n) then
                                    n :: l

                                else
                                    [ bn |> RichText.Model.Node.withChildNodes (RichText.Model.Node.blockChildren (Array.fromList <| n :: l)) ]
                            )
                            groupedBlockNodes

        RichText.Node.Inline _ ->
            [ node ]


{-| Lifts nodes that are marked with the lift annotation if possible. Note that if there are multiple
levels of lift annotations, you may have to call this function multiple times.

    markedRoot : Block
    markedRoot =
        addLiftMarkToBlocksInSelection normalizedSelection root

    liftedRoot : Block
    liftedRoot =
        doLift markedRoot

-}
doLift : RichText.Model.Node.Block -> RichText.Model.Node.Block
doLift root =
    RichText.Node.concatMap liftConcatMapFunc root
