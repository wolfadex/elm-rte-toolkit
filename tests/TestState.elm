module TestState exposing (testReduce, testValidate)

import Array
import Expect
import RichText.Definitions
import RichText.Model.Element
import RichText.Model.Mark
import RichText.Model.Node
import RichText.Model.Selection
import RichText.Model.State
import RichText.State
import Test exposing (Test)


reduceExample : RichText.Model.State.State
reduceExample =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "te", RichText.Model.Node.plainText "xt" ])
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 1 ] 2)


expectedReduceExample : RichText.Model.State.State
expectedReduceExample =
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
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 4)


reduceEmptyExample : RichText.Model.State.State
reduceEmptyExample =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList
                                [ RichText.Model.Node.markedText "" [ RichText.Model.Mark.mark RichText.Definitions.bold [] ]
                                , RichText.Model.Node.plainText "text"
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 1 ] 2)


expectedReduceEmptyExample : RichText.Model.State.State
expectedReduceEmptyExample =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList
                                [ RichText.Model.Node.plainText "text" ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 2)


validateExample : RichText.Model.State.State
validateExample =
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
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 2)


invalidGroupExample : RichText.Model.State.State
invalidGroupExample =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.listItem [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "text" ])
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 2)


invalidChildrenExample : RichText.Model.State.State
invalidChildrenExample =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.blockquote [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "text" ])
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 2)


testReduce : Test
testReduce =
    Test.describe "Tests the reduce function"
        [ Test.test "Tests that the example case works as expected" <|
            \_ ->
                Expect.equal expectedReduceExample (RichText.State.reduce reduceExample)
        , Test.test "Tests that reducing an empty text block works as expected" <|
            \_ ->
                Expect.equal expectedReduceEmptyExample (RichText.State.reduce reduceEmptyExample)
        ]


testValidate : Test
testValidate =
    Test.describe "Tests the validate function"
        [ Test.test "Tests that the example case works as expected" <|
            \_ ->
                Expect.equal (Ok validateExample) (RichText.State.validate RichText.Definitions.markdown validateExample)
        , Test.test "groups are validated" <|
            \_ ->
                Expect.equal
                    (Err "Group list_item is not in allowed groups [block]")
                    (RichText.State.validate RichText.Definitions.markdown invalidGroupExample)
        , Test.test "children are validated" <|
            \_ ->
                Expect.equal
                    (Err "I was expecting textblock content type, but instead I got BlockNodeType")
                    (RichText.State.validate RichText.Definitions.markdown invalidChildrenExample)
        ]
