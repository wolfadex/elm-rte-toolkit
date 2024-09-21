module RichText.Internal.Editor exposing
    ( Editor(..)
    , EditorContents
    , Message(..)
    , Tagger
    , applyCommand
    , applyCommandNoForceSelection
    , applyNamedCommandList
    , bufferedEditorState
    , changeCount
    , completeRerenderCount
    , editor
    , forceCompleteRerender
    , forceRerender
    , forceReselection
    , history
    , isComposing
    , renderCount
    , selectionCount
    , shortKey
    , state
    , updateEditorState
    , updateEditorStateWithTimestamp
    , withBufferedEditorState
    , withComposing
    , withHistory
    , withShortKey
    , withState
    )

{-| This is the internal module contains the types used to model the editor,
as well as the messages used to update the editor's internal state.
-}

import BoundedDeque exposing (BoundedDeque)
import RichText.Config.Command
import RichText.Config.Keys
import RichText.Config.Spec
import RichText.Internal.Event
import RichText.Internal.History
import RichText.Model.Node
import RichText.Model.Selection
import RichText.Model.State
import RichText.State


type alias Tagger msg =
    Message -> msg


type Editor
    = Editor EditorContents


{-| Represents a rich text editor. The state of the editor, along with render information,
tagger function, and command map.
-}
type alias EditorContents =
    { state : RichText.Model.State.State
    , renderCount : Int
    , selectionCount : Int
    , shortKey : String
    , completeRerenderCount : Int
    , isComposing : Bool
    , bufferedEditorState : Maybe RichText.Model.State.State
    , history : RichText.Internal.History.History
    , changeCount : Int
    }


defaultDequeSize : Int
defaultDequeSize =
    64


editor : RichText.Model.State.State -> Editor
editor iState =
    Editor
        { renderCount = 0
        , bufferedEditorState = Nothing
        , completeRerenderCount = 0
        , selectionCount = 0
        , shortKey = RichText.Config.Keys.meta
        , isComposing = False
        , state = iState
        , history = RichText.Internal.History.empty { size = defaultDequeSize, groupDelayMilliseconds = 500 }
        , changeCount = 0
        }


{-| The internal events that an editor has to respond to. These events should be mapped via a Tagger.
-}
type Message
    = SelectionEvent (Maybe RichText.Model.Selection.Selection)
    | SelectElement RichText.Model.Node.Path
    | ChangeEvent RichText.Internal.Event.EditorChange
    | BeforeInputEvent RichText.Internal.Event.InputEvent
    | KeyDownEvent RichText.Internal.Event.KeyboardEvent
    | CompositionStart
    | CompositionEnd
    | PasteWithDataEvent RichText.Internal.Event.PasteEvent
    | CutEvent
    | Init RichText.Internal.Event.InitEvent


completeRerenderCount : Editor -> Int
completeRerenderCount e =
    case e of
        Editor c ->
            c.completeRerenderCount


selectionCount : Editor -> Int
selectionCount e =
    case e of
        Editor c ->
            c.selectionCount


renderCount : Editor -> Int
renderCount e =
    case e of
        Editor c ->
            c.renderCount


bufferedEditorState : Editor -> Maybe RichText.Model.State.State
bufferedEditorState e =
    case e of
        Editor c ->
            c.bufferedEditorState


isComposing : Editor -> Bool
isComposing e =
    case e of
        Editor c ->
            c.isComposing


withComposing : Bool -> Editor -> Editor
withComposing composing e =
    case e of
        Editor c ->
            Editor { c | isComposing = composing }


withBufferedEditorState : Maybe RichText.Model.State.State -> Editor -> Editor
withBufferedEditorState s e =
    case e of
        Editor c ->
            Editor { c | bufferedEditorState = s }


state : Editor -> RichText.Model.State.State
state e =
    case e of
        Editor c ->
            c.state


withState : RichText.Model.State.State -> Editor -> Editor
withState s e =
    case e of
        Editor c ->
            Editor { c | state = s }


history : Editor -> RichText.Internal.History.History
history e =
    case e of
        Editor c ->
            c.history


changeCount : Editor -> Int
changeCount e =
    case e of
        Editor c ->
            c.changeCount


shortKey : Editor -> String
shortKey e =
    case e of
        Editor c ->
            c.shortKey


withHistory : RichText.Internal.History.History -> Editor -> Editor
withHistory h e =
    case e of
        Editor c ->
            Editor { c | history = h }


withShortKey : String -> Editor -> Editor
withShortKey key e =
    case e of
        Editor c ->
            Editor { c | shortKey = key }


incrementChangeCount : Editor -> Editor
incrementChangeCount e =
    case e of
        Editor c ->
            Editor { c | changeCount = c.changeCount + 1 }


forceRerender : Editor -> Editor
forceRerender e =
    case e of
        Editor c ->
            Editor { c | renderCount = c.renderCount + 1 }


forceReselection : Editor -> Editor
forceReselection e =
    case e of
        Editor c ->
            Editor { c | selectionCount = c.selectionCount + 1 }


forceCompleteRerender : Editor -> Editor
forceCompleteRerender e =
    case e of
        Editor c ->
            Editor { c | completeRerenderCount = c.completeRerenderCount + 1 }


