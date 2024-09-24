module RichText.List exposing
    ( ListDefinition, ListType(..), listDefinition, defaultListDefinition, ordered, unordered, item
    , defaultCommandMap
    , joinBackward, joinForward, lift, liftEmpty, split, wrap
    , findListItemAncestor, isBeginningOfListItem, isEndOfListItem, isListNode
    )

{-| This module contains definitions, commands, and transforms related to lists.


# Types and definitions

@docs ListDefinition, ListType, listDefinition, defaultListDefinition, ordered, unordered, item


# Commands

@docs defaultCommandMap


## Transforms

@docs joinBackward, joinForward, lift, liftEmpty, split, wrap


# Helpers

@docs findListItemAncestor, isBeginningOfListItem, isEndOfListItem, isListNode

-}

import Array
import List.Extra
import RichText.Annotation
import RichText.Commands
import RichText.Config.Command
import RichText.Config.Keys
import RichText.Definitions
import RichText.Model.Element
import RichText.Model.Node
import RichText.Model.Selection
import RichText.Model.State
import RichText.Model.Text
import RichText.Node


{-| Represents if a list is ordered or unordered.
-}
type ListType
    = Ordered
    | Unordered


{-| A list definition defines which elements represents ordered, unordered, and list items.
-}
type ListDefinition
    = ListDefinition ListDefinitionContents


{-| Creates a list definition
-}
listDefinition : { ordered : RichText.Model.Element.Element, unordered : RichText.Model.Element.Element, item : RichText.Model.Element.Element } -> ListDefinition
listDefinition contents =
    ListDefinition contents


type alias ListDefinitionContents =
    { ordered : RichText.Model.Element.Element, unordered : RichText.Model.Element.Element, item : RichText.Model.Element.Element }


{-| Creates a predefined command map related to lists. You can combine this command map with others
using `RichText.Model.Command.combine`:

    listCommandMap : CommandMap
    listCommandMap = RichText.List.defaultCommandMap defaultListDefinition

    combine listCommandMap RichText.Commands.defaultCommandMap

-}
defaultCommandMap : ListDefinition -> RichText.Config.Command.CommandMap
defaultCommandMap definition =
    let
        backspaceCommand =
            joinBackward definition

        deleteCommand =
            joinForward definition
    in
    RichText.Config.Command.emptyCommandMap
        |> RichText.Config.Command.set [ RichText.Config.Command.inputEvent "insertParagraph", RichText.Config.Command.key [ RichText.Config.Keys.enter ], RichText.Config.Command.key [ RichText.Config.Keys.return ] ]
            [ ( "liftEmptyListItem", RichText.Config.Command.transform <| liftEmpty definition )
            , ( "splitListItem", RichText.Config.Command.transform <| split definition )
            ]
        |> RichText.Config.Command.set [ RichText.Config.Command.inputEvent "deleteContentBackward", RichText.Config.Command.key [ RichText.Config.Keys.backspace ] ]
            [ ( "joinListBackward", RichText.Config.Command.transform <| backspaceCommand ) ]
        |> RichText.Config.Command.set [ RichText.Config.Command.inputEvent "deleteContentForward", RichText.Config.Command.key [ RichText.Config.Keys.delete ] ]
            [ ( "joinListForward", RichText.Config.Command.transform <| deleteCommand ) ]
        |> RichText.Config.Command.set [ RichText.Config.Command.inputEvent "deleteWordBackward", RichText.Config.Command.key [ RichText.Config.Keys.alt, RichText.Config.Keys.backspace ] ]
            [ ( "joinListBackward", RichText.Config.Command.transform <| backspaceCommand ) ]
        |> RichText.Config.Command.set [ RichText.Config.Command.inputEvent "deleteWordForward", RichText.Config.Command.key [ RichText.Config.Keys.alt, RichText.Config.Keys.delete ] ]
            [ ( "joinListForward", RichText.Config.Command.transform <| deleteCommand ) ]


