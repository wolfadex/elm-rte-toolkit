module List.TestLift exposing (testLift)

import Array
import Expect
import RichText.Definitions
import RichText.List
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
                    [ RichText.Model.Node.block (RichText.Model.Element.element RichText.Definitions.orderedList [])
                        (RichText.Model.Node.blockChildren <|
                            Array.fromList <|
                                [ RichText.Model.Node.block
                                    (RichText.Model.Element.element RichText.Definitions.listItem [])
                                    (RichText.Model.Node.blockChildren <|
                                        Array.fromList
                                            [ RichText.Model.Node.block
                                                (RichText.Model.Element.element RichText.Definitions.paragraph [])
                                                (RichText.Model.Node.inlineChildren <|
                                                    Array.fromList
                                                        [ RichText.Model.Node.plainText "text"
                                                        ]
                                                )
                                            ]
                                    )
                                , RichText.Model.Node.block
                                    (RichText.Model.Element.element RichText.Definitions.listItem [])
                                    (RichText.Model.Node.blockChildren <|
                                        Array.fromList
                                            [ RichText.Model.Node.block
                                                (RichText.Model.Element.element RichText.Definitions.paragraph [])
                                                (RichText.Model.Node.inlineChildren <|
                                                    Array.fromList
                                                        [ RichText.Model.Node.plainText "text2"
                                                        ]
                                                )
                                            ]
                                    )
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0, 0, 0 ] 4)


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
                                ]
                        )
                    , RichText.Model.Node.block (RichText.Model.Element.element RichText.Definitions.orderedList [])
                        (RichText.Model.Node.blockChildren <|
                            Array.fromList <|
                                [ RichText.Model.Node.block
                                    (RichText.Model.Element.element RichText.Definitions.listItem [])
                                    (RichText.Model.Node.blockChildren <|
                                        Array.fromList
                                            [ RichText.Model.Node.block
                                                (RichText.Model.Element.element RichText.Definitions.paragraph [])
                                                (RichText.Model.Node.inlineChildren <|
                                                    Array.fromList
                                                        [ RichText.Model.Node.plainText "text2"
                                                        ]
                                                )
                                            ]
                                    )
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 4)


testLift : Test
testLift =
    Test.describe "Tests the lift transform"
        [ Test.test "Tests that the example case works as expected" <|
            \_ ->
                Expect.equal (Ok expectedExample) (RichText.List.lift RichText.List.defaultListDefinition example)
        ]
