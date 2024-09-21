module RichText.Commands exposing
    ( defaultCommandMap, defaultInputEventCommand, defaultKeyCommand
    , removeRange, removeRangeAndInsert, removeSelectedLeafElement
    , backspaceBlock, backspaceInlineElement, backspaceText, backspaceWord, selectBackward
    , deleteBlock, deleteInlineElement, deleteText, deleteWord, selectForward
    , insertBlock, insertInline, insertLineBreak, insertText, insertNewline, insertAfterBlockLeaf
    , joinBackward, joinForward
    , lift, liftEmpty
    , splitBlock, splitBlockHeaderToNewParagraph, splitTextBlock
    , toggleTextBlock, toggleMark
    , selectAll
    , wrap
    )

{-| This module contains pre defined commands and transforms, which are the building blocks for
modifying the editor.


# Commands

@docs defaultCommandMap, defaultInputEventCommand, defaultKeyCommand


# Transforms


## Remove selection

@docs removeRange, removeRangeAndInsert, removeSelectedLeafElement


## Backspace

@docs backspaceBlock, backspaceInlineElement, backspaceText, backspaceWord, selectBackward


## Deletion

@docs deleteBlock, deleteInlineElement, deleteText, deleteWord, selectForward


## Insert

@docs insertBlock, insertInline, insertLineBreak, insertText, insertNewline, insertAfterBlockLeaf


## Join

@docs joinBackward, joinForward


## Lift

@docs lift, liftEmpty


## Split

@docs splitBlock, splitBlockHeaderToNewParagraph, splitTextBlock


## Toggle

Toggle commands for elements and marks

@docs toggleTextBlock, toggleMark


## Selection

@docs selectAll


## Wrap

@docs wrap

-}

import Array
import Array.Extra
import List.Extra
import Regex
import RichText.Annotation
import RichText.Config.Command
import RichText.Config.Keys
import RichText.Definitions
import RichText.Internal.DeleteWord
import RichText.Internal.Event
import RichText.Model.Element
import RichText.Model.InlineElement
import RichText.Model.Mark
import RichText.Model.Node
import RichText.Model.Selection exposing (anchorNode)
import RichText.Model.State
import RichText.Model.Text
import RichText.Node
import RichText.State


backspaceCommands =
    [ ( "removeRange", RichText.Config.Command.transform removeRange )
    , ( "removeSelectedLeafElementCommand", RichText.Config.Command.transform removeSelectedLeafElement )
    , ( "backspaceInlineElement", RichText.Config.Command.transform backspaceInlineElement )
    , ( "backspaceBlock", RichText.Config.Command.transform backspaceBlock )
    , ( "joinBackward", RichText.Config.Command.transform joinBackward )
    , ( "selectBackward", RichText.Config.Command.transform selectBackward )
    ]


deleteCommands =
    [ ( "removeRange", RichText.Config.Command.transform removeRange )
    , ( "removeSelectedLeafElementCommand", RichText.Config.Command.transform removeSelectedLeafElement )
    , ( "deleteInlineElement", RichText.Config.Command.transform deleteInlineElement )
    , ( "deleteBlock", RichText.Config.Command.transform deleteBlock )
    , ( "joinForward", RichText.Config.Command.transform joinForward )
    , ( "selectForward", RichText.Config.Command.transform selectForward )
    ]


{-| A starting point for creating your own command map. Contains deletion, line break, lift,
split, select all, and undo/redo behavior.
-}
defaultCommandMap : RichText.Config.Command.CommandMap
defaultCommandMap =
    RichText.Config.Command.emptyCommandMap
        |> RichText.Config.Command.set
            [ RichText.Config.Command.inputEvent "insertLineBreak", RichText.Config.Command.key [ RichText.Config.Keys.shift, RichText.Config.Keys.enter ], RichText.Config.Command.key [ RichText.Config.Keys.shift, RichText.Config.Keys.return ] ]
            [ ( "insertLineBreak", RichText.Config.Command.transform insertLineBreak ) ]
        |> RichText.Config.Command.set [ RichText.Config.Command.inputEvent "insertParagraph", RichText.Config.Command.key [ RichText.Config.Keys.enter ], RichText.Config.Command.key [ RichText.Config.Keys.return ] ]
            [ ( "liftEmpty", RichText.Config.Command.transform liftEmpty ), ( "splitTextBlock", RichText.Config.Command.transform splitTextBlock ) ]
        |> RichText.Config.Command.set [ RichText.Config.Command.inputEvent "deleteContentBackward", RichText.Config.Command.key [ RichText.Config.Keys.backspace ] ]
            (backspaceCommands ++ [ ( "backspaceText", RichText.Config.Command.transform backspaceText ) ])
        |> RichText.Config.Command.set [ RichText.Config.Command.inputEvent "deleteWordBackward", RichText.Config.Command.key [ RichText.Config.Keys.alt, RichText.Config.Keys.backspace ] ]
            (backspaceCommands ++ [ ( "backspaceWord", RichText.Config.Command.transform backspaceWord ) ])
        |> RichText.Config.Command.set [ RichText.Config.Command.inputEvent "deleteContentForward", RichText.Config.Command.key [ RichText.Config.Keys.delete ] ]
            (deleteCommands ++ [ ( "deleteText", RichText.Config.Command.transform deleteText ) ])
        |> RichText.Config.Command.set [ RichText.Config.Command.inputEvent "deleteWordForward", RichText.Config.Command.key [ RichText.Config.Keys.alt, RichText.Config.Keys.delete ] ]
            (deleteCommands ++ [ ( "deleteWord", RichText.Config.Command.transform deleteWord ) ])
        |> RichText.Config.Command.set [ RichText.Config.Command.key [ RichText.Config.Keys.short, "a" ] ]
            [ ( "selectAll", RichText.Config.Command.transform selectAll ) ]
        |> RichText.Config.Command.set [ RichText.Config.Command.inputEvent "historyUndo", RichText.Config.Command.key [ RichText.Config.Keys.short, "z" ] ]
            [ ( "undo", RichText.Config.Command.internal RichText.Config.Command.Undo ) ]
        |> RichText.Config.Command.set [ RichText.Config.Command.inputEvent "historyRedo", RichText.Config.Command.key [ RichText.Config.Keys.short, RichText.Config.Keys.shift, "z" ] ]
            [ ( "redo", RichText.Config.Command.internal RichText.Config.Command.Redo ) ]
        |> RichText.Config.Command.withDefaultKeyCommand defaultKeyCommand
        |> RichText.Config.Command.withDefaultInputEventCommand defaultInputEventCommand


{-| The default key command does remove range when a range is selected and a regular
key is pressed. In this case, we want to remove range and insert the character related to that key.
-}
defaultKeyCommand : RichText.Internal.Event.KeyboardEvent -> RichText.Config.Command.NamedCommandList
defaultKeyCommand event =
    if not event.altKey && not event.metaKey && not event.ctrlKey && String.length event.key == 1 then
        [ ( "removeRangeAndInsert", RichText.Config.Command.transform <| removeRangeAndInsert event.key ) ]

    else
        []


{-| The default input event command does remove range when a range is selected and an insertText
event occurs. In this case, we want to remove range and insert the text related to the input
data.
-}
defaultInputEventCommand : RichText.Internal.Event.InputEvent -> RichText.Config.Command.NamedCommandList
defaultInputEventCommand event =
    if event.inputType == "insertText" then
        case event.data of
            Nothing ->
                []

            Just data ->
                [ ( "removeRangeAndInsert", RichText.Config.Command.transform <| removeRangeAndInsert data ) ]

    else
        []


{-| Removes the contents in the state's range selection and optionally
inserts the given text if possible. Returns an error if the selection is collapsed or
it cannot remove the selection.

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
                                    [ plainText "hello"
                                    , inlineElement (Element.element image []) []
                                    , plainText "world"
                                    ]
                            )
                        ]
                )
            )
            (Just <| range [ 0, 0 ] 2 [ 0, 2 ] 2)

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
                                    [ plainText "het"
                                    , plainText "rld"
                                    ]
                            )
                        ]
                )
            )
            (Just <| caret [ 0, 0 ] 3)

    removeRangeAndInsert "t" before == Ok after
    --> True

-}
removeRangeAndInsert : String -> RichText.Config.Command.Transform
removeRangeAndInsert s editorState =
    Result.map
        (\removedRangeEditorState ->
            Result.withDefault
                removedRangeEditorState
                (insertText s removedRangeEditorState)
        )
        (removeRange editorState)


{-| Insert a substring at the specified index. (derived from String.Extra)

    insertAt "world" 6 "Hello " == "Hello world"

-}
insertAt : String -> Int -> String -> String
insertAt insert pos string =
    String.slice 0 pos string ++ insert ++ String.slice pos (String.length string) string


{-| Inserts text at the state's selection, otherwise returns an error.

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
                        ]
                )
            )
            (Just <| caret [ 0, 0 ] 2)


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
                                    [ plainText "teinsertxt" ]
                            )
                        ]
                )
            )
            (Just <| caret [ 0, 0 ] 8)

    insertText before == Ok after
    --> True

-}
insertText : String -> RichText.Config.Command.Transform
insertText s editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            if not <| RichText.Model.Selection.isCollapsed selection then
                removeRange editorState |> Result.andThen (insertText s)

            else
                case RichText.Node.nodeAt (RichText.Model.Selection.anchorNode selection) (RichText.Model.State.root editorState) of
                    Nothing ->
                        Err "Invalid selection after remove range"

                    Just node ->
                        case node of
                            RichText.Node.Block _ ->
                                Err "I was expecting a text leaf, but instead I found a block node"

                            RichText.Node.Inline il ->
                                case il of
                                    RichText.Model.Node.InlineElement _ ->
                                        Err "I was expecting a text leaf, but instead found an inline element"

                                    RichText.Model.Node.Text tl ->
                                        let
                                            newText =
                                                insertAt s (RichText.Model.Selection.anchorOffset selection) (RichText.Model.Text.text tl)

                                            newTextLeaf =
                                                RichText.Model.Node.Text (tl |> RichText.Model.Text.withText newText)
                                        in
                                        case
                                            RichText.Node.replace
                                                (RichText.Model.Selection.anchorNode selection)
                                                (RichText.Node.Inline newTextLeaf)
                                                (RichText.Model.State.root editorState)
                                        of
                                            Err e ->
                                                Err e

                                            Ok newRoot ->
                                                Ok
                                                    (editorState
                                                        |> RichText.Model.State.withRoot newRoot
                                                        |> RichText.Model.State.withSelection
                                                            (Just <|
                                                                RichText.Model.Selection.caret
                                                                    (RichText.Model.Selection.anchorNode selection)
                                                                    (RichText.Model.Selection.anchorOffset selection + String.length s)
                                                            )
                                                    )


{-| If the selection is collapsed and at the start of a text block, tries to join the current
block the previous one. Otherwise, returns an error.

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
            (Just <| caret [ 1, 0 ] 0)


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
                                    , plainText "text2"
                                    ]
                            )
                        ]
                )
            )
            (Just <| caret [ 0, 0 ] 4)

    joinBackward before == Ok after
    --> True

-}
joinBackward : RichText.Config.Command.Transform
joinBackward editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            if not <| RichText.Node.selectionIsBeginningOfTextBlock selection (RichText.Model.State.root editorState) then
                Err "I can only join backward if the selection is at beginning of a text block"

            else
                case RichText.Node.findTextBlockNodeAncestor (RichText.Model.Selection.anchorNode selection) (RichText.Model.State.root editorState) of
                    Nothing ->
                        Err "There is no text block at the selection"

                    Just ( textBlockPath, _ ) ->
                        case findPreviousTextBlock textBlockPath (RichText.Model.State.root editorState) of
                            Nothing ->
                                Err "There is no text block I can join backward with"

                            Just ( p, n ) ->
                                -- We're going to transpose this into joinForward by setting the selection to the end of the
                                -- given text block
                                case RichText.Model.Node.childNodes n of
                                    RichText.Model.Node.InlineChildren a ->
                                        let
                                            array =
                                                RichText.Model.Node.toInlineArray a
                                        in
                                        case Array.get (Array.length array - 1) array of
                                            Nothing ->
                                                Err "There must be at least one element in the inline node to join with"

                                            Just leaf ->
                                                let
                                                    newSelection =
                                                        case leaf of
                                                            RichText.Model.Node.Text tl ->
                                                                RichText.Model.Selection.caret
                                                                    (p ++ [ Array.length array - 1 ])
                                                                    (String.length (RichText.Model.Text.text tl))

                                                            RichText.Model.Node.InlineElement _ ->
                                                                RichText.Model.Selection.caret
                                                                    (p ++ [ Array.length array - 1 ])
                                                                    0
                                                in
                                                joinForward
                                                    (editorState
                                                        |> RichText.Model.State.withSelection (Just newSelection)
                                                    )

                                    _ ->
                                        Err "I can only join with text blocks"


