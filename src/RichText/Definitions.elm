module RichText.Definitions exposing
    ( markdown
    , doc, blockquote, codeBlock, hardBreak, heading, horizontalRule, image, paragraph
    , listItem, orderedList, unorderedList
    , bold, code, italic, link
    )

{-|


# Markdown spec

@docs markdown


# Definitions

The definitions used in the markdown specification.


## Elements

@docs doc, blockquote, codeBlock, hardBreak, heading, horizontalRule, image, paragraph

@docs listItem, orderedList, unorderedList


## Marks

@docs bold, code, italic, link

-}

import Array
import RichText.Annotation
import RichText.Config.ElementDefinition
import RichText.Config.MarkDefinition
import RichText.Config.Spec
import RichText.Model.Attribute
import RichText.Model.Element
import RichText.Model.HtmlNode
import RichText.Model.Mark
import Set


{-| The root element of a document.
-}
doc : RichText.Config.ElementDefinition.ElementDefinition
doc =
    RichText.Config.ElementDefinition.elementDefinition
        { name = "doc"
        , group = "root"
        , contentType = RichText.Config.ElementDefinition.blockNode [ "block" ]
        , toHtmlNode = docToHtml
        , fromHtmlNode = htmlToDoc
        , selectable = False
        }


docToHtml : RichText.Config.ElementDefinition.ElementToHtml
docToHtml _ children =
    RichText.Model.HtmlNode.ElementNode "div"
        [ ( "data-rte-doc", "true" ) ]
        children


htmlToDoc : RichText.Config.ElementDefinition.HtmlToElement
htmlToDoc definition node =
    case node of
        RichText.Model.HtmlNode.ElementNode name attrs children ->
            if name == "div" && attrs == [ ( "data-rte-doc", "true" ) ] then
                Just <| ( RichText.Model.Element.element definition [], children )

            else
                Nothing

        _ ->
            Nothing


{-| A paragraph element. It can have inline children.
-}
paragraph : RichText.Config.ElementDefinition.ElementDefinition
paragraph =
    RichText.Config.ElementDefinition.elementDefinition
        { name = "paragraph"
        , group = "block"
        , contentType = RichText.Config.ElementDefinition.textBlock { allowedGroups = [ "inline" ], allowedMarks = [] }
        , toHtmlNode = paragraphToHtml
        , fromHtmlNode = htmlToParagraph
        , selectable = False
        }


paragraphToHtml : RichText.Config.ElementDefinition.ElementToHtml
paragraphToHtml _ children =
    RichText.Model.HtmlNode.ElementNode "p" [] children


htmlToParagraph : RichText.Config.ElementDefinition.HtmlToElement
htmlToParagraph definition node =
    case node of
        RichText.Model.HtmlNode.ElementNode name _ children ->
            if name == "p" then
                Just <| ( RichText.Model.Element.element definition [], children )

            else
                Nothing

        _ ->
            Nothing


{-| A blockquote element. It can have block children.
-}
blockquote : RichText.Config.ElementDefinition.ElementDefinition
blockquote =
    RichText.Config.ElementDefinition.elementDefinition
        { name = "blockquote"
        , group = "block"
        , contentType = RichText.Config.ElementDefinition.blockNode [ "block" ]
        , toHtmlNode = blockquoteToHtml
        , fromHtmlNode = htmlToBlockquote
        , selectable = False
        }


blockquoteToHtml : RichText.Config.ElementDefinition.ElementToHtml
blockquoteToHtml =
    RichText.Config.ElementDefinition.defaultElementToHtml "blockquote"


htmlToBlockquote : RichText.Config.ElementDefinition.HtmlToElement
htmlToBlockquote =
    RichText.Config.ElementDefinition.defaultHtmlToElement "blockquote"


{-| A horizontal rule element. It is a block leaf, e.g. it can have no children.
-}
horizontalRule : RichText.Config.ElementDefinition.ElementDefinition
horizontalRule =
    RichText.Config.ElementDefinition.elementDefinition
        { name = "horizontal_rule"
        , group = "block"
        , contentType = RichText.Config.ElementDefinition.blockLeaf
        , toHtmlNode = horizontalRuleToHtml
        , fromHtmlNode = htmlToHorizontalRule
        , selectable = True
        }


horizontalRuleToHtml : RichText.Config.ElementDefinition.ElementToHtml
horizontalRuleToHtml =
    RichText.Config.ElementDefinition.defaultElementToHtml "hr"


