module Commands.TestLiftEmpty exposing (testLiftEmpty)

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
                        (RichText.Model.Element.element RichText.Definitions.blockquote [])
                        (RichText.Model.Node.blockChildren <|
                            Array.fromList
                                [ RichText.Model.Node.block (RichText.Model.Element.element RichText.Definitions.paragraph [])
                                    (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "" ])
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0, 0 ] 0)


expectedExample : RichText.Model.State.State
expectedExample =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "" ])
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 0)


nonEmptyExample : RichText.Model.State.State
nonEmptyExample =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.blockquote [])
                        (RichText.Model.Node.blockChildren <|
                            Array.fromList
                                [ RichText.Model.Node.block (RichText.Model.Element.element RichText.Definitions.paragraph [])
                                    (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "test" ])
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0, 0 ] 0)


testLiftEmpty : Test
testLiftEmpty =
    Test.describe "Tests the liftEmpty transform"
        [ Test.test "the example case works as expected" <|
            \_ ->
                Expect.equal (Ok expectedExample) (RichText.Commands.liftEmpty example)
        , Test.test "it fails if it's not empty" <|
            \_ ->
                Expect.equal (Err "I can only lift an empty text block") (RichText.Commands.liftEmpty nonEmptyExample)
        ]
