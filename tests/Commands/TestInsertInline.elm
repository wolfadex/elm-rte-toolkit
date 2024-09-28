module Commands.TestInsertInline exposing (testInsertInlineElement)

import Array
import Expect
import RichText.Commands
import RichText.Definitions
import RichText.Model.Attribute
import RichText.Model.Element
import RichText.Model.Node
import RichText.Model.Selection
import RichText.Model.State
import Test exposing (Test)


img : RichText.Model.Node.Inline
img =
    RichText.Model.Node.inlineElement (RichText.Model.Element.element RichText.Definitions.image []) []


newImg : RichText.Model.Node.Inline
newImg =
    RichText.Model.Node.inlineElement (RichText.Model.Element.element RichText.Definitions.image [ RichText.Model.Attribute.StringAttribute "src" "test" ]) []


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
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 2)


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
                                [ RichText.Model.Node.plainText "te"
                                , img
                                , RichText.Model.Node.plainText "xt"
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 1 ] 0)


inlineReplace : RichText.Model.State.State
inlineReplace =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList
                                [ img ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 0)


expectedInlineReplace : RichText.Model.State.State
expectedInlineReplace =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList
                                [ newImg ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 0)


expectedRangeExample : RichText.Model.State.State
expectedRangeExample =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList
                                [ RichText.Model.Node.plainText ""
                                , img
                                , RichText.Model.Node.plainText "xt"
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 1 ] 0)


hrExample : RichText.Model.State.State
hrExample =
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
                        (RichText.Model.Element.element RichText.Definitions.horizontalRule [])
                        RichText.Model.Node.Leaf
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 1 ] 0)


testInsertInlineElement : Test
testInsertInlineElement =
    Test.describe "Tests the insertInlineElement transform"
        [ Test.test "Tests that the example case works as expected" <|
            \_ -> Expect.equal (Ok expectedExample) (RichText.Commands.insertInline img example)
        , Test.test "it should replace a selected inline element" <|
            \_ -> Expect.equal (Ok expectedInlineReplace) (RichText.Commands.insertInline newImg inlineReplace)
        , Test.test "it should replace a range selection" <|
            \_ ->
                Expect.equal (Ok expectedRangeExample)
                    (RichText.Commands.insertInline img
                        (example |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.singleNodeRange [ 0, 0 ] 0 2))
                    )
        , Test.test "it should fail if a block is selected" <|
            \_ ->
                Expect.equal (Err "I can not insert an inline element if a block is selected")
                    (RichText.Commands.insertInline img hrExample)
        ]