{-| If the selection is collapsed and at the end of a text block, tries to join the current
block the next one. Otherwise, returns an error.

    before : State
    before =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block
                            (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ plainText "text" ])
                        , block
                            (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ plainText "text2" ])
                        ]
                )
            )
            (Just <| caret [ 0, 0 ] 4)


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
                                    , plainText "text2"
                                    ]
                            )
                        ]
                )
            )
            (Just <| caret [ 0, 0 ] 4)

    joinForward before == Ok after
    --> True

-}
joinForward : RichText.Config.Command.Transform
joinForward editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            if not <| RichText.Node.selectionIsEndOfTextBlock selection (RichText.Model.State.root editorState) then
                Err "I can only join forward if the selection is at end of a text block"

            else
                case RichText.Node.findTextBlockNodeAncestor (RichText.Model.Selection.anchorNode selection) (RichText.Model.State.root editorState) of
                    Nothing ->
                        Err "The selection has no text block ancestor"

                    Just ( p1, n1 ) ->
                        case findNextTextBlock (RichText.Model.Selection.anchorNode selection) (RichText.Model.State.root editorState) of
                            Nothing ->
                                Err "There is no text block I can join forward with"

                            Just ( p2, n2 ) ->
                                case RichText.Node.joinBlocks n1 n2 of
                                    Nothing ->
                                        Err <|
                                            "I could not join these two blocks at"
                                                ++ RichText.Model.Node.toString p1
                                                ++ " ,"
                                                ++ RichText.Model.Node.toString p2

                                    Just newBlock ->
                                        let
                                            removed =
                                                RichText.Node.removeNodeAndEmptyParents p2 (RichText.Model.State.root editorState)
                                        in
                                        case RichText.Node.replace p1 (RichText.Node.Block newBlock) removed of
                                            Err e ->
                                                Err e

                                            Ok b ->
                                                Ok
                                                    (editorState
                                                        |> RichText.Model.State.withRoot b
                                                    )


isTextBlock : RichText.Model.Node.Path -> RichText.Node.Node -> Bool
isTextBlock _ node =
    case node of
        RichText.Node.Block bn ->
            case RichText.Model.Node.childNodes bn of
                RichText.Model.Node.InlineChildren _ ->
                    True

                _ ->
                    False

        _ ->
            False


type alias FindFunc =
    (RichText.Model.Node.Path -> RichText.Node.Node -> Bool) -> RichText.Model.Node.Path -> RichText.Model.Node.Block -> Maybe ( RichText.Model.Node.Path, RichText.Node.Node )


findTextBlock : FindFunc -> RichText.Model.Node.Path -> RichText.Model.Node.Block -> Maybe ( RichText.Model.Node.Path, RichText.Model.Node.Block )
findTextBlock findFunc path node =
    case
        findFunc
            isTextBlock
            path
            node
    of
        Nothing ->
            Nothing

        Just ( p, n ) ->
            case n of
                RichText.Node.Block bn ->
                    Just ( p, bn )

                _ ->
                    Nothing


findNextTextBlock : RichText.Model.Node.Path -> RichText.Model.Node.Block -> Maybe ( RichText.Model.Node.Path, RichText.Model.Node.Block )
findNextTextBlock =
    findTextBlock RichText.Node.findForwardFromExclusive


findPreviousTextBlock : RichText.Model.Node.Path -> RichText.Model.Node.Block -> Maybe ( RichText.Model.Node.Path, RichText.Model.Node.Block )
findPreviousTextBlock =
    findTextBlock RichText.Node.findBackwardFromExclusive


{-| Delete the nodes in the selection, if there is one. Succeeds if the selection is a range
selection and a successful remove operation occurred, otherwise returns the error describing why
removing the nodes failed.

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
                                    [ plainText "hello"
                                    , inlineElement (Element.element image []) []
                                    , plainText "world"
                                    ]
                            )
                        ]
                )
            )
            (Just <| range [ 0, 0 ] 2 [ 0, 2 ] 2)

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
                                   [ plainText "he"
                                   , plainText "rld"
                                   ]
                           )
                       ]
               )
           )
           (Just <| caret [ 0, 0 ] 2)

    removeRange before == Ok after
    --> True

-}
removeRange : RichText.Config.Command.Transform
removeRange editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            if RichText.Model.Selection.isCollapsed selection then
                Err "Cannot remove contents of collapsed selection"

            else
                let
                    normalizedSelection =
                        RichText.Model.Selection.normalize selection
                in
                if RichText.Model.Selection.anchorNode normalizedSelection == RichText.Model.Selection.focusNode normalizedSelection then
                    case
                        removeNodeOrTextWithRange
                            (RichText.Model.Selection.anchorNode normalizedSelection)
                            (RichText.Model.Selection.anchorOffset normalizedSelection)
                            (Just (RichText.Model.Selection.focusOffset normalizedSelection))
                            (RichText.Model.State.root editorState)
                    of
                        Ok ( newRoot, _ ) ->
                            let
                                newSelection =
                                    RichText.Model.Selection.caret (RichText.Model.Selection.anchorNode normalizedSelection) (RichText.Model.Selection.anchorOffset normalizedSelection)
                            in
                            Ok
                                (editorState
                                    |> RichText.Model.State.withRoot newRoot
                                    |> RichText.Model.State.withSelection (Just newSelection)
                                )

                        Err s ->
                            Err s

                else
                    case
                        if RichText.Model.Selection.focusOffset normalizedSelection == 0 then
                            Ok ( RichText.Model.State.root editorState, Nothing )

                        else
                            removeNodeOrTextWithRange (RichText.Model.Selection.focusNode normalizedSelection)
                                0
                                (Just (RichText.Model.Selection.focusOffset normalizedSelection))
                                (RichText.Model.State.root editorState)
                    of
                        Err s ->
                            Err s

                        Ok ( removedEnd, _ ) ->
                            let
                                removedNodes =
                                    RichText.Node.removeInRange
                                        (RichText.Model.Node.increment (RichText.Model.Selection.anchorNode normalizedSelection))
                                        (RichText.Model.Node.decrement (RichText.Model.Selection.focusNode normalizedSelection))
                                        removedEnd
                            in
                            case
                                removeNodeOrTextWithRange
                                    (RichText.Model.Selection.anchorNode normalizedSelection)
                                    (RichText.Model.Selection.anchorOffset normalizedSelection)
                                    Nothing
                                    removedNodes
                            of
                                Err s ->
                                    Err s

                                Ok ( removedStart, maybePath ) ->
                                    let
                                        anchorTextBlock =
                                            RichText.Node.findTextBlockNodeAncestor
                                                (RichText.Model.Selection.anchorNode normalizedSelection)
                                                (RichText.Model.State.root editorState)

                                        newSelection =
                                            Maybe.map
                                                (\( p, n ) ->
                                                    let
                                                        offset =
                                                            case n of
                                                                RichText.Node.Inline i ->
                                                                    case i of
                                                                        RichText.Model.Node.Text t ->
                                                                            String.length <| RichText.Model.Text.text t

                                                                        _ ->
                                                                            0

                                                                _ ->
                                                                    0
                                                    in
                                                    RichText.Model.Selection.caret
                                                        p
                                                        offset
                                                )
                                                maybePath

                                        defaultedSelection =
                                            case newSelection of
                                                Nothing ->
                                                    Maybe.map
                                                        (\( p, _ ) -> RichText.Model.Selection.caret p 0)
                                                        (RichText.Node.findForwardFrom (\_ n -> RichText.Annotation.isSelectable n) [] removedStart)

                                                Just _ ->
                                                    newSelection

                                        newEditorState =
                                            editorState
                                                |> RichText.Model.State.withRoot removedStart
                                                |> RichText.Model.State.withSelection defaultedSelection
                                    in
                                    case anchorTextBlock of
                                        Nothing ->
                                            Ok newEditorState

                                        Just ( ap, _ ) ->
                                            let
                                                focusTextBlock =
                                                    RichText.Node.findTextBlockNodeAncestor
                                                        (RichText.Model.Selection.focusNode normalizedSelection)
                                                        (RichText.Model.State.root editorState)
                                            in
                                            case focusTextBlock of
                                                Nothing ->
                                                    Ok newEditorState

                                                Just ( fp, _ ) ->
                                                    if ap == fp then
                                                        Ok newEditorState

                                                    else
                                                        Ok <| Result.withDefault newEditorState (joinForward newEditorState)


{-| Inserts a hard break at the current selection.

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
                        ]
                )
            )
            (Just <| caret [ 0, 0 ] 2)


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
                                    [ plainText "te"
                                    , inlineElement (Element.element hardBreak []) []
                                    , plainText "xt"
                                    ]
                            )
                        ]
                )
            )
            (Just <| caret [ 0, 2 ] 0)

    insertLineBreak before == Ok after
    --> True

-}
insertLineBreak : RichText.Config.Command.Transform
insertLineBreak =
    insertInline
        (RichText.Model.Node.inlineElement (RichText.Model.Element.element RichText.Definitions.hardBreak []) [])


{-| Inserts the inline at the current selection. If the inline is selectable,
it selects it at offset 0, otherwise the selection becomes the next selectable item if it exists.
Returns an error if it cannot insert.

    img : Inline
    img =
        inlineElement (Element.element image []) []

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
                        ]
                )
            )
            (Just <| caret [ 0, 0 ] 2)

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
                                    [ plainText "te"
                                    , img
                                    , plainText "xt"
                                    ]
                            )
                        ]
                )
            )
            (Just <| caret [ 0, 1 ] 0)

    insertInline before == Ok after
    --> True

-}
insertInline : RichText.Model.Node.Inline -> RichText.Config.Command.Transform
insertInline leaf editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            if not <| RichText.Model.Selection.isCollapsed selection then
                removeRange editorState |> Result.andThen (insertInline leaf)

            else
                case RichText.Node.nodeAt (RichText.Model.Selection.anchorNode selection) (RichText.Model.State.root editorState) of
                    Nothing ->
                        Err "Invalid selection"

                    Just node ->
                        case node of
                            RichText.Node.Inline il ->
                                case il of
                                    RichText.Model.Node.InlineElement _ ->
                                        case
                                            RichText.Node.replace
                                                (RichText.Model.Selection.anchorNode selection)
                                                (RichText.Node.Inline leaf)
                                                (RichText.Model.State.root editorState)
                                        of
                                            Err e ->
                                                Err e

                                            Ok newRoot ->
                                                let
                                                    newSelection =
                                                        case
                                                            RichText.Node.findForwardFrom
                                                                (\_ n -> RichText.Annotation.isSelectable n)
                                                                (RichText.Model.Selection.anchorNode selection)
                                                                newRoot
                                                        of
                                                            Nothing ->
                                                                Nothing

                                                            Just ( p, _ ) ->
                                                                Just (RichText.Model.Selection.caret p 0)
                                                in
                                                Ok
                                                    (editorState
                                                        |> RichText.Model.State.withRoot newRoot
                                                        |> RichText.Model.State.withSelection newSelection
                                                    )

                                    RichText.Model.Node.Text tl ->
                                        let
                                            ( before, after ) =
                                                RichText.Node.splitTextLeaf (RichText.Model.Selection.anchorOffset selection) tl
                                        in
                                        case
                                            RichText.Node.replaceWithFragment
                                                (RichText.Model.Selection.anchorNode selection)
                                                (RichText.Node.InlineFragment
                                                    (Array.fromList
                                                        [ RichText.Model.Node.Text before, leaf, RichText.Model.Node.Text after ]
                                                    )
                                                )
                                                (RichText.Model.State.root editorState)
                                        of
                                            Err e ->
                                                Err e

                                            Ok newRoot ->
                                                let
                                                    newSelection =
                                                        case
                                                            RichText.Node.findForwardFromExclusive
                                                                (\_ n -> RichText.Annotation.isSelectable n)
                                                                (RichText.Model.Selection.anchorNode selection)
                                                                newRoot
                                                        of
                                                            Nothing ->
                                                                Nothing

                                                            Just ( p, _ ) ->
                                                                Just (RichText.Model.Selection.caret p 0)
                                                in
                                                Ok
                                                    (editorState
                                                        |> RichText.Model.State.withRoot newRoot
                                                        |> RichText.Model.State.withSelection newSelection
                                                    )

                            _ ->
                                Err "I can not insert an inline element if a block is selected"


