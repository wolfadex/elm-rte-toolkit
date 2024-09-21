module RichText.Internal.Paste exposing (handlePaste)

import Array exposing (Array)
import List.Extra
import Result
import RichText.Annotation
import RichText.Commands
import RichText.Config.Command
import RichText.Config.Spec
import RichText.Internal.Constants
import RichText.Internal.Editor
import RichText.Internal.Event
import RichText.Internal.Spec
import RichText.Model.Node
import RichText.Model.Selection
import RichText.Model.State
import RichText.Node


handlePaste : RichText.Internal.Event.PasteEvent -> RichText.Config.Spec.Spec -> RichText.Internal.Editor.Editor -> RichText.Internal.Editor.Editor
handlePaste event spec editor =
    let
        commandArray =
            [ ( "pasteHtml", RichText.Config.Command.transform <| pasteHtml spec event.html )
            , ( "pasteText", RichText.Config.Command.transform <| pasteText event.text )
            ]
    in
    Result.withDefault editor (RichText.Internal.Editor.applyNamedCommandList commandArray spec editor)


pasteText : String -> RichText.Config.Command.Transform
pasteText text editorState =
    if String.isEmpty text then
        Err "There is no text to paste"

    else
        case RichText.Model.State.selection editorState of
            Nothing ->
                Err "Nothing is selected"

            Just selection ->
                if not <| RichText.Model.Selection.isCollapsed selection then
                    RichText.Commands.removeRange editorState |> Result.andThen (pasteText text)

                else
                    case RichText.Node.findTextBlockNodeAncestor (RichText.Model.Selection.anchorNode selection) (RichText.Model.State.root editorState) of
                        Nothing ->
                            Err "I can only paste test if there is a text block ancestor"

                        Just ( _, tbNode ) ->
                            let
                                lines =
                                    String.split "\n" (String.replace RichText.Internal.Constants.zeroWidthSpace "" text)

                                newLines =
                                    List.map
                                        (\line ->
                                            RichText.Model.Node.block (RichText.Model.Node.element tbNode)
                                                (RichText.Model.Node.inlineChildren <|
                                                    Array.fromList
                                                        [ RichText.Model.Node.plainText line
                                                        ]
                                                )
                                        )
                                        lines

                                fragment =
                                    RichText.Node.BlockFragment (Array.fromList newLines)
                            in
                            pasteFragment fragment editorState


pasteHtml : RichText.Config.Spec.Spec -> String -> RichText.Config.Command.Transform
pasteHtml spec html editorState =
    if String.isEmpty html then
        Err "There is no html to paste"

    else
        case RichText.Internal.Spec.htmlToElementArray spec html of
            Err s ->
                Err s

            Ok fragmentArray ->
                Array.foldl
                    (\fragment result ->
                        case result of
                            Err _ ->
                                result

                            Ok state ->
                                pasteFragment fragment state
                    )
                    (Ok editorState)
                    fragmentArray


pasteFragment : RichText.Node.Fragment -> RichText.Config.Command.Transform
pasteFragment fragment editorState =
    case fragment of
        RichText.Node.InlineFragment a ->
            pasteInlineArray a editorState

        RichText.Node.BlockFragment a ->
            pasteBlockArray a editorState


pasteInlineArray : Array RichText.Model.Node.Inline -> RichText.Config.Command.Transform
pasteInlineArray inlineFragment editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            if not <| RichText.Model.Selection.isCollapsed selection then
                RichText.Commands.removeRange editorState |> Result.andThen (pasteInlineArray inlineFragment)

            else
                case RichText.Node.findTextBlockNodeAncestor (RichText.Model.Selection.anchorNode selection) (RichText.Model.State.root editorState) of
                    Nothing ->
                        Err "I can only paste an inline array into a text block node"

                    Just ( path, node ) ->
                        case RichText.Model.Node.childNodes node of
                            RichText.Model.Node.BlockChildren _ ->
                                Err "I cannot add an inline array to a block array"

                            RichText.Model.Node.Leaf ->
                                Err "I cannot add an inline array to a block leaf"

                            RichText.Model.Node.InlineChildren a ->
                                case List.Extra.last (RichText.Model.Selection.anchorNode selection) of
                                    Nothing ->
                                        Err "Invalid state, somehow the anchor node is the root node"

                                    Just index ->
                                        case Array.get index (RichText.Model.Node.toInlineArray a) of
                                            Nothing ->
                                                Err "Invalid anchor node path"

                                            Just inlineNode ->
                                                case inlineNode of
                                                    RichText.Model.Node.Text tl ->
                                                        let
                                                            ( previous, next ) =
                                                                RichText.Node.splitTextLeaf (RichText.Model.Selection.anchorOffset selection) tl

                                                            newFragment =
                                                                Array.fromList <| RichText.Model.Node.Text previous :: (Array.toList inlineFragment ++ [ RichText.Model.Node.Text next ])

                                                            replaceResult =
                                                                RichText.Node.replaceWithFragment (RichText.Model.Selection.anchorNode selection)
                                                                    (RichText.Node.InlineFragment newFragment)
                                                                    (RichText.Model.State.root editorState)
                                                        in
                                                        case replaceResult of
                                                            Err s ->
                                                                Err s

                                                            Ok newRoot ->
                                                                let
                                                                    newSelection =
                                                                        RichText.Model.Selection.caret (path ++ [ index + Array.length inlineFragment + 1 ]) 0
                                                                in
                                                                Ok
                                                                    (editorState
                                                                        |> RichText.Model.State.withSelection (Just newSelection)
                                                                        |> RichText.Model.State.withRoot newRoot
                                                                    )

                                                    RichText.Model.Node.InlineElement _ ->
                                                        let
                                                            replaceResult =
                                                                RichText.Node.replaceWithFragment (RichText.Model.Selection.anchorNode selection) (RichText.Node.InlineFragment inlineFragment) (RichText.Model.State.root editorState)
                                                        in
                                                        case replaceResult of
                                                            Err s ->
                                                                Err s

                                                            Ok newRoot ->
                                                                let
                                                                    newSelection =
                                                                        RichText.Model.Selection.caret (path ++ [ index + Array.length inlineFragment - 1 ]) 0
                                                                in
                                                                Ok
                                                                    (editorState
                                                                        |> RichText.Model.State.withSelection (Just newSelection)
                                                                        |> RichText.Model.State.withRoot newRoot
                                                                    )


