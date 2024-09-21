module RichText.State exposing
    ( reduce, validate
    , translateReducedTextBlockSelection
    )

{-| This module contains functions to validate and reduce editor state. These methods are used
every time a command is applied.


# State functions

@docs reduce, validate


# Helpers

@docs translateReducedTextBlockSelection

-}

import Array exposing (Array)
import List.Extra
import RichText.Annotation
import RichText.Config.ElementDefinition
import RichText.Config.Spec
import RichText.Internal.Definitions
import RichText.Internal.Spec
import RichText.Model.Element
import RichText.Model.InlineElement
import RichText.Model.Mark
import RichText.Model.Node exposing (Children(..), Inline(..))
import RichText.Model.Selection
import RichText.Model.State exposing (State)
import RichText.Model.Text
import RichText.Node exposing (Node(..))
import Set exposing (Set)


removeExtraEmptyTextLeaves : List Inline -> List Inline
removeExtraEmptyTextLeaves inlineLeaves =
    case inlineLeaves of
        [] ->
            inlineLeaves

        [ _ ] ->
            inlineLeaves

        x :: y :: xs ->
            case x of
                Text xL ->
                    case y of
                        Text yL ->
                            if
                                String.isEmpty (RichText.Model.Text.text xL)
                                    && (not <|
                                            Set.member
                                                RichText.Annotation.selection
                                                (RichText.Model.Text.annotations xL)
                                       )
                            then
                                removeExtraEmptyTextLeaves (y :: xs)

                            else if
                                String.isEmpty (RichText.Model.Text.text yL)
                                    && (not <|
                                            Set.member
                                                RichText.Annotation.selection
                                                (RichText.Model.Text.annotations yL)
                                       )
                            then
                                removeExtraEmptyTextLeaves (x :: xs)

                            else
                                x :: removeExtraEmptyTextLeaves (y :: xs)

                        InlineElement _ ->
                            x :: removeExtraEmptyTextLeaves (y :: xs)

                InlineElement _ ->
                    x :: removeExtraEmptyTextLeaves (y :: xs)


mergeSimilarInlineLeaves : List Inline -> List Inline
mergeSimilarInlineLeaves inlineLeaves =
    case inlineLeaves of
        [] ->
            inlineLeaves

        [ _ ] ->
            inlineLeaves

        x :: y :: xs ->
            case x of
                Text xL ->
                    case y of
                        Text yL ->
                            if RichText.Model.Text.marks xL == RichText.Model.Text.marks yL then
                                mergeSimilarInlineLeaves
                                    (Text
                                        (xL
                                            |> RichText.Model.Text.withText
                                                (RichText.Model.Text.text xL
                                                    ++ RichText.Model.Text.text yL
                                                )
                                        )
                                        :: xs
                                    )

                            else
                                x :: mergeSimilarInlineLeaves (y :: xs)

                        InlineElement _ ->
                            x :: mergeSimilarInlineLeaves (y :: xs)

                InlineElement _ ->
                    x :: mergeSimilarInlineLeaves (y :: xs)


reduceNode : RichText.Model.Node.Block -> RichText.Model.Node.Block
reduceNode node =
    case
        RichText.Node.map
            (\x ->
                case x of
                    RichText.Node.Block bn ->
                        case RichText.Model.Node.childNodes bn of
                            RichText.Model.Node.InlineChildren a ->
                                Block <|
                                    (bn
                                        |> RichText.Model.Node.withChildNodes
                                            (a
                                                |> RichText.Model.Node.toInlineArray
                                                |> Array.toList
                                                |> removeExtraEmptyTextLeaves
                                                |> mergeSimilarInlineLeaves
                                                |> Array.fromList
                                                |> RichText.Model.Node.inlineChildren
                                            )
                                    )

                            _ ->
                                x

                    _ ->
                        x
            )
            (Block node)
    of
        RichText.Node.Block newNode ->
            newNode

        _ ->
            node


{-| Reduces the state with the following rules:

  - Neighboring text nodes with the same marks are merged into one text node
  - Empty text nodes (regardless of marks) that are not part of the current collapsed
    selection are removed if there is another neighboring text node

```
before : RichText.Model.State.State
before =
    state
        (block
            (RichText.Model.Element.element doc [])
            (blockChildren <|
                Array.fromList
                    [ block
                        (RichText.Model.Element.element paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ plainText "te", plainText "xt" ])
                    ]
            )
        )
        (Just <| caret [ 0, 1 ] 2)


after : RichText.Model.State.State
after =
    state
        (block
            (RichText.Model.Element.element doc [])
            (blockChildren <|
                Array.fromList
                    [ block
                        (RichText.Model.Element.element paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ plainText "text" ])
                    ]
            )
        )
        (Just <| caret [ 0, 0 ] 4)

reduce before == after
--> True
```

-}
reduce : RichText.Model.State.State -> RichText.Model.State.State
reduce editorState =
    let
        markedRoot : RichText.Model.Node.Block
        markedRoot =
            case RichText.Model.State.selection editorState of
                Nothing ->
                    RichText.Model.State.root editorState

                Just selection ->
                    RichText.Annotation.annotateSelection selection (RichText.Model.State.root editorState)

        reducedRoot : RichText.Model.Node.Block
        reducedRoot =
            RichText.Annotation.clearSelectionAnnotations <| reduceNode markedRoot
    in
    translateReducedTextBlockSelection reducedRoot editorState