{-| Same as `splitBlock` but the searches for a text block ancestor if one exists.

    before : State
    before =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ plainText "" ])
                        ]
                )
            )
            (Just <| caret [ 0, 0 ] 0)


    after : State
    after =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ plainText "" ])
                        , block (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ plainText "" ])
                        ]
                )
            )
            (Just <| caret [ 1, 0 ] 0)

    splitTextBlock before == Ok after
    --> True

-}
splitTextBlock : RichText.Config.Command.Transform
splitTextBlock =
    splitBlock RichText.Node.findTextBlockNodeAncestor


{-| Split the ancestor block determined by the passed in function of the selection.
If the selection is a range selection, also delete its content.

    before : State
    before =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ plainText "" ])
                        ]
                )
            )
            (Just <| caret [ 0, 0 ] 0)


    after : State
    after =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ plainText "" ])
                        , block (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ plainText "" ])
                        ]
                )
            )
            (Just <| caret [ 1, 0 ] 0)

    splitBlock findTextBlockAncestor before == Ok after
    --> True

-}
splitBlock : (RichText.Model.Node.Path -> RichText.Model.Node.Block -> Maybe ( RichText.Model.Node.Path, RichText.Model.Node.Block )) -> RichText.Config.Command.Transform
splitBlock ancestorFunc editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            if not <| RichText.Model.Selection.isCollapsed selection then
                removeRange editorState |> Result.andThen (splitBlock ancestorFunc)

            else
                case ancestorFunc (RichText.Model.Selection.anchorNode selection) (RichText.Model.State.root editorState) of
                    Nothing ->
                        Err "I cannot find a proper ancestor to split"

                    Just ( ancestorPath, ancestorNode ) ->
                        let
                            relativePath =
                                List.drop (List.length ancestorPath) (RichText.Model.Selection.anchorNode selection)
                        in
                        case RichText.Node.splitBlockAtPathAndOffset relativePath (RichText.Model.Selection.anchorOffset selection) ancestorNode of
                            Nothing ->
                                Err <| "Can not split block at path " ++ RichText.Model.Node.toString (RichText.Model.Selection.anchorNode selection)

                            Just ( before, after ) ->
                                case
                                    RichText.Node.replaceWithFragment
                                        ancestorPath
                                        (RichText.Node.BlockFragment (Array.fromList [ before, after ]))
                                        (RichText.Model.State.root editorState)
                                of
                                    Err s ->
                                        Err s

                                    Ok newRoot ->
                                        let
                                            newSelectionPath =
                                                RichText.Model.Node.increment ancestorPath
                                                    ++ List.repeat
                                                        (List.length (RichText.Model.Selection.anchorNode selection) - List.length ancestorPath)
                                                        0

                                            newSelection =
                                                RichText.Model.Selection.caret newSelectionPath 0
                                        in
                                        Ok
                                            (editorState
                                                |> RichText.Model.State.withRoot newRoot
                                                |> RichText.Model.State.withSelection (Just newSelection)
                                            )


isLeafNode : RichText.Model.Node.Path -> RichText.Model.Node.Block -> Bool
isLeafNode path root =
    case RichText.Node.nodeAt path root of
        Nothing ->
            False

        Just node ->
            case node of
                RichText.Node.Block bn ->
                    case RichText.Model.Node.childNodes bn of
                        RichText.Model.Node.Leaf ->
                            True

                        _ ->
                            False

                RichText.Node.Inline l ->
                    case l of
                        RichText.Model.Node.InlineElement _ ->
                            True

                        RichText.Model.Node.Text _ ->
                            False


{-| This is a helper method to remove a node or some text in a given range. If this is a node,
it returns the previously selectable node. Otherwise, it re
-}
removeNodeOrTextWithRange : RichText.Model.Node.Path -> Int -> Maybe Int -> RichText.Model.Node.Block -> Result String ( RichText.Model.Node.Block, Maybe ( RichText.Model.Node.Path, RichText.Node.Node ) )
removeNodeOrTextWithRange nodePath start maybeEnd root =
    case RichText.Node.nodeAt nodePath root of
        Just node ->
            case node of
                RichText.Node.Block _ ->
                    let
                        previouslySelectablePathAndNode =
                            RichText.Node.findBackwardFromExclusive (\_ n -> RichText.Annotation.isSelectable n) nodePath root

                        newRoot =
                            RichText.Node.removeNodeAndEmptyParents nodePath root
                    in
                    Ok ( newRoot, previouslySelectablePathAndNode )

                RichText.Node.Inline leaf ->
                    case leaf of
                        RichText.Model.Node.InlineElement _ ->
                            let
                                previouslySelectablePath =
                                    RichText.Node.findBackwardFromExclusive (\_ n -> RichText.Annotation.isSelectable n) nodePath root

                                newRoot =
                                    RichText.Node.removeNodeAndEmptyParents nodePath root
                            in
                            Ok ( newRoot, previouslySelectablePath )

                        RichText.Model.Node.Text v ->
                            let
                                textNode =
                                    case maybeEnd of
                                        Nothing ->
                                            RichText.Model.Node.Text
                                                (v
                                                    |> RichText.Model.Text.withText (String.left start (RichText.Model.Text.text v))
                                                )

                                        Just end ->
                                            RichText.Model.Node.Text
                                                (v
                                                    |> RichText.Model.Text.withText
                                                        (String.left start (RichText.Model.Text.text v)
                                                            ++ String.dropLeft end (RichText.Model.Text.text v)
                                                        )
                                                )
                            in
                            Result.map (\r -> ( r, Just ( nodePath, RichText.Node.Inline textNode ) )) (RichText.Node.replace nodePath (RichText.Node.Inline textNode) root)

        Nothing ->
            Err <| "There is no node at node path " ++ RichText.Model.Node.toString nodePath


{-| Removes a leaf element if it is the selected element, otherwise fails with an error.

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
                                    [ plainText "hello"
                                    , inlineElement (Element.element image []) []
                                    , plainText "world"
                                    ]
                            )
                        ]
                )
            )
            (Just <| caret [ 0, 1 ] 0)


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
                                    [ plainText "hello"
                                    , plainText "world"
                                    ]
                            )
                        ]
                )
            )
            (Just <| caret [ 0, 0 ] 5)

    removeSelectedLeafElement before == Ok after
    --> True

-}
removeSelectedLeafElement : RichText.Config.Command.Transform
removeSelectedLeafElement editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            if not <| RichText.Model.Selection.isCollapsed selection then
                Err "I cannot remove a leaf element if it is not collapsed"

            else if isLeafNode (RichText.Model.Selection.anchorNode selection) (RichText.Model.State.root editorState) then
                let
                    newSelection =
                        case
                            RichText.Node.findBackwardFromExclusive
                                (\_ n -> RichText.Annotation.isSelectable n)
                                (RichText.Model.Selection.anchorNode selection)
                                (RichText.Model.State.root editorState)
                        of
                            Nothing ->
                                Nothing

                            Just ( p, n ) ->
                                let
                                    offset =
                                        case n of
                                            RichText.Node.Inline il ->
                                                case il of
                                                    RichText.Model.Node.Text t ->
                                                        String.length (RichText.Model.Text.text t)

                                                    _ ->
                                                        0

                                            _ ->
                                                0
                                in
                                Just (RichText.Model.Selection.caret p offset)
                in
                Ok
                    (editorState
                        |> RichText.Model.State.withRoot (RichText.Node.removeNodeAndEmptyParents (RichText.Model.Selection.anchorNode selection) (RichText.Model.State.root editorState))
                        |> RichText.Model.State.withSelection newSelection
                    )

            else
                Err "There's no leaf node at the given selection"


{-| Backspace transform for a single character. This function has a few quirks in order to take
advantage of native backspace behavior, namely:

  - selection offset = 0, try to delete the previous text node's text
  - selection offset = 1, remove the first character (afterwards, the reduce behavior of `apply`
    may remove the text node)
  - any other offset, return an error to allow browser to do the default behavior

```
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
                                , markedText "text2" [ mark bold [] ]
                                ]
                        )
                    ]
            )
        )
        (Just <| caret [ 0, 1 ] 0)

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
                                [ plainText "tex"
                                , markedText "text2" [ mark bold [] ]
                                ]
                        )
                    ]
            )
        )
        (Just <| caret [ 0, 0 ] 3)

backspaceText before == Ok after
--> True
```

-}
backspaceText : RichText.Config.Command.Transform
backspaceText editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            if not <| RichText.Model.Selection.isCollapsed selection then
                Err "I can only backspace a collapsed selection"

            else if RichText.Model.Selection.anchorOffset selection > 1 then
                Err <|
                    "I use native behavior when doing backspace when the "
                        ++ "anchor offset could not result in a node change"

            else
                case RichText.Node.nodeAt (RichText.Model.Selection.anchorNode selection) (RichText.Model.State.root editorState) of
                    Nothing ->
                        Err "Invalid selection"

                    Just node ->
                        case node of
                            RichText.Node.Block _ ->
                                Err "I cannot backspace a block node"

                            RichText.Node.Inline il ->
                                case il of
                                    RichText.Model.Node.InlineElement _ ->
                                        Err "I cannot backspace text of an inline leaf"

                                    RichText.Model.Node.Text tl ->
                                        if RichText.Model.Selection.anchorOffset selection == 1 then
                                            case
                                                RichText.Node.replace (RichText.Model.Selection.anchorNode selection)
                                                    (RichText.Node.Inline
                                                        (RichText.Model.Node.Text
                                                            (tl
                                                                |> RichText.Model.Text.withText (String.dropLeft 1 (RichText.Model.Text.text tl))
                                                            )
                                                        )
                                                    )
                                                    (RichText.Model.State.root editorState)
                                            of
                                                Err s ->
                                                    Err s

                                                Ok newRoot ->
                                                    let
                                                        newSelection =
                                                            RichText.Model.Selection.caret (RichText.Model.Selection.anchorNode selection) 0
                                                    in
                                                    Ok
                                                        (editorState
                                                            |> RichText.Model.State.withRoot newRoot
                                                            |> RichText.Model.State.withSelection (Just newSelection)
                                                        )

                                        else
                                            case RichText.Node.previous (RichText.Model.Selection.anchorNode selection) (RichText.Model.State.root editorState) of
                                                Nothing ->
                                                    Err "No previous node to backspace text"

                                                Just ( previousPath, previousNode ) ->
                                                    case previousNode of
                                                        RichText.Node.Inline previousInlineLeafWrapper ->
                                                            case previousInlineLeafWrapper of
                                                                RichText.Model.Node.Text previousTextLeaf ->
                                                                    let
                                                                        l =
                                                                            String.length (RichText.Model.Text.text previousTextLeaf)

                                                                        newSelection =
                                                                            RichText.Model.Selection.singleNodeRange previousPath l (max 0 (l - 1))
                                                                    in
                                                                    removeRange
                                                                        (editorState
                                                                            |> RichText.Model.State.withSelection (Just newSelection)
                                                                        )

                                                                RichText.Model.Node.InlineElement _ ->
                                                                    Err "Cannot backspace if the previous node is an inline leaf"

                                                        RichText.Node.Block _ ->
                                                            Err "Cannot backspace if the previous node is a block"


isBlockOrInlineNodeWithMark : String -> RichText.Node.Node -> Bool
isBlockOrInlineNodeWithMark markName node =
    case node of
        RichText.Node.Inline il ->
            RichText.Model.Mark.hasMarkWithName markName (RichText.Model.Node.marks il)

        _ ->
            True


