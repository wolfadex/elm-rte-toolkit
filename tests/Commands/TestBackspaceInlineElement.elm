module Commands.TestBackspaceInlineElement exposing (testBackspaceInlineElement)

import Array
import Expect
import RichText.Commands
import RichText.Definitions
import RichText.Model.Element
import RichText.Model.Node
import RichText.Model.Selection
import RichText.Model.State
import Test exposing (Test)


example : RichText.Model.State.State
example =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList
                                [ RichText.Model.Node.plainText "text"
                                , RichText.Model.Node.inlineElement (RichText.Model.Element.element RichText.Definitions.image []) []
                                , RichText.Model.Node.plainText "text2"
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 2 ] 0)


expectedExample : RichText.Model.State.State
expectedExample =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList
                                [ RichText.Model.Node.plainText "text"
                                , RichText.Model.Node.plainText "text2"
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 1 ] 0)


testBackspaceInlineElement : Test
testBackspaceInlineElement =
    Test.describe "Tests the backspaceInlineElement transform"
        [ Test.test "Tests that the example case works as expected" <|
            \_ -> Expect.equal (Ok expectedExample) (RichText.Commands.backspaceInlineElement example)
        , Test.test "Tests that we can only backspace an inline element when the offset is 0" <|
            \_ ->
                Expect.equal (Err "I can only backspace an inline element if the offset is 0")
                    (RichText.Commands.backspaceInlineElement (example |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.caret [ 0, 2 ] 1)))
        ]
