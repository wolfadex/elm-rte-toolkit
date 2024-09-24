module RichText.Internal.HtmlNode exposing (childNodesPlaceholder, editorBlockNodeToHtmlNode)

import Array exposing (Array)
import RichText.Config.ElementDefinition
import RichText.Config.MarkDefinition
import RichText.Config.Spec
import RichText.Internal.Spec
import RichText.Model.Element
import RichText.Model.HtmlNode
import RichText.Model.InlineElement
import RichText.Model.Mark
import RichText.Model.Node
import RichText.Model.Text


childNodesPlaceholder : Array RichText.Model.HtmlNode.HtmlNode
childNodesPlaceholder =
    Array.fromList
        [ RichText.Model.HtmlNode.ElementNode "__child_node_marker__" [] Array.empty ]


{-| Renders marks to their HtmlNode representation.
-}
markToHtmlNode : RichText.Config.Spec.Spec -> RichText.Model.Mark.Mark -> Array RichText.Model.HtmlNode.HtmlNode -> RichText.Model.HtmlNode.HtmlNode
markToHtmlNode spec mark children =
    let
        markDefinition =
            RichText.Internal.Spec.markDefinitionWithDefault mark spec
    in
    RichText.Config.MarkDefinition.toHtmlNode markDefinition mark children


{-| Renders element parameters to their HtmlNode representation.
-}
elementToHtmlNode : RichText.Config.Spec.Spec -> RichText.Model.Element.Element -> Array RichText.Model.HtmlNode.HtmlNode -> RichText.Model.HtmlNode.HtmlNode
elementToHtmlNode spec parameters children =
    let
        elementDefinition =
            RichText.Internal.Spec.elementDefinitionWithDefault parameters spec
    in
    RichText.Config.ElementDefinition.toHtmlNode elementDefinition parameters children


{-| Renders element block nodes to their HtmlNode representation.
-}
editorBlockNodeToHtmlNode : RichText.Config.Spec.Spec -> RichText.Model.Node.Block -> RichText.Model.HtmlNode.HtmlNode
editorBlockNodeToHtmlNode spec node =
    elementToHtmlNode spec (RichText.Model.Node.element node) (childNodesToHtmlNode spec (RichText.Model.Node.childNodes node))


{-| Renders child nodes to their HtmlNode representation.
-}
childNodesToHtmlNode : RichText.Config.Spec.Spec -> RichText.Model.Node.Children -> Array RichText.Model.HtmlNode.HtmlNode
childNodesToHtmlNode spec childNodes =
    case childNodes of
        RichText.Model.Node.BlockChildren blockArray ->
            Array.map (editorBlockNodeToHtmlNode spec) (RichText.Model.Node.toBlockArray blockArray)

        RichText.Model.Node.InlineChildren inlineLeafArray ->
            Array.map (editorInlineLeafTreeToHtmlNode spec (RichText.Model.Node.toInlineArray inlineLeafArray)) (RichText.Model.Node.toInlineTree inlineLeafArray)

        RichText.Model.Node.Leaf ->
            Array.empty


{-| Renders text nodes to their HtmlNode representation.
-}
textToHtmlNode : String -> RichText.Model.HtmlNode.HtmlNode
textToHtmlNode text =
    RichText.Model.HtmlNode.TextNode text


errorNode : RichText.Model.HtmlNode.HtmlNode
errorNode =
    RichText.Model.HtmlNode.ElementNode "div" [ ( "class", "rte-error" ) ] Array.empty


editorInlineLeafTreeToHtmlNode : RichText.Config.Spec.Spec -> Array RichText.Model.Node.Inline -> RichText.Model.Node.InlineTree -> RichText.Model.HtmlNode.HtmlNode
editorInlineLeafTreeToHtmlNode spec array tree =
    case tree of
        RichText.Model.Node.LeafNode i ->
            case Array.get i array of
                Nothing ->
                    errorNode

                Just l ->
                    editorInlineLeafToHtmlNode spec l

        RichText.Model.Node.MarkNode n ->
            markToHtmlNode spec n.mark (Array.map (editorInlineLeafTreeToHtmlNode spec array) n.children)


{-| Renders inline leaf nodes to their HtmlNode representation.
-}
editorInlineLeafToHtmlNode : RichText.Config.Spec.Spec -> RichText.Model.Node.Inline -> RichText.Model.HtmlNode.HtmlNode
editorInlineLeafToHtmlNode spec node =
    case node of
        RichText.Model.Node.Text contents ->
            textToHtmlNode (RichText.Model.Text.text contents)

        RichText.Model.Node.InlineElement l ->
            elementToHtmlNode spec (RichText.Model.InlineElement.element l) Array.empty
