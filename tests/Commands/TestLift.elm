module Commands.TestLift exposing (testLift)

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
                                    (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "text" ])
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
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "text" ])
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 0)


rangeExample : RichText.Model.State.State
rangeExample =
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
                                    (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "text" ])
                                ]
                        )
                    , RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.blockquote [])
                        (RichText.Model.Node.blockChildren <|
                            Array.fromList
                                [ RichText.Model.Node.block (RichText.Model.Element.element RichText.Definitions.paragraph [])
                                    (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "text" ])
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.range [ 0, 0, 0 ] 0 [ 1, 0, 0 ] 0)


expectedRangeExample : RichText.Model.State.State
expectedRangeExample =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "text" ])
                    , RichText.Model.Node.block (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "text" ])
                    ]
            )
        )
        (Just <| RichText.Model.Selection.range [ 0, 0 ] 0 [ 1, 0 ] 0)


testLift : Test
testLift =
    Test.describe "Tests the lift transform"
        [ Test.test "the example case works as expected" <|
            \_ ->
                Expect.equal (Ok expectedExample) (RichText.Commands.lift example)
        , Test.test "the example case works with non-zero offset" <|
            \_ ->
                Expect.equal (Ok (expectedExample |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.caret [ 0, 0 ] 2)))
                    (RichText.Commands.lift (example |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.caret [ 0, 0, 0 ] 2)))
        , Test.test "range selection lifts all elements in range" <|
            \_ ->
                Expect.equal (Ok expectedRangeExample) (RichText.Commands.lift rangeExample)
        ]
