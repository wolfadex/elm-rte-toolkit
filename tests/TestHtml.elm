module TestHtml exposing (testBlockFromHtml, testFromHtml, testToHtml, testToHtmlNode)

{-| TODO: add a lot more tests, this right now only covers the documentation example.
-}

import Array
import Expect
import RichText.Definitions
import RichText.Html
import RichText.Model.Attribute
import RichText.Model.Element
import RichText.Model.HtmlNode
import RichText.Model.Node
import RichText.Node
import Test exposing (Test)


exampleBlock : RichText.Model.Node.Block
exampleBlock =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.doc [])
        (RichText.Model.Node.blockChildren <|
            Array.fromList
                [ RichText.Model.Node.block
                    (RichText.Model.Element.element RichText.Definitions.paragraph [])
                    (RichText.Model.Node.inlineChildren <|
                        Array.fromList
                            [ RichText.Model.Node.plainText "text"
                            , RichText.Model.Node.inlineElement (RichText.Model.Element.element RichText.Definitions.image [ RichText.Model.Attribute.StringAttribute "src" "logo.svg" ]) []
                            , RichText.Model.Node.plainText "text2"
                            ]
                    )
                ]
        )


exampleFragment : RichText.Node.Fragment
exampleFragment =
    RichText.Node.BlockFragment <| Array.fromList [ exampleBlock ]


exampleHtml : String
exampleHtml =
    "<div data-rte-doc=\"true\"><p>text<img src=\"logo.svg\">text2</p></div>"


exampleHtmlNode : RichText.Model.HtmlNode.HtmlNode
exampleHtmlNode =
    RichText.Model.HtmlNode.ElementNode "div" [ ( "data-rte-doc", "true" ) ] <|
        Array.fromList
            [ RichText.Model.HtmlNode.ElementNode "p" [] <|
                Array.fromList
                    [ RichText.Model.HtmlNode.TextNode "text"
                    , RichText.Model.HtmlNode.ElementNode "img" [ ( "src", "logo.svg" ) ] Array.empty
                    , RichText.Model.HtmlNode.TextNode "text2"
                    ]
            ]


testToHtml : Test
testToHtml =
    Test.describe "Tests the toHtml function"
        [ Test.test "Make sure the example works as expected" <|
            \_ ->
                Expect.equal exampleHtml (RichText.Html.toHtml RichText.Definitions.markdown exampleBlock)
        ]


testToHtmlNode : Test
testToHtmlNode =
    Test.describe "Tests the toHtmlNode function"
        [ Test.test "Make sure the example works as expected" <|
            \_ ->
                Expect.equal exampleHtmlNode (RichText.Html.toHtmlNode RichText.Definitions.markdown exampleBlock)
        ]


testFromHtml : Test
testFromHtml =
    Test.describe "Tests the fromHtml function"
        [ Test.test "Make sure the example works as expected" <|
            \_ ->
                Expect.equal (Ok (Array.fromList [ exampleFragment ])) (RichText.Html.fromHtml RichText.Definitions.markdown exampleHtml)
        ]


testBlockFromHtml : Test
testBlockFromHtml =
    Test.describe "Tests the blockFromHtml function"
        [ Test.test "Make sure the example works as expected" <|
            \_ ->
                Expect.equal (Ok exampleBlock) (RichText.Html.blockFromHtml RichText.Definitions.markdown exampleHtml)
        ]
