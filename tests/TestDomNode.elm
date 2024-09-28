module TestDomNode exposing (testFindTextChanges)

import Array
import Expect
import RichText.Internal.DomNode
import RichText.Model.HtmlNode
import Test exposing (Test)


pHtmlNode =
    RichText.Model.HtmlNode.ElementNode "p" [] <| Array.fromList [ RichText.Model.HtmlNode.TextNode "sample" ]


pHtmlNodeDifferentText =
    RichText.Model.HtmlNode.ElementNode "p" [] <| Array.fromList [ RichText.Model.HtmlNode.TextNode "sample2" ]


pWithImgHtmlNode =
    RichText.Model.HtmlNode.ElementNode "p" [] <| Array.fromList [ RichText.Model.HtmlNode.ElementNode "img" [] Array.empty, RichText.Model.HtmlNode.TextNode "sample" ]


divHtmlNode =
    RichText.Model.HtmlNode.ElementNode "div" [] <| Array.fromList [ RichText.Model.HtmlNode.TextNode "sample" ]


pWithImgDomNode =
    RichText.Internal.DomNode.DomNode
        { nodeValue = Nothing
        , nodeType = RichText.Internal.DomNode.domElementNodeType
        , childNodes =
            Just <|
                Array.fromList
                    [ RichText.Internal.DomNode.DomNode { nodeValue = Nothing, nodeType = RichText.Internal.DomNode.domElementNodeType, childNodes = Just Array.empty, tagName = Just "IMG" }
                    , RichText.Internal.DomNode.DomNode { nodeValue = Just "sample", nodeType = RichText.Internal.DomNode.domTextNodeType, childNodes = Nothing, tagName = Nothing }
                    ]
        , tagName = Just "P"
        }


pDomNode =
    RichText.Internal.DomNode.DomNode
        { nodeValue = Nothing
        , nodeType = RichText.Internal.DomNode.domElementNodeType
        , childNodes =
            Just <|
                Array.fromList
                    [ RichText.Internal.DomNode.DomNode { nodeValue = Just "sample", nodeType = RichText.Internal.DomNode.domTextNodeType, childNodes = Nothing, tagName = Nothing }
                    ]
        , tagName = Just "P"
        }


testFindTextChanges : Test
testFindTextChanges =
    Test.describe "Tests the function which finds any text changes between the HtmlNode representation and the actual DOM representation"
        [ Test.test "Test the same structure returns the no text change" <|
            \_ ->
                Expect.equal (Ok []) (RichText.Internal.DomNode.findTextChanges pHtmlNode pDomNode)
        , Test.test "Different type of node results in Error" <|
            \_ ->
                Expect.equal (Err "Dom node's tag was P, but I was expecting div") (RichText.Internal.DomNode.findTextChanges divHtmlNode pDomNode)
        , Test.test "Extra html node results in Error" <|
            \_ ->
                Expect.equal (Err "Dom node's children length was 1, but I was expecting 2") (RichText.Internal.DomNode.findTextChanges pWithImgHtmlNode pDomNode)
        , Test.test "Extra dom node results in Error" <|
            \_ ->
                Expect.equal (Err "Dom node's children length was 2, but I was expecting 1") (RichText.Internal.DomNode.findTextChanges pHtmlNode pWithImgDomNode)
        , Test.test "Finds text changes" <|
            \_ ->
                Expect.equal (Ok [ ( [ 0 ], "sample" ) ]) (RichText.Internal.DomNode.findTextChanges pHtmlNodeDifferentText pDomNode)
        ]
