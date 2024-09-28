module Commands.TestRemoveSelectedLeafElement exposing (testRemoveSelectedLeafElement)

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
                                [ RichText.Model.Node.plainText "hello"
                                , RichText.Model.Node.inlineElement (RichText.Model.Element.element RichText.Definitions.image []) []
                                , RichText.Model.Node.plainText "world"
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 1 ] 0)


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
                                [ RichText.Model.Node.plainText "hello"
                                , RichText.Model.Node.plainText "world"
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 5)


blockLeaf : RichText.Model.State.State
blockLeaf =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList
                                [ RichText.Model.Node.plainText "test"
                                ]
                        )
                    , RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.horizontalRule [])
                        RichText.Model.Node.Leaf
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 1 ] 0)


expectedRemoveBlockLeaf : RichText.Model.State.State
expectedRemoveBlockLeaf =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList
                                [ RichText.Model.Node.plainText "test"
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 4)


testRemoveSelectedLeafElement : Test
testRemoveSelectedLeafElement =
    Test.describe "Tests the removeSelectedLeafElement transform"
        [ Test.test "Tests that the example case works as expected" <|
            \_ -> Expect.equal (Ok expectedExample) (RichText.Commands.removeSelectedLeafElement example)
        , Test.test "Tests that removing a block leaf works as expected" <|
            \_ -> Expect.equal (Ok expectedRemoveBlockLeaf) (RichText.Commands.removeSelectedLeafElement blockLeaf)
        , Test.test "Test that it fails if a leaf is not selected" <|
            \_ ->
                Expect.equal (Err "There's no leaf node at the given selection")
                    (RichText.Commands.removeSelectedLeafElement
                        (blockLeaf |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.caret [ 0 ] 0))
                    )
        , Test.test "Test that it fails if a range is selected" <|
            \_ ->
                Expect.equal (Err "I cannot remove a leaf element if it is not collapsed")
                    (RichText.Commands.removeSelectedLeafElement
                        (blockLeaf |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.range [ 0, 0 ] 0 [ 1 ] 1))
                    )
        ]