toggleMarkSingleInlineNode : RichText.Model.Mark.MarkOrder -> RichText.Model.Mark.Mark -> RichText.Model.Mark.ToggleAction -> RichText.Config.Command.Transform
toggleMarkSingleInlineNode markOrder mark action editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            if RichText.Model.Selection.anchorNode selection /= RichText.Model.Selection.focusNode selection then
                Err "I can only toggle a single inline node"

            else
                let
                    normalizedSelection =
                        RichText.Model.Selection.normalize selection
                in
                case RichText.Node.nodeAt (RichText.Model.Selection.anchorNode normalizedSelection) (RichText.Model.State.root editorState) of
                    Nothing ->
                        Err "No node at selection"

                    Just node ->
                        case node of
                            RichText.Node.Block _ ->
                                Err "Cannot toggle a block node"

                            RichText.Node.Inline il ->
                                let
                                    newMarks =
                                        RichText.Model.Mark.toggle action markOrder mark (RichText.Model.Node.marks il)

                                    leaves =
                                        case il of
                                            RichText.Model.Node.InlineElement leaf ->
                                                [ RichText.Model.Node.InlineElement
                                                    (leaf
                                                        |> RichText.Model.InlineElement.withMarks newMarks
                                                    )
                                                ]

                                            RichText.Model.Node.Text leaf ->
                                                if
                                                    String.length (RichText.Model.Text.text leaf)
                                                        == RichText.Model.Selection.focusOffset normalizedSelection
                                                        && RichText.Model.Selection.anchorOffset normalizedSelection
                                                        == 0
                                                then
                                                    [ RichText.Model.Node.Text (leaf |> RichText.Model.Text.withMarks newMarks) ]

                                                else
                                                    let
                                                        newNode =
                                                            RichText.Model.Node.Text
                                                                (leaf
                                                                    |> RichText.Model.Text.withMarks newMarks
                                                                    |> RichText.Model.Text.withText
                                                                        (String.slice
                                                                            (RichText.Model.Selection.anchorOffset normalizedSelection)
                                                                            (RichText.Model.Selection.focusOffset normalizedSelection)
                                                                            (RichText.Model.Text.text leaf)
                                                                        )
                                                                )

                                                        right =
                                                            RichText.Model.Node.Text
                                                                (leaf
                                                                    |> RichText.Model.Text.withText
                                                                        (String.dropLeft
                                                                            (RichText.Model.Selection.focusOffset normalizedSelection)
                                                                            (RichText.Model.Text.text leaf)
                                                                        )
                                                                )
                                                    in
                                                    if RichText.Model.Selection.anchorOffset normalizedSelection == 0 then
                                                        [ newNode, right ]

                                                    else
                                                        let
                                                            left =
                                                                RichText.Model.Node.Text
                                                                    (leaf
                                                                        |> RichText.Model.Text.withText
                                                                            (String.left
                                                                                (RichText.Model.Selection.anchorOffset normalizedSelection)
                                                                                (RichText.Model.Text.text leaf)
                                                                            )
                                                                    )
                                                        in
                                                        if String.length (RichText.Model.Text.text leaf) == RichText.Model.Selection.focusOffset normalizedSelection then
                                                            [ left, newNode ]

                                                        else
                                                            [ left, newNode, right ]
                                in
                                case
                                    RichText.Node.replaceWithFragment
                                        (RichText.Model.Selection.anchorNode normalizedSelection)
                                        (RichText.Node.InlineFragment <| Array.fromList leaves)
                                        (RichText.Model.State.root editorState)
                                of
                                    Err s ->
                                        Err s

                                    Ok newRoot ->
                                        let
                                            path =
                                                if RichText.Model.Selection.anchorOffset normalizedSelection == 0 then
                                                    RichText.Model.Selection.anchorNode normalizedSelection

                                                else
                                                    RichText.Model.Node.increment (RichText.Model.Selection.anchorNode normalizedSelection)

                                            newSelection =
                                                RichText.Model.Selection.singleNodeRange
                                                    path
                                                    0
                                                    (RichText.Model.Selection.focusOffset normalizedSelection - RichText.Model.Selection.anchorOffset normalizedSelection)
                                        in
                                        Ok
                                            (editorState
                                                |> RichText.Model.State.withSelection (Just newSelection)
                                                |> RichText.Model.State.withRoot newRoot
                                            )


hugLeft : RichText.Model.State.State -> RichText.Model.State.State
hugLeft state =
    case RichText.Model.State.selection state of
        Nothing ->
            state

        Just selection ->
            if RichText.Model.Selection.isCollapsed selection then
                state

            else
                let
                    normalizedSelection =
                        RichText.Model.Selection.normalize selection

                    anchorPath =
                        RichText.Model.Selection.anchorNode normalizedSelection

                    root =
                        RichText.Model.State.root state
                in
                case RichText.Node.nodeAt anchorPath root of
                    Nothing ->
                        state

                    Just n ->
                        case n of
                            RichText.Node.Inline il ->
                                case il of
                                    RichText.Model.Node.Text t ->
                                        if String.length (RichText.Model.Text.text t) == RichText.Model.Selection.anchorOffset normalizedSelection then
                                            case RichText.Node.nodeAt (RichText.Model.Node.increment anchorPath) root of
                                                Nothing ->
                                                    state

                                                Just n2 ->
                                                    case n2 of
                                                        RichText.Node.Inline il2 ->
                                                            case il2 of
                                                                RichText.Model.Node.Text _ ->
                                                                    state
                                                                        |> RichText.Model.State.withSelection
                                                                            (Just <| RichText.Model.Selection.range (RichText.Model.Node.increment anchorPath) 0 (RichText.Model.Selection.focusNode normalizedSelection) (RichText.Model.Selection.focusOffset normalizedSelection))

                                                                _ ->
                                                                    state

                                                        _ ->
                                                            state

                                        else
                                            state

                                    _ ->
                                        state

                            _ ->
                                state


hugRight : RichText.Model.State.State -> RichText.Model.State.State
hugRight state =
    case RichText.Model.State.selection state of
        Nothing ->
            state

        Just selection ->
            if RichText.Model.Selection.isCollapsed selection then
                state

            else
                let
                    normalizedSelection =
                        RichText.Model.Selection.normalize selection

                    focusPath =
                        RichText.Model.Selection.focusNode normalizedSelection

                    root =
                        RichText.Model.State.root state
                in
                case RichText.Node.nodeAt focusPath root of
                    Nothing ->
                        state

                    Just n ->
                        case n of
                            RichText.Node.Inline il ->
                                case il of
                                    RichText.Model.Node.Text _ ->
                                        if 0 == RichText.Model.Selection.focusOffset normalizedSelection then
                                            case RichText.Node.nodeAt (RichText.Model.Node.decrement focusPath) root of
                                                Nothing ->
                                                    state

                                                Just n2 ->
                                                    case n2 of
                                                        RichText.Node.Inline il2 ->
                                                            case il2 of
                                                                RichText.Model.Node.Text t ->
                                                                    state
                                                                        |> RichText.Model.State.withSelection
                                                                            (Just <|
                                                                                RichText.Model.Selection.range (RichText.Model.Selection.anchorNode normalizedSelection)
                                                                                    (RichText.Model.Selection.anchorOffset normalizedSelection)
                                                                                    (RichText.Model.Node.decrement focusPath)
                                                                                    (String.length (RichText.Model.Text.text t))
                                                                            )

                                                                _ ->
                                                                    state

                                                        _ ->
                                                            state

                                        else
                                            state

                                    _ ->
                                        state

                            _ ->
                                state


{-| Sometimes a selection is right on the outside of a text node, which can confuse the toggle logic.
This method hugs the selection by pushing the normalized anchor and focus to the closest neighbor if the anchor offset is at the
end of a text node or a the focus is at the beginning.
-}
hug : RichText.Model.State.State -> RichText.Model.State.State
hug state =
    hugRight <| hugLeft state


{-| Applies the toggle action for the mark. The affected marks are sorted by the given mark order.

    boldMark : Mark
    boldMark =
        mark bold []


    markdownMarkOrder : MarkOrder
    markdownMarkOrder =
        markOrderFromSpec markdown


    before : State
    before =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ plainText "text" ])
                        ]
                )
            )
            (Just <| caret [ 0, 0 ] 0)


    after : State
    after =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block
                            (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ markedText "" [ boldMark ], plainText "text" ])
                        ]
                )
            )
            (Just <| caret [ 0, 0 ] 0)

    toggleMark markdownMarkOrder boldMark Add example == Ok

-}
toggleMark : RichText.Model.Mark.MarkOrder -> RichText.Model.Mark.Mark -> RichText.Model.Mark.ToggleAction -> RichText.Config.Command.Transform
toggleMark markOrder mark action editorState =
    toggleMarkFull markOrder mark action (hug editorState)


toggleMarkFull : RichText.Model.Mark.MarkOrder -> RichText.Model.Mark.Mark -> RichText.Model.Mark.ToggleAction -> RichText.Config.Command.Transform
toggleMarkFull markOrder mark action editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            if RichText.Model.Selection.focusNode selection == RichText.Model.Selection.anchorNode selection then
                toggleMarkSingleInlineNode markOrder mark action editorState

            else
                let
                    normalizedSelection =
                        RichText.Model.Selection.normalize selection

                    toggleAction =
                        if action /= RichText.Model.Mark.Flip then
                            action

                        else if
                            RichText.Node.allRange
                                (isBlockOrInlineNodeWithMark (RichText.Model.Mark.name mark))
                                (RichText.Model.Selection.anchorNode normalizedSelection)
                                (RichText.Model.Selection.focusNode normalizedSelection)
                                (RichText.Model.State.root editorState)
                        then
                            RichText.Model.Mark.Remove

                        else
                            RichText.Model.Mark.Add

                    betweenRoot =
                        case RichText.Node.next (RichText.Model.Selection.anchorNode normalizedSelection) (RichText.Model.State.root editorState) of
                            Nothing ->
                                RichText.Model.State.root editorState

                            Just ( afterAnchor, _ ) ->
                                case RichText.Node.previous (RichText.Model.Selection.focusNode normalizedSelection) (RichText.Model.State.root editorState) of
                                    Nothing ->
                                        RichText.Model.State.root editorState

                                    Just ( beforeFocus, _ ) ->
                                        case
                                            RichText.Node.indexedMap
                                                (\path node ->
                                                    if path < afterAnchor || path > beforeFocus then
                                                        node

                                                    else
                                                        case node of
                                                            RichText.Node.Block _ ->
                                                                node

                                                            RichText.Node.Inline _ ->
                                                                RichText.Node.toggleMark toggleAction markOrder mark node
                                                )
                                                (RichText.Node.Block (RichText.Model.State.root editorState))
                                        of
                                            RichText.Node.Block bn ->
                                                bn

                                            _ ->
                                                RichText.Model.State.root editorState

                    modifiedEndNodeEditorState =
                        Result.withDefault (editorState |> RichText.Model.State.withRoot betweenRoot) <|
                            toggleMarkSingleInlineNode
                                markOrder
                                mark
                                toggleAction
                                (editorState
                                    |> RichText.Model.State.withRoot betweenRoot
                                    |> RichText.Model.State.withSelection
                                        (Just
                                            (RichText.Model.Selection.singleNodeRange
                                                (RichText.Model.Selection.focusNode normalizedSelection)
                                                0
                                                (RichText.Model.Selection.focusOffset normalizedSelection)
                                            )
                                        )
                                )

                    modifiedStartNodeEditorState =
                        case RichText.Node.nodeAt (RichText.Model.Selection.anchorNode normalizedSelection) (RichText.Model.State.root editorState) of
                            Nothing ->
                                modifiedEndNodeEditorState

                            Just node ->
                                case node of
                                    RichText.Node.Inline il ->
                                        let
                                            focusOffset =
                                                case il of
                                                    RichText.Model.Node.Text leaf ->
                                                        String.length (RichText.Model.Text.text leaf)

                                                    RichText.Model.Node.InlineElement _ ->
                                                        0
                                        in
                                        Result.withDefault modifiedEndNodeEditorState <|
                                            toggleMarkSingleInlineNode
                                                markOrder
                                                mark
                                                toggleAction
                                                (modifiedEndNodeEditorState
                                                    |> RichText.Model.State.withSelection
                                                        (Just
                                                            (RichText.Model.Selection.singleNodeRange
                                                                (RichText.Model.Selection.anchorNode normalizedSelection)
                                                                (RichText.Model.Selection.anchorOffset normalizedSelection)
                                                                focusOffset
                                                            )
                                                        )
                                                )

                                    _ ->
                                        modifiedEndNodeEditorState

                    incrementAnchorOffset =
                        RichText.Model.Selection.anchorOffset normalizedSelection /= 0

                    anchorAndFocusHaveSameParent =
                        RichText.Model.Node.parent (RichText.Model.Selection.anchorNode normalizedSelection) == RichText.Model.Node.parent (RichText.Model.Selection.focusNode normalizedSelection)

                    newSelection =
                        RichText.Model.Selection.range
                            (if incrementAnchorOffset then
                                RichText.Model.Node.increment (RichText.Model.Selection.anchorNode normalizedSelection)

                             else
                                RichText.Model.Selection.anchorNode normalizedSelection
                            )
                            0
                            (if incrementAnchorOffset && anchorAndFocusHaveSameParent then
                                RichText.Model.Node.increment (RichText.Model.Selection.focusNode normalizedSelection)

                             else
                                RichText.Model.Selection.focusNode normalizedSelection
                            )
                            (RichText.Model.Selection.focusOffset normalizedSelection)
                in
                Ok
                    (modifiedStartNodeEditorState
                        |> RichText.Model.State.withSelection (Just newSelection)
                    )


