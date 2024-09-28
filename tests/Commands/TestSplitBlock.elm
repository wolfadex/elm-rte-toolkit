module Commands.TestSplitBlock exposing (testSplitBlock, testSplitBlockHeaderToNewParagraph, testSplitTextBlock)

import Array
import Expect
import RichText.Commands
import RichText.Definitions
import RichText.Model.Element
import RichText.Model.Node
import RichText.Model.Selection
import RichText.Model.State
import RichText.Node
import Test exposing (Test)


nestedExample : RichText.Model.State.State
nestedExample =
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


expectedNestedExample : RichText.Model.State.State
expectedNestedExample =
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
                    , RichText.Model.Node.block
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
        (Just <| RichText.Model.Selection.caret [ 1, 0, 0 ] 0)


example : RichText.Model.State.State
example =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "" ])
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
                    [ RichText.Model.Node.block (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "" ])
                    , RichText.Model.Node.block (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "" ])
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 1, 0 ] 0)


blockExample : RichText.Model.State.State
blockExample =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "" ])
                    , RichText.Model.Node.block (RichText.Model.Element.element RichText.Definitions.horizontalRule []) RichText.Model.Node.Leaf
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 1 ] 0)


rangeExample : RichText.Model.State.State
rangeExample =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "test" ])
                    ]
            )
        )
        (Just <| RichText.Model.Selection.singleNodeRange [ 0, 0 ] 0 3)


rangeExpectedExample : RichText.Model.State.State
rangeExpectedExample =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "" ])
                    , RichText.Model.Node.block (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "t" ])
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 1, 0 ] 0)


inlineExample : RichText.Model.State.State
inlineExample =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList
                                [ RichText.Model.Node.plainText "test"
                                , RichText.Model.Node.inlineElement (RichText.Model.Element.element RichText.Definitions.image []) []
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 1 ] 0)


inlineExpectedExample : RichText.Model.State.State
inlineExpectedExample =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList
                                [ RichText.Model.Node.plainText "test"
                                ]
                        )
                    , RichText.Model.Node.block (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList
                                [ RichText.Model.Node.inlineElement (RichText.Model.Element.element RichText.Definitions.image []) []
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 1, 0 ] 0)


headerExample : RichText.Model.State.State
headerExample =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block (RichText.Model.Element.element RichText.Definitions.heading [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "" ])
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 0)


expectedHeaderExample : RichText.Model.State.State
expectedHeaderExample =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block (RichText.Model.Element.element RichText.Definitions.heading [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "" ])
                    , RichText.Model.Node.block (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "" ])
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 1, 0 ] 0)


findBlockquoteAncestor =
    RichText.Node.findAncestor (\b -> RichText.Model.Element.name (RichText.Model.Node.element b) == "blockquote")


testSplitBlock : Test
testSplitBlock =
    Test.describe "Tests the split block transform"
        [ Test.test "the example case works as expected" <|
            \_ ->
                Expect.equal
                    (Ok expectedExample)
                    (RichText.Commands.splitBlock RichText.Node.findTextBlockNodeAncestor example)
        , Test.test "the nested case works as expected" <|
            \_ ->
                Expect.equal
                    (Ok expectedNestedExample)
                    (RichText.Commands.splitBlock findBlockquoteAncestor nestedExample)
        , Test.test "it should fail if you split a block leaf" <|
            \_ ->
                Expect.equal
                    (Err "I cannot find a proper ancestor to split")
                    (RichText.Commands.splitBlock RichText.Node.findTextBlockNodeAncestor blockExample)
        , Test.test "splitting a range selection works as expected" <|
            \_ ->
                Expect.equal
                    (Ok rangeExpectedExample)
                    (RichText.Commands.splitBlock RichText.Node.findTextBlockNodeAncestor rangeExample)
        , Test.test "splitting a selected inline element works as expected" <|
            \_ ->
                Expect.equal
                    (Ok inlineExpectedExample)
                    (RichText.Commands.splitBlock RichText.Node.findTextBlockNodeAncestor inlineExample)
        ]


testSplitTextBlock : Test
testSplitTextBlock =
    Test.describe "Tests the splitTextBlock transform"
        [ Test.test "the example case works as expected" <|
            \_ -> Expect.equal (Ok expectedExample) (RichText.Commands.splitTextBlock example)
        ]


testSplitBlockHeaderToNewParagraph : Test
testSplitBlockHeaderToNewParagraph =
    Test.describe "Tests the splitBlockHeaderToNewParagraph transform"
        [ Test.test "example case works as expected" <|
            \_ ->
                Expect.equal (Ok expectedHeaderExample)
                    (RichText.Commands.splitBlockHeaderToNewParagraph [ "heading" ] (RichText.Model.Element.element RichText.Definitions.paragraph []) headerExample)
        , Test.test "it works like split block in the normal case" <|
            \_ ->
                Expect.equal (Ok expectedExample)
                    (RichText.Commands.splitBlockHeaderToNewParagraph [ "heading" ] (RichText.Model.Element.element RichText.Definitions.paragraph []) example)
        ]