{-| Just the selection translation function that gets called in `reduce`. Note that this is really only
useful if you're creating transforms that merge or remove inline nodes and you can't find a way
to easily figure out the new selection state.
-}
translateReducedTextBlockSelection : RichText.Model.Node.Block -> RichText.Model.State.State -> RichText.Model.State.State
translateReducedTextBlockSelection root state =
    case RichText.Model.State.selection state of
        Nothing ->
            state |> RichText.Model.State.withRoot root

        Just selection ->
            let
                ( aP, aO ) =
                    translatePath (RichText.Model.State.root state)
                        root
                        (RichText.Model.Selection.anchorNode selection)
                        (RichText.Model.Selection.anchorOffset selection)

                ( fP, fO ) =
                    translatePath (RichText.Model.State.root state)
                        root
                        (RichText.Model.Selection.focusNode selection)
                        (RichText.Model.Selection.focusOffset selection)
            in
            state
                |> RichText.Model.State.withRoot root
                |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.range aP aO fP fO)


translatePath : RichText.Model.Node.Block -> RichText.Model.Node.Block -> RichText.Model.Node.Path -> Int -> ( RichText.Model.Node.Path, Int )
translatePath old new path offset =
    case RichText.Node.findTextBlockNodeAncestor path old of
        Nothing ->
            ( path, offset )

        Just ( _, oldN ) ->
            case RichText.Node.findTextBlockNodeAncestor path new of
                Nothing ->
                    ( path, offset )

                Just ( _, newN ) ->
                    if oldN == newN then
                        ( path, offset )

                    else
                        case RichText.Model.Node.childNodes oldN of
                            InlineChildren oldA ->
                                case List.Extra.last path of
                                    Nothing ->
                                        ( path, offset )

                                    Just lastIndex ->
                                        case RichText.Model.Node.childNodes newN of
                                            InlineChildren newA ->
                                                let
                                                    pOff : Int
                                                    pOff =
                                                        parentOffset (RichText.Model.Node.toInlineArray oldA) lastIndex offset

                                                    ( cI, cO ) =
                                                        childOffset (RichText.Model.Node.toInlineArray newA) pOff

                                                    newPath : List Int
                                                    newPath =
                                                        List.take (List.length path - 1) path ++ [ cI ]
                                                in
                                                ( newPath, cO )

                                            _ ->
                                                ( path, offset )

                            _ ->
                                ( path, offset )


parentOffset : Array Inline -> Int -> Int -> Int
parentOffset leaves index offset =
    let
        ( _, newOffset ) =
            Array.foldl
                (\l ( i, accOffset ) ->
                    case l of
                        Text tl ->
                            ( i + 1
                            , if i < index then
                                accOffset + String.length (RichText.Model.Text.text tl)

                              else
                                accOffset
                            )

                        InlineElement _ ->
                            ( i + 1
                            , if i < index then
                                accOffset + 1

                              else
                                accOffset
                            )
                )
                ( 0, offset )
                leaves
    in
    newOffset


childOffset : Array Inline -> Int -> ( Int, Int )
childOffset leaves offset =
    let
        ( newIndex, newOffset, _ ) =
            Array.foldl
                (\l ( i, accOffset, done ) ->
                    if done then
                        ( i, accOffset, done )

                    else if accOffset <= 0 then
                        ( i, accOffset, True )

                    else
                        case l of
                            Text tl ->
                                if accOffset <= String.length (RichText.Model.Text.text tl) then
                                    ( i, accOffset, True )

                                else
                                    ( i + 1, accOffset - String.length (RichText.Model.Text.text tl), False )

                            InlineElement _ ->
                                ( i + 1, accOffset - 1, False )
                )
                ( 0, offset, False )
                leaves
    in
    ( newIndex, newOffset )


