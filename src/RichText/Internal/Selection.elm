module RichText.Internal.Selection exposing
    ( domToEditor
    , editorToDom
    )

import RichText.Config.Spec
import RichText.Internal.Path
import RichText.Model.Node
import RichText.Model.Selection


domToEditor : RichText.Config.Spec.Spec -> RichText.Model.Node.Block -> RichText.Model.Selection.Selection -> Maybe RichText.Model.Selection.Selection
domToEditor spec =
    transformSelection (RichText.Internal.Path.domToEditor spec)


editorToDom : RichText.Config.Spec.Spec -> RichText.Model.Node.Block -> RichText.Model.Selection.Selection -> Maybe RichText.Model.Selection.Selection
editorToDom spec =
    transformSelection (RichText.Internal.Path.editorToDom spec)


transformSelection : (RichText.Model.Node.Block -> RichText.Model.Node.Path -> Maybe RichText.Model.Node.Path) -> RichText.Model.Node.Block -> RichText.Model.Selection.Selection -> Maybe RichText.Model.Selection.Selection
transformSelection transformation node selection =
    case transformation node (RichText.Model.Selection.anchorNode selection) of
        Nothing ->
            Nothing

        Just an ->
            case transformation node (RichText.Model.Selection.focusNode selection) of
                Nothing ->
                    Nothing

                Just fn ->
                    Just <| RichText.Model.Selection.range an (RichText.Model.Selection.anchorOffset selection) fn (RichText.Model.Selection.focusOffset selection)