{-| The default list definition, which uses `RichText.Definitions` `orderedList`, `unorderedList` and `listItem`
element definitions.
-}
defaultListDefinition : ListDefinition
defaultListDefinition =
    listDefinition
        { ordered = RichText.Model.Element.element RichText.Definitions.orderedList []
        , unordered = RichText.Model.Element.element RichText.Definitions.unorderedList []
        , item = RichText.Model.Element.element RichText.Definitions.listItem []
        }


{-| Retrieves the element template for list items
-}
item : ListDefinition -> RichText.Model.Element.Element
item definition =
    case definition of
        ListDefinition c ->
            c.item


{-| Retrieves the element template for ordered lists
-}
ordered : ListDefinition -> RichText.Model.Element.Element
ordered definition =
    case definition of
        ListDefinition c ->
            c.ordered


{-| Retrieves the element template for unordered lists
-}
unordered : ListDefinition -> RichText.Model.Element.Element
unordered definition =
    case definition of
        ListDefinition c ->
            c.unordered


addListItem : ListDefinition -> RichText.Model.Node.Block -> RichText.Model.Node.Block
addListItem definition node =
    RichText.Model.Node.block
        (item definition)
        (RichText.Model.Node.blockChildren <|
            Array.fromList [ node ]
        )


{-| Wraps the selection in a list.

    before : State
    before =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block
                            (Element.element paragraph [])
                            (inlineChildren <|
                                Array.fromList
                                    [ plainText "text"
                                    ]
                            )
                        , block
                            (Element.element paragraph [])
                            (inlineChildren <|
                                Array.fromList
                                    [ plainText "text2"
                                    ]
                            )
                        ]
                )
            )
            (Just <| range [ 0, 0 ] 0 [ 1, 0 ] 0)


    after : State
    after =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block (Element.element orderedList [])
                            (blockChildren <|
                                Array.fromList <|
                                    [ block
                                        (Element.element listItem [])
                                        (blockChildren <|
                                            Array.fromList
                                                [ block
                                                    (Element.element paragraph [])
                                                    (inlineChildren <|
                                                        Array.fromList
                                                            [ plainText "text"
                                                            ]
                                                    )
                                                ]
                                        )
                                    , block
                                        (Element.element listItem [])
                                        (blockChildren <|
                                            Array.fromList
                                                [ block
                                                    (Element.element paragraph [])
                                                    (inlineChildren <|
                                                        Array.fromList
                                                            [ plainText "text2"
                                                            ]
                                                    )
                                                ]
                                        )
                                    ]
                            )
                        ]
                )
            )
            (Just <| range [ 0, 0, 0, 0 ] 0 [ 0, 1, 0, 0 ] 0)

    wrap defaultListDefinition Ordered before == Ok after
    --> True

-}
wrap : ListDefinition -> ListType -> RichText.Config.Command.Transform
wrap definition type_ editorState =
    RichText.Commands.wrap (addListItem definition)
        (if type_ == Ordered then
            ordered definition

         else
            unordered definition
        )
        editorState


{-| Finds the closest list item ancestor and path if one exists, otherwise returns `Nothing`.
-}
findListItemAncestor : RichText.Model.Element.Element -> RichText.Model.Node.Path -> RichText.Model.Node.Block -> Maybe ( RichText.Model.Node.Path, RichText.Model.Node.Block )
findListItemAncestor parameters =
    RichText.Node.findAncestor (\n -> RichText.Model.Element.name (RichText.Model.Node.element n) == RichText.Model.Element.name parameters)