pasteBlockArray : Array RichText.Model.Node.Block -> RichText.Config.Command.Transform
pasteBlockArray blockFragment editorState =
    -- split, add nodes, select beginning, join backwards, select end, join forward
    case RichText.Model.State.selection editorState of
        Nothing ->
            Err "Nothing is selected"

        Just selection ->
            if not <| RichText.Model.Selection.isCollapsed selection then
                RichText.Commands.removeRange editorState |> Result.andThen (pasteBlockArray blockFragment)

            else
                let
                    parentPath =
                        RichText.Model.Node.parent (RichText.Model.Selection.anchorNode selection)
                in
                case RichText.Node.nodeAt parentPath (RichText.Model.State.root editorState) of
                    Nothing ->
                        Err "I cannot find the parent node of the selection"

                    Just parentNode ->
                        case parentNode of
                            RichText.Node.Inline _ ->
                                Err "Invalid parent node"

                            RichText.Node.Block bn ->
                                case RichText.Model.Node.childNodes bn of
                                    RichText.Model.Node.Leaf ->
                                        Err "Invalid parent node, somehow the parent node was a leaf"

                                    RichText.Model.Node.BlockChildren _ ->
                                        case
                                            RichText.Node.replaceWithFragment (RichText.Model.Selection.anchorNode selection)
                                                (RichText.Node.BlockFragment blockFragment)
                                                (RichText.Model.State.root editorState)
                                        of
                                            Err s ->
                                                Err s

                                            Ok newRoot ->
                                                case List.Extra.last (RichText.Model.Selection.anchorNode selection) of
                                                    Nothing ->
                                                        Err "Invalid anchor node, somehow the parent is root"

                                                    Just index ->
                                                        let
                                                            newSelection =
                                                                RichText.Model.Selection.caret (parentPath ++ [ index + Array.length blockFragment - 1 ]) 0
                                                        in
                                                        Ok
                                                            (editorState
                                                                |> RichText.Model.State.withSelection (Just newSelection)
                                                                |> RichText.Model.State.withRoot newRoot
                                                            )

                                    RichText.Model.Node.InlineChildren _ ->
                                        case RichText.Commands.splitTextBlock editorState of
                                            Err s ->
                                                Err s

                                            Ok splitEditorState ->
                                                case State.selection splitEditorState of
                                                    Nothing ->
                                                        Err "Invalid editor state selection after split action."

                                                    Just splitSelection ->
                                                        let
                                                            annotatedSelectionRoot =
                                                                RichText.Annotation.annotateSelection splitSelection (RichText.Model.State.root splitEditorState)
                                                        in
                                                        case RichText.Node.insertAfter parentPath (RichText.Node.BlockFragment blockFragment) annotatedSelectionRoot of
                                                            Err s ->
                                                                Err s

                                                            Ok addedNodesRoot ->
                                                                let
                                                                    addNodesEditorState =
                                                                        editorState |> RichText.Model.State.withRoot addedNodesRoot

                                                                    joinBeginningState =
                                                                        Result.withDefault
                                                                            addNodesEditorState
                                                                            (RichText.Commands.joinForward
                                                                                (addNodesEditorState
                                                                                    |> RichText.Model.State.withSelection
                                                                                        (Just <|
                                                                                            RichText.Model.Selection.caret
                                                                                                (RichText.Model.Selection.anchorNode selection)
                                                                                                (RichText.Model.Selection.anchorOffset selection)
                                                                                        )
                                                                                )
                                                                            )

                                                                    annotatedSelection =
                                                                        RichText.Annotation.selectionFromAnnotations (RichText.Model.State.root joinBeginningState)
                                                                            (RichText.Model.Selection.anchorOffset splitSelection)
                                                                            (RichText.Model.Selection.focusOffset splitSelection)

                                                                    joinEndState =
                                                                        Result.withDefault
                                                                            joinBeginningState
                                                                            (RichText.Commands.joinBackward (joinBeginningState |> RichText.Model.State.withSelection annotatedSelection))
                                                                in
                                                                Ok (joinEndState |> RichText.Model.State.withRoot (RichText.Annotation.clearSelectionAnnotations (RichText.Model.State.root joinEndState)))
