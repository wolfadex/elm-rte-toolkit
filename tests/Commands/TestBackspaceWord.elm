module Commands.TestBackspaceWord exposing (testBackspaceWord)

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
        (Just <| RichText.Model.Selection.caret [ 0, 1 ] 6)


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
                                , RichText.Model.Node.markedText "okay" [ RichText.Model.Mark.mark RichText.Definitions.bold [] ]
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
                                [ RichText.Model.Node.plainText "this is ex"
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
                                [ RichText.Model.Node.plainText "s is an ex"
                                , RichText.Model.Node.markedText "ample okay" [ RichText.Model.Mark.mark RichText.Definitions.bold [] ]
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 0)


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
                                , RichText.Model.Node.markedText "okay" [ RichText.Model.Mark.mark RichText.Definitions.bold [] ]
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 2 ] 0)


testBackspaceWord : Test
testBackspaceWord =
    Test.describe "Tests the backspaceWord transform"
        [ Test.test "Tests that the example case works as expected" <|
            \_ -> Expect.equal (Ok expectedExample) (RichText.Commands.backspaceWord example)
        , Test.test "Tests that remove a word across multiple text leaves works as expected" <|
            \_ -> Expect.equal (Ok expectedRemoveAn) (RichText.Commands.backspaceWord (example |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.caret [ 0, 0 ] 11)))
        , Test.test "Tests that remove a word stops at the beginning of a text block" <|
            \_ -> Expect.equal (Ok expectedRemoveThis) (RichText.Commands.backspaceWord (example |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.caret [ 0, 0 ] 3)))
        , Test.test "Tests that remove a word stops at the beginning of an inline node" <|
            \_ -> Expect.equal (Ok expectedRemoveInline) (RichText.Commands.backspaceWord removeInline)
        ]
