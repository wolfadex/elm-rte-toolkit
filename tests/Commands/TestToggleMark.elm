module Commands.TestToggleMark exposing (testToggleMark)

import Array
import Expect
import RichText.Commands
import RichText.Definitions
import RichText.Model.Element
import RichText.Model.Mark
import RichText.Model.Node
import RichText.Model.Selection
import RichText.Model.State
import Test exposing (Test)


boldMark : RichText.Model.Mark.Mark
boldMark =
    RichText.Model.Mark.mark RichText.Definitions.bold []


markdownMarkOrder : RichText.Model.Mark.MarkOrder
markdownMarkOrder =
    RichText.Model.Mark.markOrderFromSpec RichText.Definitions.markdown


example : RichText.Model.State.State
example =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "text" ])
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 0)


expectedExample : RichText.Model.State.State
expectedExample =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.markedText "" [ boldMark ], RichText.Model.Node.plainText "text" ])
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 0)


testToggleMark : Test
testToggleMark =
    Test.describe "Tests the toggleBlock transform"
        [ Test.test "the example case works as expected" <|
            \_ ->
                Expect.equal (Ok expectedExample)
                    (RichText.Commands.toggleMark
                        markdownMarkOrder
                        boldMark
                        RichText.Model.Mark.Add
                        example
                    )
        ]
