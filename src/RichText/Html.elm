module RichText.Html exposing (toHtml, toHtmlNode, fromHtml, blockFromHtml)

{-| This module contains convenience functions for encoding and decoding editor nodes to and from
html. Its intent is to help developers who want to import and export editor state
as html.

@docs toHtml, toHtmlNode, fromHtml, blockFromHtml

-}

import Array exposing (Array)
import Html.Parser
import RichText.Config.Spec
import RichText.Internal.HtmlNode
import RichText.Internal.Spec
import RichText.Model.HtmlNode
import RichText.Model.Node
import RichText.Node


{-| Converts a block to an HtmlNode.

    exampleBlock : Block
    exampleBlock =
        block
            (Element.element doc [])
            (blockChildren <|
                Array.fromList
                    [ block
                        (Element.element paragraph [])
                        (inlineChildren <|
                            Array.fromList
                                [ plainText "text"
                                , inlineElement (Element.element image [ StringAttribute "src" "logo.svg" ]) []
                                , plainText "text2"
                                ]
                        )
                    ]
            )

    exampleHtmlNode : HtmlNode
    exampleHtmlNode =
        ElementNode "div" [ ( "data-rte-doc", "true" ) ] <|
            Array.fromList
                [ ElementNode "p" [] <|
                    Array.fromList
                        [ TextNode "text"
                        , ElementNode "img" [ ( "src", "logo.svg" ) ] Array.empty
                        , TextNode "text2"
                        ]
                ]

    (toHtmlNode markdown exampleBlock) == exampleHtmlNode
    --> True

-}
toHtmlNode : RichText.Config.Spec.Spec -> RichText.Model.Node.Block -> RichText.Model.HtmlNode.HtmlNode
toHtmlNode =
    RichText.Internal.HtmlNode.editorBlockNodeToHtmlNode


htmlNodeToNode : RichText.Model.HtmlNode.HtmlNode -> Html.Parser.Node
htmlNodeToNode htmlNode =
    case htmlNode of
        RichText.Model.HtmlNode.ElementNode tag attrs children ->
            Html.Parser.Element tag attrs (List.map htmlNodeToNode (Array.toList children))

        RichText.Model.HtmlNode.TextNode t ->
            Html.Parser.Text t


{-| Converts a block to an html string.

    exampleBlock : Block
    exampleBlock =
        block
            (Element.element doc [])
            (blockChildren <|
                Array.fromList
                    [ block
                        (Element.element paragraph [])
                        (inlineChildren <|
                            Array.fromList
                                [ plainText "text"
                                , inlineElement (Element.element image [ StringAttribute "src" "logo.svg" ]) []
                                , plainText "text2"
                                ]
                        )
                    ]
            )

    exampleHtml : String
    exampleHtml =
        "<div data-rte-doc=\"true\"><p>text<img src=\"logo.svg\">text2</p></div>"

    (toHtml markdown exampleBlock) == exampleHtml
    --> True

-}
toHtml : RichText.Config.Spec.Spec -> RichText.Model.Node.Block -> String
toHtml spec block =
    Html.Parser.nodeToString <| htmlNodeToNode <| toHtmlNode spec block


{-| Decodes an html string to an array of editor fragments, or returns an error if there was an
issue decoding the html.

    exampleBlock : Block
    exampleBlock =
        block
            (Element.element doc [])
            (blockChildren <|
                Array.fromList
                    [ block
                        (Element.element paragraph [])
                        (inlineChildren <|
                            Array.fromList
                                [ plainText "text"
                                , inlineElement (Element.element image [ StringAttribute "src" "logo.svg" ]) []
                                , plainText "text2"
                                ]
                        )
                    ]
            )

    exampleFragment : Fragment
    exampleFragment =
        BlockFragment <| Array.fromList [ exampleBlock ]


    exampleHtml : String
    exampleHtml =
        "<div data-rte-doc=\"true\"><p>text<img src=\"logo.svg\">text2</p></div>"

    (Ok (Array.fromList [ exampleFragment ])) == (fromHtml markdown exampleHtml)
    --> True

-}
fromHtml : RichText.Config.Spec.Spec -> String -> Result String (Array RichText.Node.Fragment)
fromHtml =
    RichText.Internal.Spec.htmlToElementArray


{-| Convenience function that parses html and returns the first editor block that was decoded,
or an error if there was an issue decoding the html.

    exampleBlock : Block
    exampleBlock =
        block
            (Element.element doc [])
            (blockChildren <|
                Array.fromList
                    [ block
                        (Element.element paragraph [])
                        (inlineChildren <|
                            Array.fromList
                                [ plainText "text"
                                , inlineElement (Element.element image [ StringAttribute "src" "logo.svg" ]) []
                                , plainText "text2"
                                ]
                        )
                    ]
            )

    exampleHtml : String
    exampleHtml =
        "<div data-rte-doc=\"true\"><p>text<img src=\"logo.svg\">text2</p></div>"

    (Ok exampleBlock) (blockFromHtml markdown exampleHtml)
    --> True

-}
blockFromHtml : RichText.Config.Spec.Spec -> String -> Result String RichText.Model.Node.Block
blockFromHtml spec html =
    Result.andThen
        (\fragment ->
            case Array.get 0 fragment of
                Nothing ->
                    Err "There are no fragments to parse"

                Just f ->
                    case f of
                        RichText.Node.BlockFragment bf ->
                            case Array.get 0 bf of
                                Nothing ->
                                    Err "Invalid initial fragment"

                                Just block ->
                                    Ok block

                        _ ->
                            Err "I was expecting a block, but instead I received an inline"
        )
        (RichText.Internal.Spec.htmlToElementArray spec html)