{-| Same as `RichText.Commands.splitTextBlock`, but searches for a list item ancestor instead of a text block

    before : State
    before =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block (Element.element orderedList [])
                            (blockChildren <|
                                Array.fromList <|
                                    [ block
                                        (Element.element listItem [])
                                        (blockChildren <|
                                            Array.fromList
                                                [ block
                                                    (Element.element paragraph [])
                                                    (inlineChildren <|
                                                        Array.fromList
                                                            [ plainText "text"
                                                            ]
                                                    )
                                                ]
                                        )
                                    ]
                            )
                        ]
                )
            )
            (Just <| caret [ 0, 0, 0, 0 ] 2)


    after : State
    after =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block (Element.element orderedList [])
                            (blockChildren <|
                                Array.fromList <|
                                    [ block
                                        (Element.element listItem [])
                                        (blockChildren <|
                                            Array.fromList
                                                [ block
                                                    (Element.element paragraph [])
                                                    (inlineChildren <|
                                                        Array.fromList
                                                            [ plainText "te"
                                                            ]
                                                    )
                                                ]
                                        )
                                    , block
                                        (Element.element listItem [])
                                        (blockChildren <|
                                            Array.fromList
                                                [ block
                                                    (Element.element paragraph [])
                                                    (inlineChildren <|
                                                        Array.fromList
                                                            [ plainText "xt"
                                                            ]
                                                    )
                                                ]
                                        )
                                    ]
                            )
                        ]
                )
            )
            (Just <| caret [ 0, 1, 0, 0 ] 0)

    split defaultListDefinition before == Ok after
    --> True

-}
split : ListDefinition -> RichText.Config.Command.Transform
split definition =
    RichText.Commands.splitBlock (findListItemAncestor (item definition))


{-| Returns true if the current node is a ordered or unordered list, false otherwise.
-}
isListNode : ListDefinition -> RichText.Node.Node -> Bool
isListNode definition node =
    case node of
        RichText.Node.Inline _ ->
            False

        RichText.Node.Block bn ->
            let
                bnName =
                    RichText.Model.Element.name (RichText.Model.Node.element bn)
            in
            bnName
                == RichText.Model.Element.name (ordered definition)
                || bnName
                == RichText.Model.Element.name (unordered definition)


addLiftAnnotationAtPathAndChildren : RichText.Model.Node.Path -> RichText.Model.Node.Block -> Result String RichText.Model.Node.Block
addLiftAnnotationAtPathAndChildren path root =
    case RichText.Annotation.addAtPath RichText.Annotation.lift path root of
        Err s ->
            Err s

        Ok newRoot ->
            case RichText.Node.nodeAt path newRoot of
                Nothing ->
                    Err "Invalid path"

                Just node ->
                    case node of
                        RichText.Node.Block bn ->
                            case RichText.Model.Node.childNodes bn of
                                RichText.Model.Node.BlockChildren ba ->
                                    List.foldl
                                        (\i result ->
                                            case result of
                                                Err _ ->
                                                    result

                                                Ok n ->
                                                    RichText.Annotation.addAtPath RichText.Annotation.lift (path ++ [ i ]) n
                                        )
                                        (Ok newRoot)
                                        (List.range 0 (Array.length (RichText.Model.Node.toBlockArray ba) - 1))

                                _ ->
                                    Err "I was expecting a block array to add a lift mark to"

                        _ ->
                            Err "I was expecting a block node to add a lift mark to"


addLiftMarkToListItems : ListDefinition -> RichText.Model.Selection.Selection -> RichText.Model.Node.Block -> Result String RichText.Model.Node.Block
addLiftMarkToListItems definition selection root =
    case findListItemAncestor (item definition) (RichText.Model.Selection.anchorNode selection) root of
        Nothing ->
            Err "There is no list item ancestor at anchor path"

        Just ( start, _ ) ->
            case findListItemAncestor (item definition) (RichText.Model.Selection.focusNode selection) root of
                Nothing ->
                    Err "There is no list item ancestor at focus path"

                Just ( end, _ ) ->
                    if start == end then
                        addLiftAnnotationAtPathAndChildren start root

                    else
                        let
                            ancestor =
                                RichText.Model.Node.commonAncestor start end
                        in
                        case RichText.Node.nodeAt ancestor root of
                            Nothing ->
                                Err "Invalid ancestor path"

                            Just ancestorNode ->
                                if not <| isListNode definition ancestorNode then
                                    Err "I cannot lift list items unless the common ancestor is a list"

                                else
                                    case List.Extra.getAt (List.length ancestor) start of
                                        Nothing ->
                                            Err "Invalid start index"

                                        Just startIndex ->
                                            case List.Extra.getAt (List.length ancestor) end of
                                                Nothing ->
                                                    Err "Invalid end index"

                                                Just endIndex ->
                                                    List.foldl
                                                        (\i result ->
                                                            case result of
                                                                Err _ ->
                                                                    result

                                                                Ok node ->
                                                                    addLiftAnnotationAtPathAndChildren (ancestor ++ [ i ]) node
                                                        )
                                                        (Ok root)
                                                        (List.range startIndex endIndex)


