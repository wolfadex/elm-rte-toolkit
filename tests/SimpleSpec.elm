module SimpleSpec exposing (bold, codeBlock, crazyBlock, italic, paragraph, simpleSpec, strikethrough)

import Array exposing (Array)
import RichText.Config.ElementDefinition
import RichText.Config.MarkDefinition
import RichText.Config.Spec
import RichText.Model.Element
import RichText.Model.HtmlNode
import RichText.Model.Mark


codeBlockToHtmlNode : RichText.Model.Element.Element -> Array RichText.Model.HtmlNode.HtmlNode -> RichText.Model.HtmlNode.HtmlNode
codeBlockToHtmlNode _ children =
    RichText.Model.HtmlNode.ElementNode "pre"
        []
        (Array.fromList [ RichText.Model.HtmlNode.ElementNode "code" [] children ])


crazyBlockToHtmlNode : RichText.Model.Element.Element -> Array RichText.Model.HtmlNode.HtmlNode -> RichText.Model.HtmlNode.HtmlNode
crazyBlockToHtmlNode _ children =
    RichText.Model.HtmlNode.ElementNode "div"
        []
    <|
        Array.fromList
            [ RichText.Model.HtmlNode.ElementNode "img" [] Array.empty
            , RichText.Model.HtmlNode.ElementNode "div" [] (Array.fromList [ RichText.Model.HtmlNode.ElementNode "hr" [] Array.empty ])
            , RichText.Model.HtmlNode.ElementNode "div" [] children
            ]


htmlNodeToCrazyBlock : RichText.Config.ElementDefinition.ElementDefinition -> RichText.Model.HtmlNode.HtmlNode -> Maybe ( RichText.Model.Element.Element, Array RichText.Model.HtmlNode.HtmlNode )
htmlNodeToCrazyBlock def node =
    case node of
        RichText.Model.HtmlNode.ElementNode name _ children ->
            if name == "div" && Array.length children /= 3 then
                Nothing

            else
                case Array.get 2 children of
                    Nothing ->
                        Nothing

                    Just n ->
                        case n of
                            RichText.Model.HtmlNode.ElementNode _ _ c ->
                                Just ( RichText.Model.Element.element def [], c )

                            _ ->
                                Nothing

        RichText.Model.HtmlNode.TextNode _ ->
            Nothing


htmlNodeToCodeBlock : RichText.Config.ElementDefinition.ElementDefinition -> RichText.Model.HtmlNode.HtmlNode -> Maybe ( RichText.Model.Element.Element, Array RichText.Model.HtmlNode.HtmlNode )
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


boldToHtmlNode : RichText.Model.Mark.Mark -> Array RichText.Model.HtmlNode.HtmlNode -> RichText.Model.HtmlNode.HtmlNode
boldToHtmlNode _ children =
    RichText.Model.HtmlNode.ElementNode "b" [] children


italicToHtmlNode : RichText.Model.Mark.Mark -> Array RichText.Model.HtmlNode.HtmlNode -> RichText.Model.HtmlNode.HtmlNode
italicToHtmlNode _ children =
    RichText.Model.HtmlNode.ElementNode "i" [] children


codeBlock =
    RichText.Config.ElementDefinition.elementDefinition
        { name = "code_block"
        , group = "block"
        , contentType = RichText.Config.ElementDefinition.blockNode []
        , toHtmlNode = codeBlockToHtmlNode
        , fromHtmlNode = htmlNodeToCodeBlock
        , selectable = False
        }


crazyBlock =
    RichText.Config.ElementDefinition.elementDefinition
        { name = "crazy_block"
        , group = "block"
        , contentType = RichText.Config.ElementDefinition.blockNode []
        , toHtmlNode = crazyBlockToHtmlNode
        , fromHtmlNode = htmlNodeToCrazyBlock
        , selectable = False
        }


paragraph =
    RichText.Config.ElementDefinition.elementDefinition
        { name = "paragraph"
        , group = "block"
        , contentType = RichText.Config.ElementDefinition.textBlock { allowedGroups = [ "inline" ], allowedMarks = [] }
        , toHtmlNode = RichText.Config.ElementDefinition.defaultElementToHtml "p"
        , fromHtmlNode = RichText.Config.ElementDefinition.defaultHtmlToElement "p"
        , selectable = False
        }


image =
    RichText.Config.ElementDefinition.elementDefinition
        { name = "image"
        , group = "inline"
        , contentType = RichText.Config.ElementDefinition.inlineLeaf
        , toHtmlNode = RichText.Config.ElementDefinition.defaultElementToHtml "img"
        , fromHtmlNode = RichText.Config.ElementDefinition.defaultHtmlToElement "img"
        , selectable = False
        }


bold =
    RichText.Config.MarkDefinition.markDefinition
        { name = "bold"
        , toHtmlNode = boldToHtmlNode
        , fromHtmlNode = RichText.Config.MarkDefinition.defaultHtmlToMark "b"
        }


italic =
    RichText.Config.MarkDefinition.markDefinition
        { name = "italic"
        , toHtmlNode = italicToHtmlNode
        , fromHtmlNode = RichText.Config.MarkDefinition.defaultHtmlToMark "i"
        }


strikethrough =
    RichText.Config.MarkDefinition.markDefinition
        { name = "strikethrough"
        , toHtmlNode = italicToHtmlNode
        , fromHtmlNode = RichText.Config.MarkDefinition.defaultHtmlToMark "s"
        }


simpleSpec : RichText.Config.Spec.Spec
simpleSpec =
    RichText.Config.Spec.emptySpec
        |> RichText.Config.Spec.withElementDefinitions
            [ codeBlock
            , crazyBlock
            , paragraph
            , image
            ]
        |> RichText.Config.Spec.withMarkDefinitions
            [ bold
            , italic
            ]
