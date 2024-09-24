module RichText.Config.ElementDefinition exposing
    ( ElementDefinition, elementDefinition, ElementToHtml, HtmlToElement, name, group, contentType, fromHtmlNode, toHtmlNode
    , ContentType, blockLeaf, inlineLeaf, blockNode, textBlock
    , defaultElementDefinition, defaultElementToHtml, defaultHtmlToElement
    )

{-| An element definition describes how to serialize/deserialize an element, as well as what content
it can have.


# Element definition

@docs ElementDefinition, elementDefinition, ElementToHtml, HtmlToElement, name, group, contentType, fromHtmlNode, toHtmlNode


# Content type

@docs ContentType, blockLeaf, inlineLeaf, blockNode, textBlock


# Struts

@docs defaultElementDefinition, defaultElementToHtml, defaultHtmlToElement

-}

import Array exposing (Array)
import RichText.Internal.Definitions
import RichText.Model.Attribute
import RichText.Model.Element
import RichText.Model.HtmlNode
import Set


{-| Describes what type of node can have this element, as well as what children the node can contain.
It can be one of four values:

  - `inlineLeaf`: An inline element, like an inline image or hard break.
  - `blockLeaf`: A block which does not allow children, like a horizontal rule.
  - `blockNode`: A block with block children, like a blockquote, list, or table.
  - `textBlock`: A block with inline children, like a paragraph or heading.

-}
type alias ContentType =
    RichText.Internal.Definitions.ContentType


{-| A `ElementDefinition` contains information on how to serialize/deserialize an editor node,
as well as describes what type of node and what children the node can have.
-}
type alias ElementDefinition =
    RichText.Internal.Definitions.ElementDefinition


{-| Type alias for defining an element serialization function.

    paragraphToHtml : ElementToHtml
    paragraphToHtml _ children =
        ElementNode "p" [] children

Note that when defining serialization functions, children should NOT be modified in any way, otherwise
it will potentially break the selection and rendering logic. This is because we pass in a placeholder
to partially serialize a document in some parts of the package.

-}
type alias ElementToHtml =
    RichText.Model.Element.Element -> Array RichText.Model.HtmlNode.HtmlNode -> RichText.Model.HtmlNode.HtmlNode


{-| Type alias for defining an element deserialization function.

    htmlToParagraph : HtmlToElement
    htmlToParagraph definition node =
        case node of
            ElementNode name _ children ->
                if name == "p" then
                    Just <| ( element definition [], children )

                else
                    Nothing

            _ ->
                Nothing

-}
type alias HtmlToElement =
    ElementDefinition -> RichText.Model.HtmlNode.HtmlNode -> Maybe ( RichText.Model.Element.Element, Array RichText.Model.HtmlNode.HtmlNode )


{-| Defines an element. The arguments are as follows:

  - `name` is the unique name of this type of node, usually something like "paragraph" or "heading"

  - `group` is the group this element belongs to. Commonly, this value will be 'block' or 'inline'
    This is used when validating the document and can be useful if you're defining complicated block structures
    like a table or list. For example, for a markdown list, there is a 'list\_item' group, and ordered lists
    and unordered lists only accept children that are part of the 'list\_item' group. The root
    node must be of group 'root'.

  - `contentType` describes what type of node this is, namely a block with block children, a block leaf,
    a block with inline children, or an inline leaf element.

  - `toHtmlNode` converts an element into html. This is used when rendering the document
    as well as path translation and DOM validation logic.

  - `fromHtmlNode` converts html to an element. Currently, this is only used for paste
    event, but could potentially be used more generally in the future to interpret content editable
    changes.

```
-- Define a paragraph element
paragraph =
    elementDefinition
        { name = "paragraph"
        , group = "block"
        , contentType = textBlock [ "inline" ]
        , toHtmlNode = paragraphToHtml
        , fromHtmlNode = htmlToParagraph
        }
```

-}
elementDefinition :
    { name : String
    , group : String
    , contentType : ContentType
    , toHtmlNode : ElementToHtml
    , fromHtmlNode : HtmlToElement
    , selectable : Bool
    }
    -> ElementDefinition
elementDefinition contents =
    RichText.Internal.Definitions.ElementDefinition
        contents


{-| The name of the node this element definition defines.

    name paragraph
    --> "paragraph"

-}
name : ElementDefinition -> String
name definition_ =
    case definition_ of
        RichText.Internal.Definitions.ElementDefinition c ->
            c.name


{-| The group this node belongs to

    group paragraph
    --> "inline"

-}
group : ElementDefinition -> String
group definition_ =
    case definition_ of
        RichText.Internal.Definitions.ElementDefinition c ->
            c.group


