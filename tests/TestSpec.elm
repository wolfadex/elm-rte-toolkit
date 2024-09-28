module TestSpec exposing (testHtmlToElementArray)

import Array
import Expect
import RichText.Definitions
import RichText.Internal.Spec
import RichText.Model.Element
import RichText.Model.Mark
import RichText.Model.Node
import RichText.Model.Text
import RichText.Node
import Test exposing (Test)


oneParagraph =
    "<p>test</p>"


expectedOneParagraph =
    Array.fromList <|
        [ RichText.Node.BlockFragment <|
            Array.fromList
                [ RichText.Model.Node.block
                    (RichText.Model.Element.element RichText.Definitions.paragraph [])
                    (RichText.Model.Node.inlineChildren
                        (Array.fromList
                            [ RichText.Model.Node.plainText "test"
                            ]
                        )
                    )
                ]
        ]


twoParagraphs =
    "<p>test1</p><p>test2</p>"


twoParagraphsBlockFragment =
    Array.fromList
        [ RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.paragraph [])
            (RichText.Model.Node.inlineChildren
                (Array.fromList
                    [ RichText.Model.Node.plainText "test1"
                    ]
                )
            )
        , RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.paragraph [])
            (RichText.Model.Node.inlineChildren
                (Array.fromList
                    [ RichText.Model.Node.plainText "test2"
                    ]
                )
            )
        ]


expectedTwoParagraphs =
    Array.fromList <|
        [ RichText.Node.BlockFragment <| twoParagraphsBlockFragment ]


justText =
    "test"


justTextInlineFragment =
    Array.fromList
        [ RichText.Model.Node.plainText "test"
        ]


expectedJustText =
    Array.fromList
        [ RichText.Node.InlineFragment <| justTextInlineFragment ]


blockquoteAndParagraphs =
    "<blockquote><p>test1</p><p>test2</p></blockquote>"


expectedBlockquoteAndParagraphs =
    Array.fromList
        [ RichText.Node.BlockFragment <|
            Array.fromList
                [ RichText.Model.Node.block
                    (RichText.Model.Element.element RichText.Definitions.blockquote [])
                    (RichText.Model.Node.blockChildren twoParagraphsBlockFragment)
                ]
        ]


oneParagraphWithBold =
    "<p><b>test</b></p>"


boldMark =
    RichText.Model.Mark.mark RichText.Definitions.bold []


italicMark =
    RichText.Model.Mark.mark RichText.Definitions.italic []


expectedOneParagraphWithBold =
    Array.fromList <|
        [ RichText.Node.BlockFragment <|
            Array.fromList
                [ RichText.Model.Node.block
                    (RichText.Model.Element.element RichText.Definitions.paragraph [])
                    (RichText.Model.Node.inlineChildren
                        (Array.fromList
                            [ RichText.Model.Node.Text (RichText.Model.Text.empty |> RichText.Model.Text.withText "test" |> RichText.Model.Text.withMarks [ boldMark ])
                            ]
                        )
                    )
                ]
        ]


oneParagraphWithBoldAndItalic =
    "<p><b>tes<i>t</i></b><i>1</i></p>"


expectedOneParagraphWithBoldAndItalic =
    Array.fromList <|
        [ RichText.Node.BlockFragment <|
            Array.fromList
                [ RichText.Model.Node.block
                    (RichText.Model.Element.element RichText.Definitions.paragraph [])
                    (RichText.Model.Node.inlineChildren
                        (Array.fromList
                            [ RichText.Model.Node.Text (RichText.Model.Text.empty |> RichText.Model.Text.withText "tes" |> RichText.Model.Text.withMarks [ boldMark ])
                            , RichText.Model.Node.Text (RichText.Model.Text.empty |> RichText.Model.Text.withText "t" |> RichText.Model.Text.withMarks [ boldMark, italicMark ])
                            , RichText.Model.Node.Text (RichText.Model.Text.empty |> RichText.Model.Text.withText "1" |> RichText.Model.Text.withMarks [ italicMark ])
                            ]
                        )
                    )
                ]
        ]


testHtmlToElementArray : Test
testHtmlToElementArray =
    Test.describe "Tests that htmlToElementArray works as expected"
        [ Test.test "Tests that a basic paragraph can be parsed" <|
            \_ -> Expect.equal (Ok expectedOneParagraph) (RichText.Internal.Spec.htmlToElementArray RichText.Definitions.markdown oneParagraph)
        , Test.test "Tests that multiple paragraphs can be parsed" <|
            \_ -> Expect.equal (Ok expectedTwoParagraphs) (RichText.Internal.Spec.htmlToElementArray RichText.Definitions.markdown twoParagraphs)
        , Test.test "Tests that simple text content can be parsed" <|
            \_ -> Expect.equal (Ok expectedJustText) (RichText.Internal.Spec.htmlToElementArray RichText.Definitions.markdown justText)
        , Test.test "Tests that paragraphs wrapped in a code block can be parsed" <|
            \_ -> Expect.equal (Ok expectedBlockquoteAndParagraphs) (RichText.Internal.Spec.htmlToElementArray RichText.Definitions.markdown blockquoteAndParagraphs)
        , Test.test "Tests that a paragraph with bold text works as expected" <|
            \_ -> Expect.equal (Ok expectedOneParagraphWithBold) (RichText.Internal.Spec.htmlToElementArray RichText.Definitions.markdown oneParagraphWithBold)
        , Test.test "Tests that a paragraph with bold and italic text works as expected" <|
            \_ -> Expect.equal (Ok expectedOneParagraphWithBoldAndItalic) (RichText.Internal.Spec.htmlToElementArray RichText.Definitions.markdown oneParagraphWithBoldAndItalic)
        ]