{-| Lifts a list item's contents out of its parent list.

    before : State
    before =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block (Element.element orderedList [])
                            (blockChildren <|
                                Array.fromList <|
                                    [ block
                                        (Element.element listItem [])
                                        (blockChildren <|
                                            Array.fromList
                                                [ block
                                                    (Element.element paragraph [])
                                                    (inlineChildren <|
                                                        Array.fromList
                                                            [ plainText "text"
                                                            ]
                                                    )
                                                ]
                                        )
                                    , block
                                        (Element.element listItem [])
                                        (blockChildren <|
                                            Array.fromList
                                                [ block
                                                    (Element.element paragraph [])
                                                    (inlineChildren <|
                                                        Array.fromList
                                                            [ plainText "text2"
                                                            ]
                                                    )
                                                ]
                                        )
                                    ]
                            )
                        ]
                )
            )
            (Just <| caret [ 0, 0, 0, 0 ] 4)


    after : State
    after =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block
                            (Element.element paragraph [])
                            (inlineChildren <|
                                Array.fromList
                                    [ plainText "text"
                                    ]
                            )
                        , block (Element.element orderedList [])
                            (blockChildren <|
                                Array.fromList <|
                                    [ block
                                        (Element.element listItem [])
                                        (blockChildren <|
                                            Array.fromList
                                                [ block
                                                    (Element.element paragraph [])
                                                    (inlineChildren <|
                                                        Array.fromList
                                                            [ plainText "text2"
                                                            ]
                                                    )
                                                ]
                                        )
                                    ]
                            )
                        ]
                )
            )
            (Just <| caret [ 0, 0 ] 4)

    lift defaultListDefinition before == Ok after
    --> True

-}
lift : ListDefinition -> RichText.Config.Command.Transform
lift definition editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            let
                normalizedSelection =
                    RichText.Model.Selection.normalize selection
            in
            case addLiftMarkToListItems definition normalizedSelection <| RichText.Annotation.annotateSelection normalizedSelection (RichText.Model.State.root editorState) of
                Err s ->
                    Err s

                Ok markedRoot ->
                    let
                        -- this logic looks suspicious... but it seems to work
                        liftedRoot =
                            RichText.Annotation.doLift <| RichText.Annotation.doLift markedRoot

                        newSelection =
                            RichText.Annotation.selectionFromAnnotations liftedRoot (RichText.Model.Selection.anchorOffset normalizedSelection) (RichText.Model.Selection.focusOffset normalizedSelection)
                    in
                    Ok
                        (editorState
                            |> RichText.Model.State.withSelection newSelection
                            |> RichText.Model.State.withRoot (RichText.Annotation.clear RichText.Annotation.lift <| RichText.Annotation.clearSelectionAnnotations liftedRoot)
                        )


