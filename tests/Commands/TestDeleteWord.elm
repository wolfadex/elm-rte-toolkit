module Commands.TestDeleteWord exposing (testDeleteWord)

import Array
import Expect
import RichText.Commands
import RichText.Definitions
import RichText.Model.Element
import RichText.Model.Mark
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
                                [ RichText.Model.Node.plainText "this is an ex"
                                , RichText.Model.Node.markedText "ample okay" [ RichText.Model.Mark.mark RichText.Definitions.bold [] ]
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 11)


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
                                [ RichText.Model.Node.plainText "this is an "
                                , RichText.Model.Node.markedText " okay" [ RichText.Model.Mark.mark RichText.Definitions.bold [] ]
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 11)


expectedRemoveAn : RichText.Model.State.State
expectedRemoveAn =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList
                                [ RichText.Model.Node.plainText "this is  ex"
                                , RichText.Model.Node.markedText "ample okay" [ RichText.Model.Mark.mark RichText.Definitions.bold [] ]
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 8)


expectedRemoveThis : RichText.Model.State.State
expectedRemoveThis =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList
                                [ RichText.Model.Node.plainText "thi is an ex"
                                , RichText.Model.Node.markedText "ample okay" [ RichText.Model.Mark.mark RichText.Definitions.bold [] ]
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 3)


removeInline : RichText.Model.State.State
removeInline =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList
                                [ RichText.Model.Node.plainText "s is an ex"
                                , RichText.Model.Node.inlineElement (RichText.Model.Element.element RichText.Definitions.image []) []
                                , RichText.Model.Node.markedText "ample okay" [ RichText.Model.Mark.mark RichText.Definitions.bold [] ]
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 2 ] 6)


expectedRemoveInline : RichText.Model.State.State
expectedRemoveInline =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList
                                [ RichText.Model.Node.plainText "s is an ex"
                                , RichText.Model.Node.inlineElement (RichText.Model.Element.element RichText.Definitions.image []) []
                                , RichText.Model.Node.markedText "ample " [ RichText.Model.Mark.mark RichText.Definitions.bold [] ]
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 2 ] 6)


testDeleteWord : Test
testDeleteWord =
    Test.describe "Tests the deleteWord transform"
        [ Test.test "Tests that the example case works as expected" <|
            \_ -> Expect.equal (Ok expectedExample) (RichText.Commands.deleteWord example)
        , Test.test "Tests that remove a word across multiple text leaves works as expected" <|
            \_ -> Expect.equal (Ok expectedRemoveAn) (RichText.Commands.deleteWord (example |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.caret [ 0, 0 ] 8)))
        , Test.test "Tests that remove a word stops at the beginning of a text block" <|
            \_ -> Expect.equal (Ok expectedRemoveThis) (RichText.Commands.deleteWord (example |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.caret [ 0, 0 ] 3)))
        , Test.test "Tests that remove a word stops at the beginning of an inline node" <|
            \_ -> Expect.equal (Ok expectedRemoveInline) (RichText.Commands.deleteWord removeInline)
        ]