htmlToHorizontalRule : RichText.Config.ElementDefinition.HtmlToElement
htmlToHorizontalRule def node =
    case node of
        RichText.Model.HtmlNode.ElementNode name _ _ ->
            if name == "hr" then
                Just ( RichText.Model.Element.element def [] |> RichText.Model.Element.withAnnotations (Set.singleton RichText.Annotation.selectable), Array.empty )

            else
                Nothing

        _ ->
            Nothing


{-| A heading element. It can have inline children. It supports one integer attribute `level`,
which defaults to 1 if not set.
-}
heading : RichText.Config.ElementDefinition.ElementDefinition
heading =
    RichText.Config.ElementDefinition.elementDefinition
        { name = "heading"
        , group = "block"
        , contentType = RichText.Config.ElementDefinition.textBlock { allowedGroups = [ "inline" ], allowedMarks = [] }
        , toHtmlNode = headingToHtml
        , fromHtmlNode = htmlToHeading
        , selectable = False
        }


headingToHtml : RichText.Config.ElementDefinition.ElementToHtml
headingToHtml parameters children =
    let
        level =
            Maybe.withDefault 1 <| RichText.Model.Attribute.findIntegerAttribute "level" (RichText.Model.Element.attributes parameters)
    in
    RichText.Model.HtmlNode.ElementNode ("h" ++ String.fromInt level) [] children


htmlToHeading : RichText.Config.ElementDefinition.HtmlToElement
htmlToHeading def node =
    case node of
        RichText.Model.HtmlNode.ElementNode name _ children ->
            let
                maybeLevel =
                    case name of
                        "h1" ->
                            Just 1

                        "h2" ->
                            Just 2

                        "h3" ->
                            Just 3

                        "h4" ->
                            Just 4

                        "h5" ->
                            Just 5

                        "h6" ->
                            Just 6

                        _ ->
                            Nothing
            in
            case maybeLevel of
                Nothing ->
                    Nothing

                Just level ->
                    Just <|
                        ( RichText.Model.Element.element def
                            [ RichText.Model.Attribute.IntegerAttribute "level" level ]
                        , children
                        )

        _ ->
            Nothing


{-| A code block element.
-}
codeBlock : RichText.Config.ElementDefinition.ElementDefinition
codeBlock =
    RichText.Config.ElementDefinition.elementDefinition
        { name = "code_block"
        , group = "block"
        , contentType = RichText.Config.ElementDefinition.textBlock { allowedGroups = [ "text" ], allowedMarks = [ "__nothing__" ] }
        , toHtmlNode = codeBlockToHtmlNode
        , fromHtmlNode = htmlNodeToCodeBlock
        , selectable = False
        }


codeBlockToHtmlNode : RichText.Config.ElementDefinition.ElementToHtml
codeBlockToHtmlNode _ children =
    RichText.Model.HtmlNode.ElementNode "pre"
        []
        (Array.fromList [ RichText.Model.HtmlNode.ElementNode "code" [] children ])


htmlNodeToCodeBlock : RichText.Config.ElementDefinition.HtmlToElement
htmlNodeToCodeBlock def node =
    case node of
        RichText.Model.HtmlNode.ElementNode name _ children ->
            if name == "pre" && Array.length children == 1 then
                case Array.get 0 children of
                    Nothing ->
                        Nothing

                    Just n ->
                        case n of
                            RichText.Model.HtmlNode.ElementNode _ _ childChildren ->
                                Just ( RichText.Model.Element.element def [], childChildren )

                            _ ->
                                Nothing

            else
                Nothing

        _ ->
            Nothing


{-| An inline image. It can have three different string attributes:

  - `src` is the uri of the image to show
  - `alt` is the alt text of the image
  - `title` is the title of the image

-}
image : RichText.Config.ElementDefinition.ElementDefinition
image =
    RichText.Config.ElementDefinition.elementDefinition
        { name = "image"
        , group = "inline"
        , contentType = RichText.Config.ElementDefinition.inlineLeaf
        , toHtmlNode = imageToHtmlNode
        , fromHtmlNode = htmlNodeToImage
        , selectable = True
        }


imageToHtmlNode : RichText.Config.ElementDefinition.ElementToHtml
imageToHtmlNode parameters _ =
    let
        attr =
            filterAttributesToHtml
                [ ( "src", Just <| Maybe.withDefault "" (RichText.Model.Attribute.findStringAttribute "src" (RichText.Model.Element.attributes parameters)) )
                , ( "alt", RichText.Model.Attribute.findStringAttribute "alt" (RichText.Model.Element.attributes parameters) )
                , ( "title", RichText.Model.Attribute.findStringAttribute "title" (RichText.Model.Element.attributes parameters) )
                ]
    in
    RichText.Model.HtmlNode.ElementNode "img"
        attr
        Array.empty