{-| Same as `lift` but only will succeed if the list item is empty.

    before : State
    before =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block (Element.element orderedList [])
                            (blockChildren <|
                                Array.fromList <|
                                    [ block
                                        (Element.element listItem [])
                                        (blockChildren <|
                                            Array.fromList
                                                [ block
                                                    (Element.element paragraph [])
                                                    (inlineChildren <|
                                                        Array.fromList
                                                            [ plainText ""
                                                            ]
                                                    )
                                                ]
                                        )
                                    , block
                                        (Element.element listItem [])
                                        (blockChildren <|
                                            Array.fromList
                                                [ block
                                                    (Element.element paragraph [])
                                                    (inlineChildren <|
                                                        Array.fromList
                                                            [ plainText "text2"
                                                            ]
                                                    )
                                                ]
                                        )
                                    ]
                            )
                        ]
                )
            )
            (Just <| caret [ 0, 0, 0, 0 ] 0)


    after : State
    after =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block
                            (Element.element paragraph [])
                            (inlineChildren <|
                                Array.fromList
                                    [ plainText ""
                                    ]
                            )
                        , block (Element.element orderedList [])
                            (blockChildren <|
                                Array.fromList <|
                                    [ block
                                        (Element.element listItem [])
                                        (blockChildren <|
                                            Array.fromList
                                                [ block
                                                    (Element.element paragraph [])
                                                    (inlineChildren <|
                                                        Array.fromList
                                                            [ plainText "text2"
                                                            ]
                                                    )
                                                ]
                                        )
                                    ]
                            )
                        ]
                )
            )
            (Just <| caret [ 0, 0 ] 0)

    liftEmpty defaultListDefinition before == Ok after
    --> True

-}
liftEmpty : ListDefinition -> RichText.Config.Command.Transform
liftEmpty definition editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            if (not <| RichText.Model.Selection.isCollapsed selection) || RichText.Model.Selection.anchorOffset selection /= 0 then
                Err "I can only lift collapsed selections at the beginning of a text node"

            else
                case findListItemAncestor (item definition) (RichText.Model.Selection.anchorNode selection) (RichText.Model.State.root editorState) of
                    Nothing ->
                        Err "No list item ancestor to lift"

                    Just ( _, node ) ->
                        case RichText.Model.Node.childNodes node of
                            RichText.Model.Node.BlockChildren a ->
                                case Array.get 0 (RichText.Model.Node.toBlockArray a) of
                                    Nothing ->
                                        Err "Cannot lift a list item with no children"

                                    Just firstNode ->
                                        if not <| RichText.Node.isEmptyTextBlock (RichText.Node.Block firstNode) then
                                            Err "I cannot lift a node that is not an empty text block"

                                        else
                                            lift definition editorState

                            _ ->
                                Err "I was expecting a list item to have block child nodes"


{-| True if the selection is collapsed at the beginning of a list item, false otherwise.
-}
isBeginningOfListItem : ListDefinition -> RichText.Model.Selection.Selection -> RichText.Model.Node.Block -> Bool
isBeginningOfListItem definition selection root =
    if not <| RichText.Model.Selection.isCollapsed selection then
        False

    else if RichText.Model.Selection.anchorOffset selection /= 0 then
        False

    else
        case findListItemAncestor (item definition) (RichText.Model.Selection.anchorNode selection) root of
            Nothing ->
                False

            Just ( p, _ ) ->
                let
                    relativePath =
                        List.drop (List.length p) (RichText.Model.Selection.anchorNode selection)
                in
                List.all (\i -> i == 0) relativePath


{-| Joins a list item backwards if the selection is at the beginning of a list item, otherwise
fails with an error.

    before : State
    before =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block (Element.element orderedList [])
                            (blockChildren <|
                                Array.fromList <|
                                    [ block
                                        (Element.element listItem [])
                                        (blockChildren <|
                                            Array.fromList
                                                [ block
                                                    (Element.element paragraph [])
                                                    (inlineChildren <|
                                                        Array.fromList
                                                            [ plainText "text"
                                                            ]
                                                    )
                                                ]
                                        )
                                    , block
                                        (Element.element listItem [])
                                        (blockChildren <|
                                            Array.fromList
                                                [ block
                                                    (Element.element paragraph [])
                                                    (inlineChildren <|
                                                        Array.fromList
                                                            [ plainText "text2"
                                                            ]
                                                    )
                                                ]
                                        )
                                    ]
                            )
                        ]
                )
            )
            (Just <| caret [ 0, 1, 0, 0 ] 0)


    after : State
    after =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block (Element.element orderedList [])
                            (blockChildren <|
                                Array.fromList <|
                                    [ block
                                        (Element.element listItem [])
                                        (blockChildren <|
                                            Array.fromList
                                                [ block
                                                    (Element.element paragraph [])
                                                    (inlineChildren <|
                                                        Array.fromList
                                                            [ plainText "text"
                                                            ]
                                                    )
                                                , block
                                                    (Element.element paragraph [])
                                                    (inlineChildren <|
                                                        Array.fromList
                                                            [ plainText "text2"
                                                            ]
                                                    )
                                                ]
                                        )
                                    ]
                            )
                        ]
                )
            )
            (Just <| caret [ 0, 0, 1, 0 ] 0)

    joinBackward defaultListDefinition before == Ok after
    --> True

