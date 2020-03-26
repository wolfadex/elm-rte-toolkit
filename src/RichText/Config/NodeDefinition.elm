module RichText.Config.NodeDefinition exposing
    ( NodeDefinition, nodeDefinition, ElementToHtml, HtmlToElement, name, group, contentType, fromHtmlNode, toHtmlNode
    , ContentType, blockLeaf, inlineLeaf, blockNode, textBlock
    , defaultNodeDefinition, defaultElementToHtml, defaultHtmlToElement
    )

{-| A NodeDefinition describes how to serialize/deserialize an editor node, as well as the children a
node can have.


# Node definition

@docs NodeDefinition, nodeDefinition, ElementToHtml, HtmlToElement, name, group, contentType, fromHtmlNode, toHtmlNode


# Content type

@docs ContentType, blockLeaf, inlineLeaf, blockNode, textBlock


# Struts

@docs defaultNodeDefinition, defaultElementToHtml, defaultHtmlToElement

-}

import Array exposing (Array)
import RichText.Internal.Definitions as Internal exposing (ContentType(..))
import RichText.Model.Attribute exposing (Attribute(..))
import RichText.Model.Element exposing (Element)
import RichText.Model.HtmlNode exposing (HtmlNode(..))
import Set


{-| Describes what type of node this is, as well as what children a node can contain. It can be one
of four values:

  - `inlineLeaf`: An inline element, like an inline image or hard break.
  - `blockLeaf`: A block which does not allow children, like a horizontal rule.
  - `blockNode`: A block with block children, like a blockquote, list, or table.
  - `textBlock`: A block with inline children, like a paragraph or heading.

-}
type alias ContentType =
    Internal.ContentType


{-| A `NodeDefinition` contains information on how to serialize/deserialize an editor node,
as well as describes what type of node and what children the node can have.
-}
type alias NodeDefinition =
    Internal.NodeDefinition


{-| Type alias for defining an element serialization function `Element` -> `Array HtmlNode` -> `HtmlNode`

    paragraphToHtml : ElementToHtml
    paragraphToHtml _ children =
        ElementNode "p" [] children

Note that when defining serialization functions, children should NOT be modified in any way, otherwise
it will potentially break the selection and rendering logic. This is because we pass in a placeholder
to partially serialize a document in some parts of the package.

-}
type alias ElementToHtml =
    Element -> Array HtmlNode -> HtmlNode


{-| Type alias for defining an element deserialization function: `NodeDefinition` -> `HtmlNode` -> `Maybe ( Element, Array HtmlNode )`

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
    NodeDefinition -> HtmlNode -> Maybe ( Element, Array HtmlNode )


{-| Defines a node. The arguments are as follows:

  - `name` is the unique name of this type of node, usually something like "paragraph" or "heading"

  - `group` is the group this node belongs to. Commonly, this value will be 'block' or 'inline'
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
-- Define a paragraph node
paragraph =
    nodeDefinition
        { name = "paragraph"
        , group = "block"
        , contentType = textBlock [ "inline" ]
        , toHtmlNode = paragraphToHtml
        , fromHtmlNode = htmlToParagraph
        }
```

-}
nodeDefinition :
    { name : String
    , group : String
    , contentType : ContentType
    , toHtmlNode : ElementToHtml
    , fromHtmlNode : HtmlToElement
    }
    -> NodeDefinition
nodeDefinition contents =
    Internal.NodeDefinition
        contents


{-| The name of the node this node definition defines.

    name paragraph
    --> "paragraph"

-}
name : NodeDefinition -> String
name definition_ =
    case definition_ of
        Internal.NodeDefinition c ->
            c.name


{-| The group this node belongs to

    group paragraph
    --> "inline"

-}
group : NodeDefinition -> String
group definition_ =
    case definition_ of
        Internal.NodeDefinition c ->
            c.group


{-| The serialization function for this node. This should be called internally by the editor code
to determine selection, render the editor, and validate the DOM.
-}
toHtmlNode : NodeDefinition -> ElementToHtml
toHtmlNode definition_ =
    case definition_ of
        Internal.NodeDefinition c ->
            c.toHtmlNode


{-| The deserialization function for this node. This is used for things like a paste event to
derive editor nodes from HTML content.
-}
fromHtmlNode : NodeDefinition -> HtmlToElement
fromHtmlNode definition_ =
    case definition_ of
        Internal.NodeDefinition c ->
            c.fromHtmlNode


{-| Describes what type of node this is and what children it can have.
-}
contentType : NodeDefinition -> ContentType
contentType definition_ =
    case definition_ of
        Internal.NodeDefinition c ->
            c.contentType


{-| An inline leaf is an InlineElement like an image or a breaking line.
-}
inlineLeaf : ContentType
inlineLeaf =
    InlineLeafNodeType


{-| A block leaf is a Block that does not allow child nodes, like a horizontal rule.
-}
blockLeaf : ContentType
blockLeaf =
    BlockLeafNodeType


{-| A block node is a Block that has other block children, like a blockquote or list. The
argument is the group or name of the nodes that it allows as children.

    blockNode [ "list_item" ]
    --> A content type for a node that only accepts child nodes who are blocks and whose is name or group is list_items.

-}
blockNode : List String -> ContentType
blockNode allowedGroups =
    BlockNodeType <|
        if List.isEmpty allowedGroups then
            Nothing

        else
            Just <| Set.fromList allowedGroups


{-| A text block node is a Block that has inline children, like a header or paragraph. The
argument is the group or name of the nodes that it allows as children.

    textBlock [ "inline" ]
    --> A content type for a node that only accepts child nodes who are in the "inline" group

-}
textBlock : List String -> ContentType
textBlock allowedGroups =
    TextBlockNodeType <|
        if List.isEmpty allowedGroups then
            Nothing

        else
            Just <| Set.fromList allowedGroups


{-| Creates a node definition which assumes the name of the editor node is the same as the name of the
html node.

    defaultNodeDefinition "p" "block" (textBlock [])
    --> definition which encodes to <p>...</p> and decodes from "<p>...</p>"

-}
defaultNodeDefinition : String -> String -> ContentType -> NodeDefinition
defaultNodeDefinition name_ group_ contentType_ =
    nodeDefinition
        { name = name_
        , group = group_
        , contentType = contentType_
        , toHtmlNode = defaultElementToHtml name_
        , fromHtmlNode = defaultHtmlToElement name_
        }


{-| Creates an `ElementToHtml` function that will encode a node to the tag specified. Any
string attributes are converted to attributes on the node

    defaultElementToHtml "p"
    --> returns a function which encodes to "<p>...</p>"

-}
defaultElementToHtml : String -> ElementToHtml
defaultElementToHtml tagName elementParameters children =
    ElementNode tagName
        (List.filterMap
            (\attr ->
                case attr of
                    StringAttribute k v ->
                        Just ( k, v )

                    _ ->
                        Nothing
            )
            (Internal.attributesFromElement elementParameters)
        )
        children


{-| Creates an `HtmlToElement` function that will decode a node from tag specified.

    defaultHtmlToElement "p"
    --> returns a function which decodes from "<p>...</p>"

-}
defaultHtmlToElement : String -> HtmlToElement
defaultHtmlToElement htmlTag def node =
    case node of
        ElementNode name_ _ children ->
            if name_ == htmlTag then
                Just ( Internal.element def [], children )

            else
                Nothing

        _ ->
            Nothing
