module RichText.Internal.Definitions exposing (ContentType(..), Contents, Element(..), ElementDefinition(..), ElementDefinitionContents, ElementParametersContents, ElementToHtml, HtmlToElement, HtmlToMark, Mark(..), MarkDefinition(..), MarkDefinitionContents, MarkToHtml, annotationsFromElement, attributesFromElement, attributesFromMark, element, elementWithAnnotations, elementWithAttributes, mark, markWithAttributes, nameFromElement, nameFromMark, toStringContentType)

{-| Internal module for various entities related to definition, elements and nodes to keep records
private and avoid dependency loops.
-}

import Array exposing (Array)
import RichText.Internal.Constants
import RichText.Model.Attribute
import RichText.Model.HtmlNode
import Set exposing (Set)


{-| Implementation note:

We only store the name in element parameters and marks because we want to follow the Elm
architecture and not store functions in the model.

The benefits of this is that it avoids serialization issues with the debugger and potential
runtime errors on (==). The tradeoff to not storing the serialization functions directly in the
model is an extra dictionary lookup for each node everytime we want to get the definition, as
well as a somewhat more annoying API where functions need an extra spec argument so we can lookup
the definition.

-}
type ContentType
    = BlockNodeType (Maybe (Set String))
    | TextBlockNodeType { allowedGroups : Maybe (Set String), allowedMarks : Maybe (Set String) }
    | BlockLeafNodeType
    | InlineLeafNodeType


type alias ElementParametersContents =
    { name : String
    , attributes : List RichText.Model.Attribute.Attribute
    , annotations : Set String
    }


type Element
    = ElementParameters ElementParametersContents


element : ElementDefinition -> List RichText.Model.Attribute.Attribute -> Element
element def attrs =
    case def of
        ElementDefinition d ->
            ElementParameters
                { name = d.name
                , attributes = attrs
                , annotations =
                    if d.selectable then
                        Set.singleton RichText.Internal.Constants.selectable

                    else
                        Set.empty
                }


nameFromElement : Element -> String
nameFromElement parameters =
    case parameters of
        ElementParameters c ->
            c.name


attributesFromElement : Element -> List RichText.Model.Attribute.Attribute
attributesFromElement parameters =
    case parameters of
        ElementParameters c ->
            c.attributes


annotationsFromElement : Element -> Set String
annotationsFromElement parameters =
    case parameters of
        ElementParameters c ->
            c.annotations


elementWithAnnotations : Set String -> Element -> Element
elementWithAnnotations annotations parameters =
    case parameters of
        ElementParameters c ->
            ElementParameters <| { c | annotations = annotations }


elementWithAttributes : List RichText.Model.Attribute.Attribute -> Element -> Element
elementWithAttributes attrs parameters =
    case parameters of
        ElementParameters c ->
            ElementParameters <| { c | attributes = attrs }


type Mark
    = Mark Contents


type alias Contents =
    { name : String, attributes : List RichText.Model.Attribute.Attribute }


mark : MarkDefinition -> List RichText.Model.Attribute.Attribute -> Mark
mark n a =
    case n of
        MarkDefinition nn ->
            Mark { name = nn.name, attributes = a }


nameFromMark : Mark -> String
nameFromMark m =
    case m of
        Mark c ->
            c.name


attributesFromMark : Mark -> List RichText.Model.Attribute.Attribute
attributesFromMark m =
    case m of
        Mark c ->
            c.attributes


markWithAttributes : List RichText.Model.Attribute.Attribute -> Mark -> Mark
markWithAttributes attributes_ m =
    case m of
        Mark c ->
            Mark { c | attributes = attributes_ }


type MarkDefinition
    = MarkDefinition MarkDefinitionContents


type alias MarkDefinitionContents =
    { name : String
    , toHtmlNode : MarkToHtml
    , fromHtmlNode : HtmlToMark
    }


type alias MarkToHtml =
    Mark -> Array RichText.Model.HtmlNode.HtmlNode -> RichText.Model.HtmlNode.HtmlNode


type alias HtmlToMark =
    MarkDefinition -> RichText.Model.HtmlNode.HtmlNode -> Maybe ( Mark, Array RichText.Model.HtmlNode.HtmlNode )


type alias ElementToHtml =
    Element -> Array RichText.Model.HtmlNode.HtmlNode -> RichText.Model.HtmlNode.HtmlNode


type alias HtmlToElement =
    ElementDefinition -> RichText.Model.HtmlNode.HtmlNode -> Maybe ( Element, Array RichText.Model.HtmlNode.HtmlNode )


type ElementDefinition
    = ElementDefinition ElementDefinitionContents


type alias ElementDefinitionContents =
    { name : String
    , toHtmlNode : ElementToHtml
    , group : String
    , contentType : ContentType
    , fromHtmlNode : HtmlToElement
    , selectable : Bool
    }


toStringContentType : ContentType -> String
toStringContentType contentType =
    case contentType of
        TextBlockNodeType _ ->
            "TextBlockNodeType"

        InlineLeafNodeType ->
            "InlineLeafNodeType"

        BlockNodeType _ ->
            "BlockNodeType"

        BlockLeafNodeType ->
            "BlockLeafNodeType"