htmlNodeToImage : RichText.Config.ElementDefinition.HtmlToElement
htmlNodeToImage def node =
    case node of
        RichText.Model.HtmlNode.ElementNode name attributes _ ->
            if name == "img" then
                let
                    elementNodeAttributes =
                        List.filterMap
                            (\( k, v ) ->
                                case k of
                                    "src" ->
                                        Just <| RichText.Model.Attribute.StringAttribute "src" v

                                    "alt" ->
                                        Just <| RichText.Model.Attribute.StringAttribute "alt" v

                                    "title" ->
                                        Just <| RichText.Model.Attribute.StringAttribute "title" v

                                    _ ->
                                        Nothing
                            )
                            attributes
                in
                if RichText.Model.Attribute.findStringAttribute "src" elementNodeAttributes /= Nothing then
                    Just
                        ( RichText.Model.Element.element
                            def
                            elementNodeAttributes
                            |> RichText.Model.Element.withAnnotations (Set.singleton RichText.Annotation.selectable)
                        , Array.empty
                        )

                else
                    Nothing

            else
                Nothing

        _ ->
            Nothing


{-| Hard break is an inline leaf which represents a line break in a document.
-}
hardBreak : RichText.Config.ElementDefinition.ElementDefinition
hardBreak =
    RichText.Config.ElementDefinition.elementDefinition
        { name = "hard_break"
        , group = "inline"
        , contentType = RichText.Config.ElementDefinition.inlineLeaf
        , toHtmlNode = hardBreakToHtml
        , fromHtmlNode = htmlToHardBreak
        , selectable = False
        }


hardBreakToHtml : RichText.Config.ElementDefinition.ElementToHtml
hardBreakToHtml =
    RichText.Config.ElementDefinition.defaultElementToHtml "br"


htmlToHardBreak : RichText.Config.ElementDefinition.HtmlToElement
htmlToHardBreak =
    RichText.Config.ElementDefinition.defaultHtmlToElement "br"


filterAttributesToHtml : List ( String, Maybe String ) -> List ( String, String )
filterAttributesToHtml attrs =
    List.filterMap
        (\( p, v ) ->
            case v of
                Nothing ->
                    Nothing

                Just tv ->
                    Just ( p, tv )
        )
        attrs



--- List element definitions


{-| An ordered list element definition. It can have list item children.
-}
orderedList : RichText.Config.ElementDefinition.ElementDefinition
orderedList =
    RichText.Config.ElementDefinition.elementDefinition
        { name = "ordered_list"
        , group = "block"
        , contentType = RichText.Config.ElementDefinition.blockNode [ "list_item" ]
        , toHtmlNode = orderedListToHtml
        , fromHtmlNode = htmlToOrderedList
        , selectable = False
        }


orderedListToHtml : RichText.Config.ElementDefinition.ElementToHtml
orderedListToHtml _ children =
    RichText.Model.HtmlNode.ElementNode "ol" [] children


htmlToOrderedList : RichText.Config.ElementDefinition.HtmlToElement
htmlToOrderedList =
    RichText.Config.ElementDefinition.defaultHtmlToElement "ol"


{-| An unordered list element definition. It can have list item children.
-}
unorderedList : RichText.Config.ElementDefinition.ElementDefinition
unorderedList =
    RichText.Config.ElementDefinition.elementDefinition
        { name = "unordered_list"
        , group = "block"
        , contentType = RichText.Config.ElementDefinition.blockNode [ "list_item" ]
        , toHtmlNode = unorderedListToHtml
        , fromHtmlNode = htmlToUnorderedList
        , selectable = False
        }


unorderedListToHtml : RichText.Config.ElementDefinition.ElementToHtml
unorderedListToHtml _ children =
    RichText.Model.HtmlNode.ElementNode "ul" [] children


htmlToUnorderedList : RichText.Config.ElementDefinition.HtmlToElement
htmlToUnorderedList =
    RichText.Config.ElementDefinition.defaultHtmlToElement "ul"


{-| A list item element definition. It can have block children.
-}
listItem : RichText.Config.ElementDefinition.ElementDefinition
listItem =
    RichText.Config.ElementDefinition.elementDefinition
        { name = "list_item"
        , group = "list_item"
        , contentType = RichText.Config.ElementDefinition.blockNode [ "block" ]
        , toHtmlNode = listItemToHtml
        , fromHtmlNode = htmlToListItem
        , selectable = False
        }


listItemToHtml : RichText.Config.ElementDefinition.ElementToHtml
listItemToHtml _ children =
    RichText.Model.HtmlNode.ElementNode "li" [] children