{-| Changes the selected block or blocks to the onElement if one or more blocks is not that
element. Otherwise, it changes it to the off element. If an element is not in the allowedElements,
then it is unaffected.

The arguments are as follows:

  - `onElement` - The element to change to if there is one or more block that is not that element
  - `offElement` - The element to change to if all blocks are the `onElement`
  - `convertToPlainText` - if true, strips the inline content of all marks and inline elements.

```
before : State
before =
    state
        (block
            (Element.element doc [])
            (blockChildren <|
                Array.fromList
                    [ block (Element.element paragraph [])
                        (inlineChildren <| Array.fromList [ plainText "text" ])
                    ]
            )
        )
        (Just <| caret [ 0, 0 ] 0)


after : State
after =
    state
        (block
            (Element.element doc [])
            (blockChildren <|
                Array.fromList
                    [ block
                        (Element.element heading [])
                        (inlineChildren <| Array.fromList [ plainText "text" ])
                    ]
            )
        )
        (Just <| caret [ 0, 0 ] 0)

toggleTextBlock (Element.element heading []) (Element.element paragraph []) False before == Ok after
```

-}
toggleTextBlock : RichText.Model.Element.Element -> RichText.Model.Element.Element -> Bool -> RichText.Config.Command.Transform
toggleTextBlock onElement offElement convertToPlainText editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected."

        Just selection ->
            let
                normalizedSelection =
                    RichText.Model.Selection.normalize selection

                anchorPath =
                    RichText.Node.findClosestBlockPath (RichText.Model.Selection.anchorNode normalizedSelection) (RichText.Model.State.root editorState)

                focusPath =
                    RichText.Node.findClosestBlockPath (RichText.Model.Selection.focusNode normalizedSelection) (RichText.Model.State.root editorState)

                doOffBehavior =
                    RichText.Node.allRange
                        (\node ->
                            case node of
                                RichText.Node.Block bn ->
                                    case RichText.Model.Node.childNodes bn of
                                        RichText.Model.Node.InlineChildren _ ->
                                            RichText.Model.Node.element bn == onElement

                                        _ ->
                                            True

                                _ ->
                                    True
                        )
                        anchorPath
                        focusPath
                        (RichText.Model.State.root editorState)

                newParams =
                    if doOffBehavior then
                        offElement

                    else
                        onElement

                newRoot =
                    case
                        RichText.Node.indexedMap
                            (\path node ->
                                if path < anchorPath || path > focusPath then
                                    node

                                else
                                    case node of
                                        RichText.Node.Block bn ->
                                            case RichText.Model.Node.childNodes bn of
                                                RichText.Model.Node.InlineChildren ic ->
                                                    let
                                                        newInlineChildren =
                                                            if convertToPlainText then
                                                                RichText.Model.Node.inlineChildren (Array.fromList [ RichText.Model.Node.plainText (convertInlineChildrenToString ic) ])

                                                            else
                                                                RichText.Model.Node.InlineChildren ic
                                                    in
                                                    RichText.Node.Block (bn |> RichText.Model.Node.withElement newParams |> RichText.Model.Node.withChildNodes newInlineChildren)

                                                _ ->
                                                    node

                                        RichText.Node.Inline _ ->
                                            node
                            )
                            (RichText.Node.Block (RichText.Model.State.root editorState))
                    of
                        RichText.Node.Block bn ->
                            bn

                        _ ->
                            RichText.Model.State.root editorState
            in
            if convertToPlainText then
                Ok <| RichText.State.translateReducedTextBlockSelection newRoot editorState

            else
                Ok (editorState |> RichText.Model.State.withRoot newRoot)


convertInlineChildrenToString : RichText.Model.Node.InlineChildren -> String
convertInlineChildrenToString ic =
    Array.foldl
        (\i s ->
            case i of
                RichText.Model.Node.Text t ->
                    s ++ RichText.Model.Text.text t

                _ ->
                    s
        )
        ""
        (RichText.Model.Node.toInlineArray ic)


{-| Wraps the selection in the given element. The first argument is a mapping function for each
block element affected by the wrap. For normal transforms, using `identity` is okay, but for things
like lists, you may want to apply a function to wrap an additional list item block around each node.

    before : State
    before =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ plainText "text" ])
                        ]
                )
            )
            (Just <| caret [ 0, 0 ] 0)


    after : State
    after =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block
                            (Element.element blockquote [])
                            (blockChildren <|
                                Array.fromList
                                    [ block
                                        (Element.element paragraph [])
                                        (inlineChildren <| Array.fromList [ plainText "text" ])
                                    ]
                            )
                        ]
                )
            )
            (Just <| caret [ 0, 0, 0 ] 0)

    wrap identity (Element.element blockquote []) before == Ok after
    --> True

-}
wrap : (RichText.Model.Node.Block -> RichText.Model.Node.Block) -> RichText.Model.Element.Element -> RichText.Config.Command.Transform
wrap contentsMapFunc elementParameters editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            let
                normalizedSelection =
                    RichText.Model.Selection.normalize selection

                markedRoot =
                    RichText.Annotation.annotateSelection normalizedSelection (RichText.Model.State.root editorState)

                anchorBlockPath =
                    RichText.Node.findClosestBlockPath (RichText.Model.Selection.anchorNode normalizedSelection) markedRoot

                focusBlockPath =
                    RichText.Node.findClosestBlockPath (RichText.Model.Selection.focusNode normalizedSelection) markedRoot

                ancestor =
                    RichText.Model.Node.commonAncestor anchorBlockPath focusBlockPath
            in
            if ancestor == anchorBlockPath || ancestor == focusBlockPath then
                case RichText.Node.nodeAt ancestor markedRoot of
                    Nothing ->
                        Err "I cannot find a node at selection"

                    Just node ->
                        let
                            newChildren =
                                case node of
                                    RichText.Node.Block bn ->
                                        RichText.Model.Node.blockChildren (Array.map contentsMapFunc (Array.fromList [ bn ]))

                                    RichText.Node.Inline il ->
                                        RichText.Model.Node.inlineChildren (Array.fromList [ il ])

                            newNode =
                                RichText.Model.Node.block elementParameters newChildren
                        in
                        case RichText.Node.replace ancestor (RichText.Node.Block newNode) markedRoot of
                            Err err ->
                                Err err

                            Ok newRoot ->
                                Ok
                                    (editorState
                                        |> RichText.Model.State.withRoot (RichText.Annotation.clearSelectionAnnotations newRoot)
                                        |> RichText.Model.State.withSelection
                                            (RichText.Annotation.selectionFromAnnotations
                                                newRoot
                                                (RichText.Model.Selection.anchorOffset selection)
                                                (RichText.Model.Selection.focusOffset selection)
                                            )
                                    )

            else
                case List.Extra.getAt (List.length ancestor) (RichText.Model.Selection.anchorNode normalizedSelection) of
                    Nothing ->
                        Err "Invalid ancestor path at anchor node"

                    Just childAnchorIndex ->
                        case List.Extra.getAt (List.length ancestor) (RichText.Model.Selection.focusNode normalizedSelection) of
                            Nothing ->
                                Err "Invalid ancestor path at focus node"

                            Just childFocusIndex ->
                                case RichText.Node.nodeAt ancestor markedRoot of
                                    Nothing ->
                                        Err "Invalid common ancestor path"

                                    Just node ->
                                        case node of
                                            RichText.Node.Block bn ->
                                                case RichText.Model.Node.childNodes bn of
                                                    RichText.Model.Node.BlockChildren a ->
                                                        let
                                                            newChildNode =
                                                                RichText.Model.Node.block elementParameters
                                                                    (RichText.Model.Node.blockChildren <|
                                                                        Array.map
                                                                            contentsMapFunc
                                                                            (Array.slice childAnchorIndex
                                                                                (childFocusIndex + 1)
                                                                                (RichText.Model.Node.toBlockArray a)
                                                                            )
                                                                    )

                                                            newBlockArray =
                                                                RichText.Model.Node.blockChildren <|
                                                                    Array.append
                                                                        (Array.append
                                                                            (Array.Extra.sliceUntil
                                                                                childAnchorIndex
                                                                                (RichText.Model.Node.toBlockArray a)
                                                                            )
                                                                            (Array.fromList [ newChildNode ])
                                                                        )
                                                                        (Array.Extra.sliceFrom
                                                                            (childFocusIndex + 1)
                                                                            (RichText.Model.Node.toBlockArray a)
                                                                        )

                                                            newNode =
                                                                bn |> RichText.Model.Node.withChildNodes newBlockArray
                                                        in
                                                        case RichText.Node.replace ancestor (RichText.Node.Block newNode) markedRoot of
                                                            Err s ->
                                                                Err s

                                                            Ok newRoot ->
                                                                Ok
                                                                    (editorState
                                                                        |> RichText.Model.State.withRoot (RichText.Annotation.clearSelectionAnnotations newRoot)
                                                                        |> RichText.Model.State.withSelection
                                                                            (RichText.Annotation.selectionFromAnnotations
                                                                                newRoot
                                                                                (RichText.Model.Selection.anchorOffset selection)
                                                                                (RichText.Model.Selection.focusOffset selection)
                                                                            )
                                                                    )

                                                    RichText.Model.Node.InlineChildren _ ->
                                                        Err "Cannot wrap inline elements"

                                                    RichText.Model.Node.Leaf ->
                                                        Err "Cannot wrap leaf elements"

                                            RichText.Node.Inline _ ->
                                                Err "Invalid ancestor path... somehow we have an inline leaf"


{-| Updates the state's selection to span the first and last element of the document.

    before : State
    before =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ plainText "text" ])
                        ]
                )
            )
            (Just <| caret [ 0, 0 ] 0)


    after : State
    after =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block
                            (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ plainText "text" ])
                        ]
                )
            )
            (Just <| singleNodeRange [ 0, 0 ] 0 4)

    selectAll before == Ok after
    --> True

-}
selectAll : RichText.Config.Command.Transform
selectAll editorState =
    let
        ( fl, lastOffset ) =
            RichText.Node.indexedFoldl
                (\path node ( firstAndLast, offset ) ->
                    if RichText.Annotation.isSelectable node then
                        let
                            newOffset =
                                case node of
                                    RichText.Node.Inline il ->
                                        case il of
                                            RichText.Model.Node.Text tl ->
                                                String.length (RichText.Model.Text.text tl)

                                            RichText.Model.Node.InlineElement _ ->
                                                0

                                    RichText.Node.Block _ ->
                                        0
                        in
                        case firstAndLast of
                            Nothing ->
                                ( Just ( path, path ), newOffset )

                            Just ( first, _ ) ->
                                ( Just ( first, path ), newOffset )

                    else
                        ( firstAndLast, offset )
                )
                ( Nothing, 0 )
                (RichText.Node.Block (RichText.Model.State.root editorState))
    in
    case fl of
        Nothing ->
            Err "Nothing is selectable"

        Just ( first, last ) ->
            Ok
                (editorState
                    |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.range first 0 last lastOffset)
                )