{-| The serialization function for this node. This should be called internally by the editor code
to determine selection, render the editor, and validate the DOM.
-}
toHtmlNode : ElementDefinition -> ElementToHtml
toHtmlNode definition_ =
    case definition_ of
        RichText.Internal.Definitions.ElementDefinition c ->
            c.toHtmlNode


{-| The deserialization function for this node. This is used for things like a paste event to
derive editor nodes from HTML content.
-}
fromHtmlNode : ElementDefinition -> HtmlToElement
fromHtmlNode definition_ =
    case definition_ of
        RichText.Internal.Definitions.ElementDefinition c ->
            c.fromHtmlNode


{-| Describes what type of node this is and what children it can have.
-}
contentType : ElementDefinition -> ContentType
contentType definition_ =
    case definition_ of
        RichText.Internal.Definitions.ElementDefinition c ->
            c.contentType


{-| An inline leaf is an InlineElement like an image or a breaking line.
-}
inlineLeaf : ContentType
inlineLeaf =
    RichText.Internal.Definitions.InlineLeafNodeType


{-| A block leaf is a Block that does not allow child nodes, like a horizontal rule.
-}
blockLeaf : ContentType
blockLeaf =
    RichText.Internal.Definitions.BlockLeafNodeType


{-| A block node is a Block that has other block children, like a blockquote or list. The
argument is the group or name of the nodes that it allows as children.

    blockNode [ "list_item" ]
    --> A content type for a node that only accepts child nodes who are blocks and whose is name or group is list_items.

-}
blockNode : List String -> ContentType
blockNode allowedGroups =
    RichText.Internal.Definitions.BlockNodeType <|
        if List.isEmpty allowedGroups then
            Nothing

        else
            Just <| Set.fromList allowedGroups


{-| A text block node is a Block that has inline children, like a header or paragraph.

  - `allowedGroups` the group or name of the nodes that it allows as children. If a list is empty, then
    all groups are allowed.

  - `allowedMarks` the name of the marks that this textblock allows. If a list is empty, then
    all marks are allowed.

    textBlock {allowedGroups: [ "inline" ], allowedMarks: []}
    --> A content type for a node that only accepts child nodes who are in the "inline" group and allows all marks

-}
textBlock : { allowedGroups : List String, allowedMarks : List String } -> ContentType
textBlock config =
    RichText.Internal.Definitions.TextBlockNodeType
        { allowedGroups =
            if List.isEmpty config.allowedGroups then
                Nothing

            else
                Just <| Set.fromList config.allowedGroups
        , allowedMarks =
            if List.isEmpty config.allowedMarks then
                Nothing

            else
                Just <| Set.fromList config.allowedMarks
        }


{-| Creates an element definition which assumes the name of the editor node is the same as the name of the
html node.

    defaultElementDefinition "p" "block" (textBlock [])
    --> definition which encodes to <p>...</p> and decodes from "<p>...</p>"

-}
defaultElementDefinition : String -> String -> ContentType -> ElementDefinition
defaultElementDefinition name_ group_ contentType_ =
    elementDefinition
        { name = name_
        , group = group_
        , contentType = contentType_
        , toHtmlNode = defaultElementToHtml name_
        , fromHtmlNode = defaultHtmlToElement name_
        , selectable = False
        }


{-| Creates an `ElementToHtml` function that will encode a node to the tag specified. Any
string attributes are converted to attributes on the node

    defaultElementToHtml "p"
    --> returns a function which encodes to "<p>...</p>"

-}
defaultElementToHtml : String -> ElementToHtml
defaultElementToHtml tagName elementParameters children =
    RichText.Model.HtmlNode.ElementNode tagName
        (List.filterMap
            (\attr ->
                case attr of
                    RichText.Model.Attribute.StringAttribute k v ->
                        Just ( k, v )

                    _ ->
                        Nothing
            )
            (RichText.Internal.Definitions.attributesFromElement elementParameters)
        )
        children


{-| Creates an `HtmlToElement` function that will decode a node from tag specified.

    defaultHtmlToElement "p"
    --> returns a function which decodes from "<p>...</p>"

-}
defaultHtmlToElement : String -> HtmlToElement
defaultHtmlToElement htmlTag def node =
    case node of
        RichText.Model.HtmlNode.ElementNode name_ _ children ->
            if name_ == htmlTag then
                Just ( RichText.Internal.Definitions.element def [], children )

            else
                Nothing

        _ ->
            Nothing