htmlToListItem : RichText.Config.ElementDefinition.HtmlToElement
htmlToListItem =
    RichText.Config.ElementDefinition.defaultHtmlToElement "li"



-- Mark definitions


{-| A link mark definition. It can have two different string attributes:

  - `href` is the url to link to
  - `title` is the title of the link

-}
link : RichText.Config.MarkDefinition.MarkDefinition
link =
    RichText.Config.MarkDefinition.markDefinition { name = "link", toHtmlNode = linkToHtmlNode, fromHtmlNode = htmlNodeToLink }


linkToHtmlNode : RichText.Config.MarkDefinition.MarkToHtml
linkToHtmlNode mark children =
    let
        attributes =
            filterAttributesToHtml
                [ ( "href", Just <| Maybe.withDefault "" (RichText.Model.Attribute.findStringAttribute "href" (Mark.attributes mark)) )
                , ( "title", RichText.Model.Attribute.findStringAttribute "title" (Mark.attributes mark) )
                ]
    in
    RichText.Model.HtmlNode.ElementNode "a"
        attributes
        children


htmlNodeToLink : RichText.Config.MarkDefinition.HtmlToMark
htmlNodeToLink def node =
    case node of
        RichText.Model.HtmlNode.ElementNode name attributes children ->
            if name == "a" then
                let
                    elementNodeAttributes =
                        List.filterMap
                            (\( k, v ) ->
                                case k of
                                    "href" ->
                                        Just <| RichText.Model.Attribute.StringAttribute "href" v

                                    "title" ->
                                        Just <| RichText.Model.Attribute.StringAttribute "title" v

                                    _ ->
                                        Nothing
                            )
                            attributes
                in
                if RichText.Model.Attribute.findStringAttribute "href" elementNodeAttributes /= Nothing then
                    Just
                        ( RichText.Model.Mark.mark
                            def
                            elementNodeAttributes
                        , children
                        )

                else
                    Nothing

            else
                Nothing

        _ ->
            Nothing


{-| A bold mark definition.
-}
bold : RichText.Config.MarkDefinition.MarkDefinition
bold =
    RichText.Config.MarkDefinition.markDefinition { name = "bold", toHtmlNode = boldToHtmlNode, fromHtmlNode = htmlNodeToBold }


boldToHtmlNode : RichText.Config.MarkDefinition.MarkToHtml
boldToHtmlNode _ children =
    RichText.Model.HtmlNode.ElementNode "b" [] children


htmlNodeToBold : RichText.Config.MarkDefinition.HtmlToMark
htmlNodeToBold =
    RichText.Config.MarkDefinition.defaultHtmlToMark "b"


{-| An italic mark definition.
-}
italic : RichText.Config.MarkDefinition.MarkDefinition
italic =
    RichText.Config.MarkDefinition.markDefinition
        { name = "italic"
        , toHtmlNode = italicToHtmlNode
        , fromHtmlNode = htmlNodeToItalic
        }


italicToHtmlNode : RichText.Config.MarkDefinition.MarkToHtml
italicToHtmlNode _ children =
    RichText.Model.HtmlNode.ElementNode "i" [] children


htmlNodeToItalic : RichText.Config.MarkDefinition.HtmlToMark
htmlNodeToItalic =
    RichText.Config.MarkDefinition.defaultHtmlToMark "i"


{-| A code mark definition.
-}
code : RichText.Config.MarkDefinition.MarkDefinition
code =
    RichText.Config.MarkDefinition.markDefinition { name = "code", toHtmlNode = codeToHtmlNode, fromHtmlNode = htmlNodeToCode }


codeToHtmlNode : RichText.Config.MarkDefinition.MarkToHtml
codeToHtmlNode _ children =
    RichText.Model.HtmlNode.ElementNode "code" [] children


htmlNodeToCode : RichText.Config.MarkDefinition.HtmlToMark
htmlNodeToCode =
    RichText.Config.MarkDefinition.defaultHtmlToMark "code"


{-| A spec which is compatible with the CommonMark flavor of markdown.
-}
markdown : RichText.Config.Spec.Spec
markdown =
    RichText.Config.Spec.emptySpec
        |> RichText.Config.Spec.withElementDefinitions
            [ doc
            , paragraph
            , blockquote
            , horizontalRule
            , heading
            , codeBlock
            , image
            , hardBreak
            , unorderedList
            , orderedList
            , listItem
            ]
        |> RichText.Config.Spec.withMarkDefinitions
            [ link
            , bold
            , italic
            , code
            ]
