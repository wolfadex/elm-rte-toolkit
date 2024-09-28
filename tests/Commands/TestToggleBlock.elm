module Commands.TestToggleBlock exposing (testToggleBlock)

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
                        (RichText.Model.Element.element RichText.Definitions.heading [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "text" ])
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 0)


testToggleBlock : Test
testToggleBlock =
    Test.describe "Tests the toggleBlock transform"
        [ Test.test "the example case works as expected" <|
            \_ ->
                Expect.equal (Ok expectedExample)
                    (RichText.Commands.toggleTextBlock
                        (RichText.Model.Element.element RichText.Definitions.heading [])
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        False
                        example
                    )
        , Test.test "the reverse case works as expected" <|
            \_ ->
                Expect.equal (Ok example)
                    (RichText.Commands.toggleTextBlock
                        (RichText.Model.Element.element RichText.Definitions.heading [])
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        False
                        expectedExample
                    )
        ]
