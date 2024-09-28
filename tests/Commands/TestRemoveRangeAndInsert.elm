module Commands.TestRemoveRangeAndInsert exposing (testRemoveRangeAndInsert)

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
        (Just <| RichText.Model.Selection.range [ 0, 0 ] 2 [ 0, 2 ] 2)


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
                                [ RichText.Model.Node.plainText "het"
                                , RichText.Model.Node.plainText "rld"
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 3)


testDoc : RichText.Model.Node.Block
testDoc =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.doc [])
        (RichText.Model.Node.blockChildren <|
            Array.fromList
                [ RichText.Model.Node.block
                    (RichText.Model.Element.element RichText.Definitions.paragraph [])
                    (RichText.Model.Node.inlineChildren <|
                        Array.fromList
                            [ RichText.Model.Node.plainText "sample1"
                            , RichText.Model.Node.inlineElement (RichText.Model.Element.element RichText.Definitions.image []) []
                            , RichText.Model.Node.plainText "sample2"
                            ]
                    )
                , RichText.Model.Node.block
                    (RichText.Model.Element.element RichText.Definitions.paragraph [])
                    (RichText.Model.Node.inlineChildren <|
                        Array.fromList
                            [ RichText.Model.Node.plainText "sample3"
                            , RichText.Model.Node.inlineElement (RichText.Model.Element.element RichText.Definitions.image []) []
                            ]
                    )
                , RichText.Model.Node.block
                    (RichText.Model.Element.element RichText.Definitions.horizontalRule [])
                    RichText.Model.Node.Leaf
                ]
        )


expectedStateRemoveRangeSingleNode : RichText.Model.State.State
expectedStateRemoveRangeSingleNode =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList
                                [ RichText.Model.Node.plainText "t"
                                , RichText.Model.Node.inlineElement (RichText.Model.Element.element RichText.Definitions.image []) []
                                , RichText.Model.Node.plainText "sample2"
                                ]
                        )
                    , RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList
                                [ RichText.Model.Node.plainText "sample3"
                                , RichText.Model.Node.inlineElement (RichText.Model.Element.element RichText.Definitions.image []) []
                                ]
                        )
                    , RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.horizontalRule [])
                        RichText.Model.Node.Leaf
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 1)


expectedStateRemoveRangeMultiNode : RichText.Model.State.State
expectedStateRemoveRangeMultiNode =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList [ RichText.Model.Node.plainText "t", RichText.Model.Node.plainText "ple2" ]
                        )
                    , RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList
                                [ RichText.Model.Node.plainText "sample3"
                                , RichText.Model.Node.inlineElement (RichText.Model.Element.element RichText.Definitions.image []) []
                                ]
                        )
                    , RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.horizontalRule [])
                        RichText.Model.Node.Leaf
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 1)


expectedStateRemoveRangeInlineNode : RichText.Model.State.State
expectedStateRemoveRangeInlineNode =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList [ RichText.Model.Node.plainText "sample1t", RichText.Model.Node.plainText "ple2" ]
                        )
                    , RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList
                                [ RichText.Model.Node.plainText "sample3"
                                , RichText.Model.Node.inlineElement (RichText.Model.Element.element RichText.Definitions.image []) []
                                ]
                        )
                    , RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.horizontalRule [])
                        RichText.Model.Node.Leaf
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 8)


expectedStateRemoveRangeBlockNode : RichText.Model.State.State
expectedStateRemoveRangeBlockNode =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList
                                [ RichText.Model.Node.plainText "sample1"
                                , RichText.Model.Node.inlineElement (RichText.Model.Element.element RichText.Definitions.image []) []
                                , RichText.Model.Node.plainText "sample2"
                                ]
                        )
                    , RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList
                                [ RichText.Model.Node.plainText "sample3t"
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 1, 0 ] 8)


testState =
    RichText.Model.State.state testDoc Nothing


testRemoveRangeAndInsert : Test
testRemoveRangeAndInsert =
    Test.describe "Tests the testRemoveRangeAndInsert transform"
        [ Test.test "Tests that an error occurs if nothing is selected" <|
            \_ ->
                Expect.equal (Err "Nothing is selected") (RichText.Commands.removeRangeAndInsert "t" testState)
        , Test.test "Tests that an error occurs if in a collapsed selection" <|
            \_ ->
                Expect.equal (Err "Cannot remove contents of collapsed selection")
                    (RichText.Commands.removeRangeAndInsert "t" (testState |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.caret [ 0, 0 ] 0)))
        , Test.test "Tests that we can successfully remove and insert contents of a single node" <|
            \_ ->
                Expect.equal (Ok expectedStateRemoveRangeSingleNode)
                    (RichText.Commands.removeRangeAndInsert "t" (testState |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.singleNodeRange [ 0, 0 ] 0 7)))
        , Test.test "Tests that we can successfully remove contents across multiple nodes" <|
            \_ ->
                Expect.equal (Ok expectedStateRemoveRangeMultiNode)
                    (RichText.Commands.removeRangeAndInsert "t" (testState |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.range [ 0, 0 ] 0 [ 0, 2 ] 3)))
        , Test.test "Tests that we can successfully remove contents when inline node is selected" <|
            \_ ->
                Expect.equal (Ok expectedStateRemoveRangeInlineNode)
                    (RichText.Commands.removeRangeAndInsert "t" (testState |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.range [ 0, 1 ] 0 [ 0, 2 ] 3)))
        , Test.test "Tests we can successfully remove contents when block leaf is selected" <|
            \_ ->
                Expect.equal (Ok expectedStateRemoveRangeBlockNode)
                    (RichText.Commands.removeRangeAndInsert "t" (testState |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.range [ 1, 1 ] 0 [ 2 ] 0)))
        , Test.test "Tests that removing a range on a small doc works as expected" <|
            \_ ->
                Expect.equal (Ok expectedExample) (RichText.Commands.removeRangeAndInsert "t" example)
        ]
