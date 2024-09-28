module List.TestWrap exposing (testWrap)

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
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList
                                [ RichText.Model.Node.plainText "text"
                                ]
                        )
                    , RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList
                                [ RichText.Model.Node.plainText "text2"
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.range [ 0, 0 ] 0 [ 1, 0 ] 0)


expectedExample : RichText.Model.State.State
expectedExample =
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
        (Just <| RichText.Model.Selection.range [ 0, 0, 0, 0 ] 0 [ 0, 1, 0, 0 ] 0)


testWrap : Test
testWrap =
    Test.describe "Tests the wrap transform"
        [ Test.test "Tests that the example case works as expected" <|
            \_ ->
                Expect.equal (Ok expectedExample) (RichText.List.wrap RichText.List.defaultListDefinition RichText.List.Ordered example)
        ]