-}
joinBackward : ListDefinition -> RichText.Config.Command.Transform
joinBackward definition editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            if not <| isBeginningOfListItem definition selection (RichText.Model.State.root editorState) then
                Err "I can only join a list item backward if the selection is the beginning of a list item"

            else
                let
                    normalizedSelection =
                        RichText.Model.Selection.normalize selection

                    markedRoot =
                        RichText.Annotation.annotateSelection normalizedSelection (RichText.Model.State.root editorState)
                in
                case findListItemAncestor (item definition) (RichText.Model.Selection.anchorNode selection) markedRoot of
                    Nothing ->
                        Err "There is no list item selected"

                    Just ( liPath, liNode ) ->
                        -- If this is the first list item in the list, we should do lift logic
                        if List.Extra.last liPath == Just 0 then
                            lift definition editorState

                        else
                            let
                                prevLiPath =
                                    RichText.Model.Node.decrement liPath
                            in
                            case RichText.Node.nodeAt prevLiPath markedRoot of
                                Nothing ->
                                    Err "Invalid list item path"

                                Just prevLiNode ->
                                    case prevLiNode of
                                        RichText.Node.Inline _ ->
                                            Err "There is no list item at path"

                                        RichText.Node.Block prevBn ->
                                            case RichText.Node.joinBlocks prevBn liNode of
                                                Nothing ->
                                                    Err "Could not join list items"

                                                Just joinedLi ->
                                                    let
                                                        joinedNodes =
                                                            RichText.Node.replace prevLiPath (RichText.Node.Block joinedLi) markedRoot
                                                                |> Result.andThen
                                                                    (RichText.Node.replaceWithFragment liPath (RichText.Node.BlockFragment Array.empty))
                                                    in
                                                    case joinedNodes of
                                                        Err s ->
                                                            Err s

                                                        Ok newRoot ->
                                                            Ok
                                                                (editorState
                                                                    |> RichText.Model.State.withSelection
                                                                        (RichText.Annotation.selectionFromAnnotations
                                                                            newRoot
                                                                            (RichText.Model.Selection.anchorOffset selection)
                                                                            (RichText.Model.Selection.focusOffset selection)
                                                                        )
                                                                    |> RichText.Model.State.withRoot (RichText.Annotation.clearSelectionAnnotations newRoot)
                                                                )


{-| True if the selection is collapsed at the end of a list item, false otherwise.
-}
isEndOfListItem : ListDefinition -> RichText.Model.Selection.Selection -> RichText.Model.Node.Block -> Bool
isEndOfListItem definition selection root =
    if not <| RichText.Model.Selection.isCollapsed selection then
        False

    else
        case findListItemAncestor (item definition) (RichText.Model.Selection.anchorNode selection) root of
            Nothing ->
                False

            Just ( path, node ) ->
                let
                    ( lastPath, lastNode ) =
                        RichText.Node.last node
                in
                if RichText.Model.Selection.anchorNode selection /= path ++ lastPath then
                    False

                else
                    case lastNode of
                        RichText.Node.Inline il ->
                            case il of
                                RichText.Model.Node.Text tl ->
                                    String.length (RichText.Model.Text.text tl) == RichText.Model.Selection.anchorOffset selection

                                _ ->
                                    True

                        _ ->
                            True