handleUndo : Editor -> Editor
handleUndo editor_ =
    let
        editorHistory =
            RichText.Internal.History.contents (history editor_)

        editorState =
            state editor_

        ( maybeState, newUndoDeque ) =
            findNextState editorState editorHistory.undoDeque
    in
    case maybeState of
        Nothing ->
            editor_

        Just newState ->
            let
                newHistory =
                    { editorHistory | undoDeque = newUndoDeque, redoStack = editorState :: editorHistory.redoStack, lastTextChangeTimestamp = 0 }
            in
            incrementChangeCount
                (editor_ |> withState newState |> withHistory (RichText.Internal.History.fromContents newHistory))


handleRedo : Editor -> Result String Editor
handleRedo editor_ =
    let
        editorHistory =
            RichText.Internal.History.contents (history editor_)
    in
    case editorHistory.redoStack of
        [] ->
            Err "There are no states on the redo stack"

        newState :: xs ->
            let
                newHistory =
                    { editorHistory
                        | undoDeque =
                            BoundedDeque.pushFront ( "redo", state editor_ )
                                editorHistory.undoDeque
                        , redoStack = xs
                    }
            in
            Ok
                (incrementChangeCount
                    (editor_ |> withState newState |> withHistory (RichText.Internal.History.fromContents newHistory))
                )


updateEditorState : String -> RichText.Model.State.State -> Editor -> Editor
updateEditorState =
    updateEditorStateWithTimestamp Nothing


updateEditorStateWithTimestamp : Maybe Int -> String -> RichText.Model.State.State -> Editor -> Editor
updateEditorStateWithTimestamp maybeTimestamp action newState editor_ =
    let
        editorHistory =
            RichText.Internal.History.contents (history editor_)

        timestamp =
            Maybe.withDefault 0 maybeTimestamp

        newUndoDeque =
            case BoundedDeque.first editorHistory.undoDeque of
                Nothing ->
                    BoundedDeque.pushFront ( action, state editor_ ) editorHistory.undoDeque

                Just ( lastAction, _ ) ->
                    if
                        lastAction
                            == action
                            && timestamp
                            /= 0
                            && timestamp
                            - editorHistory.lastTextChangeTimestamp
                            < editorHistory.groupDelayMilliseconds
                    then
                        editorHistory.undoDeque

                    else
                        BoundedDeque.pushFront ( action, state editor_ ) editorHistory.undoDeque

        newHistory =
            { editorHistory
                | undoDeque = newUndoDeque
                , redoStack = []
                , lastTextChangeTimestamp = timestamp
            }
    in
    incrementChangeCount (editor_ |> withState newState |> withHistory (RichText.Internal.History.fromContents newHistory))


applyInternalCommand : RichText.Config.Command.InternalAction -> Editor -> Result String Editor
applyInternalCommand action editor_ =
    case action of
        RichText.Config.Command.Undo ->
            -- Undo always succeeds to prevent the default undo behavior.
            Ok (handleUndo editor_)

        RichText.Config.Command.Redo ->
            handleRedo editor_


findNextState : RichText.Model.State.State -> BoundedDeque ( String, RichText.Model.State.State ) -> ( Maybe RichText.Model.State.State, BoundedDeque ( String, RichText.Model.State.State ) )
findNextState editorState undoDeque =
    let
        ( maybeState, rest ) =
            BoundedDeque.popFront undoDeque
    in
    case maybeState of
        Nothing ->
            ( Nothing, rest )

        Just ( _, state_ ) ->
            if state_ /= editorState then
                ( Just state_, rest )

            else
                findNextState editorState rest


applyCommand : RichText.Config.Command.NamedCommand -> RichText.Config.Spec.Spec -> Editor -> Result String Editor
applyCommand ( name, command ) spec editor_ =
    case command of
        RichText.Config.Command.InternalCommand action ->
            applyInternalCommand action editor_

        RichText.Config.Command.TransformCommand transform ->
            case transform (state editor_) |> Result.andThen (RichText.State.validate spec) of
                Err s ->
                    Err s

                Ok v ->
                    let
                        reducedState =
                            RichText.State.reduce v
                    in
                    Ok <| forceReselection (updateEditorState name reducedState editor_)


applyCommandNoForceSelection : RichText.Config.Command.NamedCommand -> RichText.Config.Spec.Spec -> Editor -> Result String Editor
applyCommandNoForceSelection ( name, command ) spec editor_ =
    case command of
        RichText.Config.Command.InternalCommand action ->
            applyInternalCommand action editor_

        RichText.Config.Command.TransformCommand transform ->
            case transform (state editor_) |> Result.andThen (RichText.State.validate spec) of
                Err s ->
                    Err s

                Ok v ->
                    let
                        reducedState =
                            RichText.State.reduce v
                    in
                    Ok <| updateEditorState name reducedState editor_


applyNamedCommandList : RichText.Config.Command.NamedCommandList -> RichText.Config.Spec.Spec -> Editor -> Result String Editor
applyNamedCommandList list spec editor_ =
    List.foldl
        (\cmd result ->
            case result of
                Err _ ->
                    case applyCommand cmd spec editor_ of
                        Err s2 ->
                            Err s2

                        Ok o ->
                            Ok o

                _ ->
                    result
        )
        (Err "No commands found")
        list