addLiftMarkToBlocksInSelection : RichText.Model.Selection.Selection -> RichText.Model.Node.Block -> RichText.Model.Node.Block
addLiftMarkToBlocksInSelection selection root =
    let
        start =
            RichText.Node.findClosestBlockPath (RichText.Model.Selection.anchorNode selection) root

        end =
            RichText.Node.findClosestBlockPath (RichText.Model.Selection.focusNode selection) root
    in
    case
        RichText.Node.indexedMap
            (\path node ->
                if path < start || path > end then
                    node

                else
                    case node of
                        RichText.Node.Block bn ->
                            let
                                addMarker =
                                    case RichText.Model.Node.childNodes bn of
                                        RichText.Model.Node.Leaf ->
                                            True

                                        RichText.Model.Node.InlineChildren _ ->
                                            True

                                        _ ->
                                            False
                            in
                            if addMarker then
                                RichText.Annotation.add RichText.Annotation.lift <| RichText.Node.Block bn

                            else
                                node

                        _ ->
                            node
            )
            (RichText.Node.Block root)
    of
        RichText.Node.Block bn ->
            bn

        _ ->
            root


{-| Lifts the selected block or the closest ancestor block out of its parent node.
If the current selection is a range selection, this function lifts all blocks that are in the range.
Returns an error if no lift can be done.

    before : State
    before =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block
                            (Element.element blockquote [])
                            (blockChildren <|
                                Array.fromList
                                    [ block (Element.element paragraph [])
                                        (inlineChildren <| Array.fromList [ plainText "text" ])
                                    ]
                            )
                        ]
                )
            )
            (Just <| caret [ 0, 0, 0 ] 0)


    after : State
    after =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block
                            (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ plainText "text" ])
                        ]
                )
            )
            (Just <| caret [ 0, 0 ] 0)

    lift before == Ok after
    --> True

-}
lift : RichText.Config.Command.Transform
lift editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            let
                normalizedSelection =
                    RichText.Model.Selection.normalize selection

                markedRoot =
                    addLiftMarkToBlocksInSelection normalizedSelection <|
                        RichText.Annotation.annotateSelection normalizedSelection (RichText.Model.State.root editorState)

                liftedRoot =
                    RichText.Annotation.doLift markedRoot

                newSelection =
                    RichText.Annotation.selectionFromAnnotations
                        liftedRoot
                        (RichText.Model.Selection.anchorOffset normalizedSelection)
                        (RichText.Model.Selection.focusOffset normalizedSelection)
            in
            Ok
                (editorState
                    |> RichText.Model.State.withSelection newSelection
                    |> RichText.Model.State.withRoot
                        (RichText.Annotation.clear RichText.Annotation.lift <|
                            RichText.Annotation.clearSelectionAnnotations liftedRoot
                        )
                )


{-| Same as `lift` but only succeeds if the selection is an empty text block.

    before : State
    before =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block
                            (Element.element blockquote [])
                            (blockChildren <|
                                Array.fromList
                                    [ block (Element.element paragraph [])
                                        (inlineChildren <| Array.fromList [ plainText "" ])
                                    ]
                            )
                        ]
                )
            )
            (Just <| caret [ 0, 0, 0 ] 0)


    after : State
    after =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block
                            (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ plainText "" ])
                        ]
                )
            )
            (Just <| caret [ 0, 0 ] 0)

    liftEmpty before == Ok after
    --> True

-}
liftEmpty : RichText.Config.Command.Transform
liftEmpty editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            if (not <| RichText.Model.Selection.isCollapsed selection) || RichText.Model.Selection.anchorOffset selection /= 0 then
                Err "Can only lift empty text blocks"

            else
                let
                    p =
                        RichText.Node.findClosestBlockPath (RichText.Model.Selection.anchorNode selection) (RichText.Model.State.root editorState)
                in
                case RichText.Node.nodeAt p (RichText.Model.State.root editorState) of
                    Nothing ->
                        Err "Invalid root path"

                    Just node ->
                        if not <| RichText.Node.isEmptyTextBlock node then
                            Err "I can only lift an empty text block"

                        else if List.length p < 2 then
                            Err "I cannot lift a node that's root or an immediate child of root"

                        else
                            lift editorState


{-| Does the split block logic, but also additionally changes the second part of the split
to the given element if it's an empty text block. This is useful for splitting a
header to a paragraph block.

    before : State
    before =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block (Element.element heading [])
                            (inlineChildren <| Array.fromList [ plainText "" ])
                        ]
                )
            )
            (Just <| caret [ 0, 0 ] 0)


    after : State
    after =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block (Element.element heading [])
                            (inlineChildren <| Array.fromList [ plainText "" ])
                        , block (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ plainText "" ])
                        ]
                )
            )
            (Just <| caret [ 1, 0 ] 0)

    splitBlockHeaderToNewParagraph before == after
    --> True

-}
splitBlockHeaderToNewParagraph : List String -> RichText.Model.Element.Element -> RichText.Config.Command.Transform
splitBlockHeaderToNewParagraph headerElements paragraphElement editorState =
    case splitTextBlock editorState of
        Err s ->
            Err s

        Ok splitEditorState ->
            case RichText.Model.State.selection splitEditorState of
                Nothing ->
                    Ok splitEditorState

                Just selection ->
                    if (not <| RichText.Model.Selection.isCollapsed selection) || RichText.Model.Selection.anchorOffset selection /= 0 then
                        Ok splitEditorState

                    else
                        let
                            p =
                                RichText.Node.findClosestBlockPath
                                    (RichText.Model.Selection.anchorNode selection)
                                    (RichText.Model.State.root splitEditorState)
                        in
                        case RichText.Node.nodeAt p (RichText.Model.State.root splitEditorState) of
                            Nothing ->
                                Ok splitEditorState

                            Just node ->
                                case node of
                                    RichText.Node.Block bn ->
                                        let
                                            parameters =
                                                RichText.Model.Node.element bn
                                        in
                                        if
                                            List.member
                                                (RichText.Model.Element.name parameters)
                                                headerElements
                                                && RichText.Node.isEmptyTextBlock node
                                        then
                                            case
                                                RichText.Node.replace p
                                                    (RichText.Node.Block
                                                        (bn
                                                            |> RichText.Model.Node.withElement
                                                                paragraphElement
                                                        )
                                                    )
                                                    (RichText.Model.State.root splitEditorState)
                                            of
                                                Err _ ->
                                                    Ok splitEditorState

                                                Ok newRoot ->
                                                    Ok (splitEditorState |> RichText.Model.State.withRoot newRoot)

                                        else
                                            Ok splitEditorState

                                    _ ->
                                        Ok splitEditorState


{-| Transform that inserts the given block at the selection. This is useful for inserting things like
horizontal rules or other block leaf elements.

If the selection is a range selection, the contents of that selection are first removed,
then the insert command happens. If the inserted block is selectable, then the resulting selection will
be the block, otherwise it will be the next selectable block or inline.
Returns an error if the block could not be inserted.

    before : State
    before =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block
                            (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ plainText "test" ])
                        ]
                )
            )
            (Just <| caret [ 0, 0 ] 2)


    horizontalRuleBlock : Block
    horizontalRuleBlock =
        block
            (Element.element horizontalRule [])
            Leaf


    after : State
    after =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block
                            (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ plainText "te" ])
                        , horizontalRuleBlock
                        , block
                            (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ plainText "st" ])
                        ]
                )
            )
            (Just <| caret [ 1 ] 0)

    insertBlock horizontalRuleBlock before == Ok after
    --> True

-}
insertBlock : RichText.Model.Node.Block -> RichText.Config.Command.Transform
insertBlock node editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            if not <| RichText.Model.Selection.isCollapsed selection then
                removeRange editorState |> Result.andThen (insertBlock node)

            else
                case RichText.Node.nodeAt (RichText.Model.Selection.anchorNode selection) (RichText.Model.State.root editorState) of
                    Nothing ->
                        Err "Invalid selection"

                    Just aNode ->
                        case aNode of
                            -- if a block node is selected, then insert after the selected block
                            RichText.Node.Block bn ->
                                case
                                    RichText.Node.replaceWithFragment
                                        (RichText.Model.Selection.anchorNode selection)
                                        (RichText.Node.BlockFragment (Array.fromList [ bn, node ]))
                                        (RichText.Model.State.root editorState)
                                of
                                    Err s ->
                                        Err s

                                    Ok newRoot ->
                                        let
                                            newSelection =
                                                if RichText.Annotation.isSelectable (RichText.Node.Block node) then
                                                    RichText.Model.Selection.caret (RichText.Model.Node.increment (RichText.Model.Selection.anchorNode selection)) 0

                                                else
                                                    selection
                                        in
                                        Ok
                                            (editorState
                                                |> RichText.Model.State.withSelection (Just newSelection)
                                                |> RichText.Model.State.withRoot newRoot
                                            )

                            -- if an inline node is selected, then split the block and insert before
                            RichText.Node.Inline _ ->
                                case splitTextBlock editorState of
                                    Err s ->
                                        Err s

                                    Ok splitEditorState ->
                                        insertBlockBeforeSelection node splitEditorState


insertBlockBeforeSelection : RichText.Model.Node.Block -> RichText.Config.Command.Transform
insertBlockBeforeSelection node editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            if not <| RichText.Model.Selection.isCollapsed selection then
                Err "I can only insert a block element before a collapsed selection"

            else
                let
                    markedRoot =
                        RichText.Annotation.annotateSelection selection (RichText.Model.State.root editorState)

                    closestBlockPath =
                        RichText.Node.findClosestBlockPath (RichText.Model.Selection.anchorNode selection) markedRoot
                in
                case RichText.Node.nodeAt closestBlockPath markedRoot of
                    Nothing ->
                        Err "Invalid selection"

                    Just anchorNode ->
                        case anchorNode of
                            RichText.Node.Block bn ->
                                let
                                    newFragment =
                                        if RichText.Node.isEmptyTextBlock <| RichText.Node.Block bn then
                                            [ node ]

                                        else
                                            [ node, bn ]
                                in
                                case
                                    RichText.Node.replaceWithFragment
                                        closestBlockPath
                                        (RichText.Node.BlockFragment (Array.fromList newFragment))
                                        markedRoot
                                of
                                    Err s ->
                                        Err s

                                    Ok newRoot ->
                                        let
                                            newSelection =
                                                if RichText.Annotation.isSelectable (RichText.Node.Block node) then
                                                    Just <| RichText.Model.Selection.caret closestBlockPath 0

                                                else
                                                    RichText.Annotation.selectionFromAnnotations
                                                        newRoot
                                                        (RichText.Model.Selection.anchorOffset selection)
                                                        (RichText.Model.Selection.focusOffset selection)
                                        in
                                        Ok
                                            (editorState
                                                |> RichText.Model.State.withSelection newSelection
                                                |> RichText.Model.State.withRoot (RichText.Annotation.clearSelectionAnnotations newRoot)
                                            )

                            -- if an inline node is selected, then split the block and insert before
                            RichText.Node.Inline _ ->
                                Err "Invalid state! I was expecting a block node."


{-| Removes the previous inline element if the selection is an inline element or text with offset 0.
Returns an error if it was unable to remove the element.

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
                                    , inlineElement (Element.element image []) []
                                    , plainText "text2"
                                    ]
                            )
                        ]
                )
            )
            (Just <| caret [ 0, 2 ] 0)


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
                                    , plainText "text2"
                                    ]
                            )
                        ]
                )
            )
            (Just <| caret [ 0, 1 ] 0)

    backspaceInlineElement before == Ok after
    --> True