{-| Joins a list item if the selection is at the end of a list item, otherwise fails with an error.

    before : State
    before =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block (Element.element orderedList [])
                            (blockChildren <|
                                Array.fromList <|
                                    [ block
                                        (Element.element listItem [])
                                        (blockChildren <|
                                            Array.fromList
                                                [ block
                                                    (Element.element paragraph [])
                                                    (inlineChildren <|
                                                        Array.fromList
                                                            [ plainText "text"
                                                            ]
                                                    )
                                                ]
                                        )
                                    , block
                                        (Element.element listItem [])
                                        (blockChildren <|
                                            Array.fromList
                                                [ block
                                                    (Element.element paragraph [])
                                                    (inlineChildren <|
                                                        Array.fromList
                                                            [ plainText "text2"
                                                            ]
                                                    )
                                                ]
                                        )
                                    ]
                            )
                        ]
                )
            )
            (Just <| caret [ 0, 0, 0, 0 ] 4)


    after : State
    after =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block (Element.element orderedList [])
                            (blockChildren <|
                                Array.fromList <|
                                    [ block
                                        (Element.element listItem [])
                                        (blockChildren <|
                                            Array.fromList
                                                [ block
                                                    (Element.element paragraph [])
                                                    (inlineChildren <|
                                                        Array.fromList
                                                            [ plainText "text"
                                                            ]
                                                    )
                                                , block
                                                    (Element.element paragraph [])
                                                    (inlineChildren <|
                                                        Array.fromList
                                                            [ plainText "text2"
                                                            ]
                                                    )
                                                ]
                                        )
                                    ]
                            )
                        ]
                )
            )
            (Just <| caret [ 0, 0, 0, 0 ] 4)

    joinForward defaultListDefinition before == Ok after
    --> True

-}
joinForward : ListDefinition -> RichText.Config.Command.Transform
joinForward definition editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            if not <| isEndOfListItem definition selection (RichText.Model.State.root editorState) then
                Err "I can only join a list item forward if the selection is at the end of a list item"

            else
                let
                    normalizedSelection =
                        RichText.Model.Selection.normalize selection

                    markedRoot =
                        RichText.Annotation.annotateSelection normalizedSelection (RichText.Model.State.root editorState)
                in
                case findListItemAncestor (item definition) (RichText.Model.Selection.anchorNode selection) markedRoot of
                    Nothing ->
                        Err "There is no list item selected"

                    Just ( liPath, liNode ) ->
                        let
                            nextLiPath =
                                RichText.Model.Node.increment liPath
                        in
                        case RichText.Node.nodeAt nextLiPath markedRoot of
                            Nothing ->
                                Err "I cannot join forward a list item if there is no subsequent list item"

                            Just nextLi ->
                                case nextLi of
                                    RichText.Node.Inline _ ->
                                        Err "There is no list item at path"

                                    RichText.Node.Block nextBn ->
                                        case RichText.Node.joinBlocks liNode nextBn of
                                            Nothing ->
                                                Err "I could not join these list items"

                                            Just joinedLi ->
                                                let
                                                    joinedNodes =
                                                        RichText.Node.replace liPath (RichText.Node.Block joinedLi) markedRoot
                                                            |> Result.andThen
                                                                (RichText.Node.replaceWithFragment nextLiPath (RichText.Node.BlockFragment Array.empty))
                                                in
                                                case joinedNodes of
                                                    Err s ->
                                                        Err s

                                                    Ok newRoot ->
                                                        Ok
                                                            (editorState
                                                                |> RichText.Model.State.withSelection (RichText.Annotation.selectionFromAnnotations newRoot (RichText.Model.Selection.anchorOffset selection) (RichText.Model.Selection.focusOffset selection))
                                                                |> RichText.Model.State.withRoot (RichText.Annotation.clearSelectionAnnotations newRoot)
                                                            )