{-| Validates the state against the spec and returns the valid state if everything is okay, otherwise
returns a comma separated string of error messages.

    example : RichText.Model.State.State
    example =
        state
            (block
                (RichText.Model.Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block
                            (RichText.Model.Element.element paragraph [])
                            (RichText.Model.Node.inlineChildren <| Array.fromList [ plainText "text" ])
                        ]
                )
            )
            (Just <| caret [ 0, 0 ] 2)

    (Ok example) == (validate markdown example)
    --> True

-}
validate : RichText.Config.Spec.Spec -> RichText.Model.State.State -> Result String State
validate spec editorState =
    let
        root : RichText.Model.Node.Block
        root =
            RichText.Model.State.root editorState
    in
    case validateEditorBlockNode spec (Just <| Set.singleton "root") root of
        [] ->
            Ok editorState

        result ->
            Err <| String.join ", " result


validateAllowedMarks : Maybe (Set String) -> Inline -> List String
validateAllowedMarks allowedMarks leaf =
    case allowedMarks of
        Nothing ->
            []

        Just allowed ->
            let
                notAllowed : Set String
                notAllowed =
                    Set.diff
                        (leaf
                            |> RichText.Model.Node.marks
                            |> List.map RichText.Model.Mark.name
                            |> Set.fromList
                        )
                        allowed
            in
            if Set.isEmpty notAllowed then
                []

            else
                [ "Inline node is only allowed the following marks: "
                    ++ String.join "," (Set.toList allowed)
                    ++ ", but found "
                    ++ String.join "," (Set.toList notAllowed)
                ]


validateInlineLeaf : RichText.Config.Spec.Spec -> Maybe (Set String) -> Maybe (Set String) -> Inline -> List String
validateInlineLeaf spec allowedGroups allowedMarks leaf =
    validateAllowedMarks allowedMarks leaf
        ++ (case leaf of
                RichText.Model.Node.Text _ ->
                    []

                RichText.Model.Node.InlineElement il ->
                    let
                        definition : RichText.Config.ElementDefinition.ElementDefinition
                        definition =
                            RichText.Internal.Spec.elementDefinitionWithDefault
                                (RichText.Model.InlineElement.element il)
                                spec
                    in
                    validateAllowedGroups allowedGroups
                        (RichText.Config.ElementDefinition.group definition)
                        (RichText.Config.ElementDefinition.name definition)
           )


validateAllowedGroups : Maybe (Set String) -> String -> String -> List String
validateAllowedGroups allowedGroups group name =
    case allowedGroups of
        Nothing ->
            []

        Just groups ->
            if Set.member group groups then
                []

            else if Set.member name groups then
                []

            else
                [ "Group "
                    ++ group
                    ++ " is not in allowed groups ["
                    ++ String.join ", " (Set.toList groups)
                    ++ "]"
                ]


validateEditorBlockNode : RichText.Config.Spec.Spec -> Maybe (Set String) -> RichText.Model.Node.Block -> List String
validateEditorBlockNode spec allowedGroups node =
    let
        parameters : RichText.Model.Element.Element
        parameters =
            RichText.Model.Node.element node

        definition : RichText.Config.ElementDefinition.ElementDefinition
        definition =
            RichText.Internal.Spec.elementDefinitionWithDefault parameters spec

        allowedGroupsErrors : List String
        allowedGroupsErrors =
            validateAllowedGroups allowedGroups
                (RichText.Config.ElementDefinition.group definition)
                (RichText.Config.ElementDefinition.name definition)
    in
    if not <| List.isEmpty allowedGroupsErrors then
        allowedGroupsErrors

    else
        let
            contentType : RichText.Config.ElementDefinition.ContentType
            contentType =
                RichText.Config.ElementDefinition.contentType definition
        in
        case RichText.Model.Node.childNodes node of
            BlockChildren ba ->
                case contentType of
                    RichText.Internal.Definitions.BlockNodeType groups ->
                        List.concatMap
                            (validateEditorBlockNode spec groups)
                            (Array.toList (RichText.Model.Node.toBlockArray ba))

                    _ ->
                        [ "I was expecting textblock content type, but instead I got "
                            ++ RichText.Internal.Definitions.toStringContentType contentType
                        ]

            InlineChildren la ->
                case contentType of
                    RichText.Internal.Definitions.TextBlockNodeType config ->
                        List.concatMap (validateInlineLeaf spec config.allowedGroups config.allowedMarks) (Array.toList (RichText.Model.Node.toInlineArray la))

                    _ ->
                        [ "I was expecting textblock content type, but instead I got " ++ RichText.Internal.Definitions.toStringContentType contentType ]

            Leaf ->
                if contentType == RichText.Config.ElementDefinition.blockLeaf then
                    []

                else
                    [ "I was expecting leaf blockleaf content type, but instead I got "
                        ++ RichText.Internal.Definitions.toStringContentType contentType
                    ]