-}
backspaceInlineElement : RichText.Config.Command.Transform
backspaceInlineElement editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            if not <| RichText.Model.Selection.isCollapsed selection then
                Err "I can only backspace an inline element if the selection is collapsed"

            else if RichText.Model.Selection.anchorOffset selection /= 0 then
                Err "I can only backspace an inline element if the offset is 0"

            else
                let
                    decrementedPath =
                        RichText.Model.Node.decrement (anchorNode selection)
                in
                case RichText.Node.nodeAt decrementedPath (RichText.Model.State.root editorState) of
                    Nothing ->
                        Err "There is no previous inline element"

                    Just node ->
                        case node of
                            RichText.Node.Inline il ->
                                case il of
                                    RichText.Model.Node.InlineElement _ ->
                                        case
                                            RichText.Node.replaceWithFragment
                                                decrementedPath
                                                (RichText.Node.InlineFragment Array.empty)
                                                (RichText.Model.State.root editorState)
                                        of
                                            Err s ->
                                                Err s

                                            Ok newRoot ->
                                                Ok
                                                    (editorState
                                                        |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.caret decrementedPath 0)
                                                        |> RichText.Model.State.withRoot newRoot
                                                    )

                                    RichText.Model.Node.Text _ ->
                                        Err "There is no previous inline leaf element, found a text leaf"

                            RichText.Node.Block _ ->
                                Err "There is no previous inline leaf element, found a block node"


{-| Removes the previous block leaf if the selection is at the beginning of a text block, otherwise
returns an error.

    before : State
    before =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block
                            (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ plainText "p1" ])
                        , block
                            (Element.element horizontalRule [])
                            Leaf
                        , block
                            (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ plainText "p2" ])
                        ]
                )
            )
            (Just <| caret [ 2, 0 ] 0)


    after : State
    after =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block
                            (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ plainText "p1" ])
                        , block
                            (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ plainText "p2" ])
                        ]
                )
            )
            (Just <| caret [ 1, 0 ] 0)

    backspaceBlock before == Ok after
    --> True

-}
backspaceBlock : RichText.Config.Command.Transform
backspaceBlock editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            if not <| RichText.Node.selectionIsBeginningOfTextBlock selection (RichText.Model.State.root editorState) then
                Err "Cannot backspace a block element if we're not at the beginning of a text block"

            else
                let
                    blockPath =
                        RichText.Node.findClosestBlockPath (anchorNode selection) (RichText.Model.State.root editorState)
                in
                case RichText.Node.previous blockPath (RichText.Model.State.root editorState) of
                    Nothing ->
                        Err "There is no previous element to backspace"

                    Just ( path, node ) ->
                        case node of
                            RichText.Node.Block bn ->
                                case RichText.Model.Node.childNodes bn of
                                    RichText.Model.Node.Leaf ->
                                        let
                                            markedRoot =
                                                RichText.Annotation.annotateSelection selection (RichText.Model.State.root editorState)
                                        in
                                        case RichText.Node.replaceWithFragment path (RichText.Node.BlockFragment Array.empty) markedRoot of
                                            Err s ->
                                                Err s

                                            Ok newRoot ->
                                                Ok
                                                    (editorState
                                                        |> RichText.Model.State.withRoot (RichText.Annotation.clearSelectionAnnotations newRoot)
                                                        |> RichText.Model.State.withSelection
                                                            (RichText.Annotation.selectionFromAnnotations
                                                                newRoot
                                                                (RichText.Model.Selection.anchorOffset selection)
                                                                (RichText.Model.Selection.focusOffset selection)
                                                            )
                                                    )

                                    _ ->
                                        Err "The previous element is not a block leaf"

                            RichText.Node.Inline _ ->
                                Err "The previous element is not a block node"


groupSameTypeInlineLeaf : RichText.Model.Node.Inline -> RichText.Model.Node.Inline -> Bool
groupSameTypeInlineLeaf a b =
    case a of
        RichText.Model.Node.InlineElement _ ->
            case b of
                RichText.Model.Node.InlineElement _ ->
                    True

                RichText.Model.Node.Text _ ->
                    False

        RichText.Model.Node.Text _ ->
            case b of
                RichText.Model.Node.Text _ ->
                    True

                RichText.Model.Node.InlineElement _ ->
                    False


textFromGroup : List RichText.Model.Node.Inline -> String
textFromGroup leaves =
    String.concat <|
        List.map
            (\leaf ->
                case leaf of
                    RichText.Model.Node.Text t ->
                        RichText.Model.Text.text t

                    _ ->
                        ""
            )
            leaves


lengthsFromGroup : List RichText.Model.Node.Inline -> List Int
lengthsFromGroup leaves =
    List.map
        (\il ->
            case il of
                RichText.Model.Node.Text tl ->
                    String.length (RichText.Model.Text.text tl)

                RichText.Model.Node.InlineElement _ ->
                    0
        )
        leaves


{-| Removes the word before the collapsed selection, otherwise returns an error.

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
                                    [ plainText "this is an ex"
                                    , markedText "ample okay" [ mark bold [] ]
                                    ]
                            )
                        ]
                )
            )
            (Just <| caret [ 0, 1 ] 6)


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
                                    [ plainText "this is an "
                                    , markedText "okay" [ mark bold [] ]
                                    ]
                            )
                        ]
                )
            )
            (Just <| caret [ 0, 0 ] 11)

    backspaceWord before == Ok after
    --> True

-}
backspaceWord : RichText.Config.Command.Transform
backspaceWord editorState =
    -- Overview:
    -- Find the inline fragment that represents connected text nodes
    -- get the text in that fragment
    -- translate the offset for that text
    -- find where to backspace
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            if not <| RichText.Model.Selection.isCollapsed selection then
                Err "I cannot remove a word of a range selection"

            else
                case RichText.Node.findTextBlockNodeAncestor (anchorNode selection) (RichText.Model.State.root editorState) of
                    Nothing ->
                        Err "I can only remove a word on a text leaf"

                    Just ( p, n ) ->
                        case RichText.Model.Node.childNodes n of
                            RichText.Model.Node.InlineChildren arr ->
                                case List.Extra.last (anchorNode selection) of
                                    Nothing ->
                                        Err "Somehow the anchor node is the root node"

                                    Just lastIndex ->
                                        let
                                            groupedLeaves =
                                                -- group text nodes together
                                                List.Extra.groupWhile
                                                    groupSameTypeInlineLeaf
                                                    (Array.toList (RichText.Model.Node.toInlineArray arr))

                                            ( relativeLastIndex, group ) =
                                                List.foldl
                                                    (\( first, rest ) ( i, g ) ->
                                                        if not <| List.isEmpty g then
                                                            ( i, g )

                                                        else if List.length rest + 1 > i then
                                                            ( i, first :: rest )

                                                        else
                                                            ( i - (List.length rest + 1), g )
                                                    )
                                                    ( lastIndex, [] )
                                                    groupedLeaves

                                            groupText =
                                                textFromGroup group

                                            offsetUpToNewIndex =
                                                List.sum <|
                                                    List.take
                                                        relativeLastIndex
                                                    <|
                                                        lengthsFromGroup group

                                            offset =
                                                offsetUpToNewIndex + RichText.Model.Selection.anchorOffset selection

                                            stringFrom =
                                                String.left offset groupText
                                        in
                                        if String.isEmpty stringFrom then
                                            Err "Cannot remove word a word if the text fragment is empty"

                                        else
                                            let
                                                matches =
                                                    Regex.findAtMost 1 RichText.Internal.DeleteWord.backspaceWordRegex stringFrom

                                                matchOffset =
                                                    case List.head matches of
                                                        Nothing ->
                                                            0

                                                        Just match ->
                                                            match.index

                                                ( newGroupIndex, newOffset, _ ) =
                                                    List.foldl
                                                        (\l ( i, o, done ) ->
                                                            if done then
                                                                ( i, o, done )

                                                            else if l < o then
                                                                ( i + 1, o - l, False )

                                                            else
                                                                ( i, o, True )
                                                        )
                                                        ( 0, matchOffset, False )
                                                    <|
                                                        lengthsFromGroup group

                                                newIndex =
                                                    lastIndex - (relativeLastIndex - newGroupIndex)

                                                newSelection =
                                                    RichText.Model.Selection.range
                                                        (p ++ [ newIndex ])
                                                        newOffset
                                                        (anchorNode selection)
                                                        (RichText.Model.Selection.anchorOffset selection)

                                                newState =
                                                    editorState |> RichText.Model.State.withSelection (Just newSelection)
                                            in
                                            removeRange newState

                            _ ->
                                Err "I expected an inline leaf array"


{-| Delete (forward) transform for a single character. This function has a few quirks in order to take
advantage of native delete behavior, namely:

  - selection offset = end of text leaf, try to delete the next text node's text
  - selection offset = 1 - end of text leaf, remove the last character (afterwards, the reduce behavior of `apply`
    may remove the text node)
  - any other offset, return an error to allow browser to do the default behavior

```
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
                                , markedText "text2" [ mark bold [] ]
                                ]
                        )
                    ]
            )
        )
        (Just <| caret [ 0, 0 ] 4)


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
                                , markedText "ext2" [ mark bold [] ]
                                ]
                        )
                    ]
            )
        )
        (Just <| caret [ 0, 1 ] 0)

deleteText before == Ok after
--> True
```

-}
deleteText : RichText.Config.Command.Transform
deleteText editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            if not <| RichText.Model.Selection.isCollapsed selection then
                Err "I can only backspace a collapsed selection"

            else
                case RichText.Node.nodeAt (anchorNode selection) (RichText.Model.State.root editorState) of
                    Nothing ->
                        Err "I was given an invalid path to delete text"

                    Just node ->
                        case node of
                            RichText.Node.Block _ ->
                                Err "I cannot delete text if the selection a block node"

                            RichText.Node.Inline il ->
                                case il of
                                    RichText.Model.Node.InlineElement _ ->
                                        Err "I cannot delete text if the selection an inline leaf"

                                    RichText.Model.Node.Text tl ->
                                        let
                                            textLength =
                                                String.length (RichText.Model.Text.text tl)
                                        in
                                        if RichText.Model.Selection.anchorOffset selection < (textLength - 1) then
                                            Err "I use the default behavior when deleting text when the anchor offset is not at the end of a text node"

                                        else if RichText.Model.Selection.anchorOffset selection == (textLength - 1) then
                                            case
                                                RichText.Node.replace
                                                    (anchorNode selection)
                                                    (RichText.Node.Inline
                                                        (RichText.Model.Node.Text
                                                            (tl |> RichText.Model.Text.withText (String.dropRight 1 (RichText.Model.Text.text tl)))
                                                        )
                                                    )
                                                    (RichText.Model.State.root editorState)
                                            of
                                                Err s ->
                                                    Err s

                                                Ok newRoot ->
                                                    Ok (editorState |> RichText.Model.State.withRoot newRoot)

                                        else
                                            case RichText.Node.next (anchorNode selection) (RichText.Model.State.root editorState) of
                                                Nothing ->
                                                    Err "I cannot do delete because there is no neighboring text node"

                                                Just ( nextPath, nextNode ) ->
                                                    case nextNode of
                                                        RichText.Node.Block _ ->
                                                            Err "Cannot delete the text of a block node"

                                                        RichText.Node.Inline nextInlineLeafWrapper ->
                                                            case nextInlineLeafWrapper of
                                                                RichText.Model.Node.Text _ ->
                                                                    let
                                                                        newSelection =
                                                                            RichText.Model.Selection.singleNodeRange nextPath 0 1
                                                                    in
                                                                    removeRange
                                                                        (editorState
                                                                            |> RichText.Model.State.withSelection (Just newSelection)
                                                                        )

                                                                RichText.Model.Node.InlineElement _ ->
                                                                    Err "Cannot delete if the previous node is an inline leaf"


{-| Removes the next inline element if the selection is at the end of a text leaf or inline element.
Returns an error if it was unable to remove the element.
-}
deleteInlineElement : RichText.Config.Command.Transform
deleteInlineElement editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            if not <| RichText.Model.Selection.isCollapsed selection then
                Err "I can only delete an inline element if the selection is collapsed"

            else
                case RichText.Node.nodeAt (anchorNode selection) (RichText.Model.State.root editorState) of
                    Nothing ->
                        Err "I was given an invalid path to delete text"

                    Just node ->
                        case node of
                            RichText.Node.Block _ ->
                                Err "I cannot delete text if the selection a block node"

                            RichText.Node.Inline il ->
                                let
                                    length =
                                        case il of
                                            RichText.Model.Node.Text t ->
                                                String.length (RichText.Model.Text.text t)

                                            RichText.Model.Node.InlineElement _ ->
                                                0
                                in
                                if RichText.Model.Selection.anchorOffset selection < length then
                                    Err "I cannot delete an inline element if the cursor is not at the end of an inline node"

                                else
                                    let
                                        incrementedPath =
                                            RichText.Model.Node.increment (anchorNode selection)
                                    in
                                    case RichText.Node.nodeAt incrementedPath (RichText.Model.State.root editorState) of
                                        Nothing ->
                                            Err "There is no next inline leaf to delete"

                                        Just incrementedNode ->
                                            case incrementedNode of
                                                RichText.Node.Inline nil ->
                                                    case nil of
                                                        RichText.Model.Node.InlineElement _ ->
                                                            case
                                                                RichText.Node.replaceWithFragment
                                                                    incrementedPath
                                                                    (RichText.Node.InlineFragment Array.empty)
                                                                    (RichText.Model.State.root editorState)
                                                            of
                                                                Err s ->
                                                                    Err s

                                                                Ok newRoot ->
                                                                    Ok (editorState |> RichText.Model.State.withRoot newRoot)

                                                        RichText.Model.Node.Text _ ->
                                                            Err "There is no next inline leaf element, found a text leaf"

                                                RichText.Node.Block _ ->
                                                    Err "There is no next inline leaf, found a block node"


{-| Removes the next block leaf if the selection is at the end of a text block, otherwise fails
with an error.

    before : State
    before =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block
                            (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ plainText "p1" ])
                        , block
                            (Element.element horizontalRule [])
                            Leaf
                        , block
                            (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ plainText "p2" ])
                        ]
                )
            )
            (Just <| caret [ 0, 0 ] 2)


    after : State
    after =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block
                            (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ plainText "p1" ])
                        , block
                            (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ plainText "p2" ])
                        ]
                )
            )
            (Just <| caret [ 0, 0 ] 2)

    deleteBlock before == Ok after
    --> True

-}
deleteBlock : RichText.Config.Command.Transform
deleteBlock editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            if not <| RichText.Node.selectionIsEndOfTextBlock selection (RichText.Model.State.root editorState) then
                Err "Cannot delete a block element if we're not at the end of a text block"

            else
                case RichText.Node.next (anchorNode selection) (RichText.Model.State.root editorState) of
                    Nothing ->
                        Err "There is no next node to delete"

                    Just ( path, node ) ->
                        case node of
                            RichText.Node.Block bn ->
                                case RichText.Model.Node.childNodes bn of
                                    RichText.Model.Node.Leaf ->
                                        case
                                            RichText.Node.replaceWithFragment
                                                path
                                                (RichText.Node.BlockFragment Array.empty)
                                                (RichText.Model.State.root editorState)
                                        of
                                            Err s ->
                                                Err s

                                            Ok newRoot ->
                                                Ok <| (editorState |> RichText.Model.State.withRoot (RichText.Annotation.clearSelectionAnnotations newRoot))

                                    _ ->
                                        Err "The next node is not a block leaf"

                            RichText.Node.Inline _ ->
                                Err "The next node is not a block leaf, it's an inline leaf"


{-| Removes the word after the collapsed selection, otherwise returns an error.

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
                                    [ plainText "this is an ex"
                                    , markedText "ample okay" [ mark bold [] ]
                                    ]
                            )
                        ]
                )
            )
            (Just <| caret [ 0, 0 ] 11)


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
                                    [ plainText "this is an "
                                    , markedText " okay" [ mark bold [] ]
                                    ]
                            )
                        ]
                )
            )
            (Just <| caret [ 0, 0 ] 11)

    deleteWord before == Ok after
    --> True

-}
deleteWord : RichText.Config.Command.Transform
deleteWord editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            if not <| RichText.Model.Selection.isCollapsed selection then
                Err "I cannot remove a word of a range selection"

            else
                case RichText.Node.findTextBlockNodeAncestor (anchorNode selection) (RichText.Model.State.root editorState) of
                    Nothing ->
                        Err "I can only remove a word on a text leaf"

                    Just ( p, n ) ->
                        case RichText.Model.Node.childNodes n of
                            RichText.Model.Node.InlineChildren arr ->
                                case List.Extra.last (anchorNode selection) of
                                    Nothing ->
                                        Err "Somehow the anchor node is the root node"

                                    Just lastIndex ->
                                        let
                                            groupedLeaves =
                                                List.Extra.groupWhile
                                                    groupSameTypeInlineLeaf
                                                    (Array.toList (RichText.Model.Node.toInlineArray arr))

                                            ( relativeLastIndex, group ) =
                                                List.foldl
                                                    (\( first, rest ) ( i, g ) ->
                                                        if not <| List.isEmpty g then
                                                            ( i, g )

                                                        else if List.length rest + 1 > i then
                                                            ( i, first :: rest )

                                                        else
                                                            ( i - (List.length rest + 1), g )
                                                    )
                                                    ( lastIndex, [] )
                                                    groupedLeaves

                                            groupText =
                                                textFromGroup group

                                            offsetUpToNewIndex =
                                                List.sum <|
                                                    List.take
                                                        relativeLastIndex
                                                    <|
                                                        lengthsFromGroup group

                                            offset =
                                                offsetUpToNewIndex + RichText.Model.Selection.anchorOffset selection

                                            stringTo =
                                                String.dropLeft offset groupText
                                        in
                                        if String.isEmpty stringTo then
                                            Err "Cannot remove word a word if the text fragment is empty"

                                        else
                                            let
                                                matches =
                                                    Regex.findAtMost 1 RichText.Internal.DeleteWord.deleteWordRegex stringTo

                                                matchOffset =
                                                    case List.head matches of
                                                        Nothing ->
                                                            0

                                                        Just match ->
                                                            match.index + String.length match.match

                                                ( newGroupIndex, newOffset, _ ) =
                                                    List.foldl
                                                        (\l ( i, o, done ) ->
                                                            if done then
                                                                ( i, o, done )

                                                            else if l < o then
                                                                ( i + 1, o - l, False )

                                                            else
                                                                ( i, o, True )
                                                        )
                                                        ( 0, offset + matchOffset, False )
                                                    <|
                                                        lengthsFromGroup group

                                                newIndex =
                                                    lastIndex - (relativeLastIndex - newGroupIndex)

                                                newSelection =
                                                    RichText.Model.Selection.range
                                                        (p ++ [ newIndex ])
                                                        newOffset
                                                        (anchorNode selection)
                                                        (RichText.Model.Selection.anchorOffset selection)

                                                newState =
                                                    editorState |> RichText.Model.State.withSelection (Just newSelection)
                                            in
                                            removeRange newState

                            _ ->
                                Err "I expected an inline leaf array"


isBlockLeaf : RichText.Model.Selection.Selection -> RichText.Model.Node.Block -> Bool
isBlockLeaf selection root =
    case RichText.Node.nodeAt (anchorNode selection) root of
        Nothing ->
            False

        Just n ->
            case n of
                RichText.Node.Block b ->
                    case RichText.Model.Node.childNodes b of
                        RichText.Model.Node.Leaf ->
                            True

                        _ ->
                            False

                _ ->
                    False


firstSelectablePath : RichText.Model.Node.Block -> Maybe RichText.Model.Node.Path
firstSelectablePath block =
    case RichText.Node.findForwardFromExclusive (\_ n -> RichText.Annotation.isSelectable n) [] block of
        Nothing ->
            Nothing

        Just ( p, _ ) ->
            Just p


{-| Inserts the block after a block leaf.

    emptyParagraph : Block
    emptyParagraph =
        block
            (Element.element paragraph [])
            (inlineChildren <| Array.fromList [ plainText "" ])


    before : State
    before =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block
                            (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ plainText "test" ])
                        , block
                            (Element.element horizontalRule [])
                            Leaf
                        ]
                )
            )
            (Just <| caret [ 1 ] 0)


    after : State
    after =
        state
            (block
                (Element.element doc [])
                (blockChildren <|
                    Array.fromList
                        [ block
                            (Element.element paragraph [])
                            (inlineChildren <| Array.fromList [ plainText "test" ])
                        , block
                            (Element.element horizontalRule [])
                            Leaf
                        , emptyParagraph
                        ]
                )
            )
            (Just <| caret [ 2, 0 ] 0)

    insertAfterBlockLeaf emptyParagraph before == Ok after
    --> True

-}
insertAfterBlockLeaf : RichText.Model.Node.Block -> RichText.Config.Command.Transform
insertAfterBlockLeaf blockToInsert state =
    case RichText.Model.State.selection state of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            if not <| RichText.Model.Selection.isCollapsed selection then
                Err "I cannot insert an empty paragraph unless the selection is collapsed"

            else if not <| isBlockLeaf selection (RichText.Model.State.root state) then
                Err "I can only insert an element after a block leaf"

            else
                case RichText.Node.insertAfter (anchorNode selection) (RichText.Node.BlockFragment <| Array.fromList [ blockToInsert ]) (RichText.Model.State.root state) of
                    Err s ->
                        Err s

                    Ok newRoot ->
                        let
                            relativeSelectablePath =
                                Maybe.withDefault [] (firstSelectablePath blockToInsert)

                            newAnchorPath =
                                RichText.Model.Node.increment (anchorNode selection) ++ relativeSelectablePath
                        in
                        Ok (RichText.Model.State.state newRoot (Just <| RichText.Model.Selection.caret newAnchorPath 0))


{-| Insert a newline at the selection in elements with the name whitelisted by the String list. This
is used by the code block element, since it only allows text (no line breaks or marks).
This is a somewhat specialized method, but may be useful outside of its narrow context.
-}
insertNewline : List String -> RichText.Config.Command.Transform
insertNewline elements editorState =
    let
        removedRangeEditorState =
            Result.withDefault editorState (removeRange editorState)
    in
    case RichText.Model.State.selection removedRangeEditorState of
        Nothing ->
            Err "Invalid selection"

        Just selection ->
            if not <| RichText.Model.Selection.isCollapsed selection then
                Err "I can only try to insert a newline if the selection is collapsed"

            else
                case RichText.Node.findTextBlockNodeAncestor (anchorNode selection) (RichText.Model.State.root removedRangeEditorState) of
                    Nothing ->
                        Err "No textblock node ancestor found"

                    Just ( _, textblock ) ->
                        if List.member (RichText.Model.Element.name (RichText.Model.Node.element textblock)) elements then
                            insertText "\n" removedRangeEditorState

                        else
                            Err "Selection is not a textblock"


{-| If the selection is collapsed at the beginning of a text block, this will select the previous
selectable node, and change the offset to the end if it's a text node. This is useful for default
backspace behavior in case a join backward operation could not be made.
-}
selectBackward : RichText.Config.Command.Transform
selectBackward state =
    case RichText.Model.State.selection state of
        Nothing ->
            Err "There is no selection to move forward"

        Just selection ->
            if not <| RichText.Node.selectionIsBeginningOfTextBlock selection (RichText.Model.State.root state) then
                Err "I can only select a node backwards if this is the beginning of a text block"

            else
                let
                    root =
                        RichText.Model.State.root state
                in
                case RichText.Node.findBackwardFromExclusive (\_ n -> RichText.Annotation.isSelectable n) (anchorNode selection) root of
                    Nothing ->
                        Err "I could not find a selectable node prior to the selected one"

                    Just ( newAnchor, n ) ->
                        let
                            offset =
                                case n of
                                    RichText.Node.Inline i ->
                                        case i of
                                            RichText.Model.Node.Text t ->
                                                String.length (RichText.Model.Text.text t)

                                            _ ->
                                                0

                                    _ ->
                                        0
                        in
                        Ok (state |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.caret newAnchor offset))


{-| If the selection is collapsed at the end of a text block, this will select the next
selectable node at offset 0. This is useful for default delete behavior in case a
join forward operation could not be made.
-}
selectForward : RichText.Config.Command.Transform
selectForward state =
    case RichText.Model.State.selection state of
        Nothing ->
            Err "There is no selection to move forward"

        Just selection ->
            if not <| RichText.Node.selectionIsEndOfTextBlock selection (RichText.Model.State.root state) then
                Err "I can only select a node forward if this is the end of a text block"

            else
                let
                    root =
                        RichText.Model.State.root state
                in
                case RichText.Node.findForwardFromExclusive (\_ n -> RichText.Annotation.isSelectable n) (anchorNode selection) root of
                    Nothing ->
                        Err "I could not find a selectable node after the selected one"

                    Just ( newAnchor, _ ) ->
                        Ok (state |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.caret newAnchor 0))
