module Commands.TestBackspaceText exposing (testBackspaceText)

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
                                [ RichText.Model.Node.plainText "text"
                                , RichText.Model.Node.markedText "text2" [ RichText.Model.Mark.mark RichText.Definitions.bold [] ]
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
                                [ RichText.Model.Node.plainText "tex"
                                , RichText.Model.Node.markedText "text2" [ RichText.Model.Mark.mark RichText.Definitions.bold [] ]
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 3)


expectedExampleOffsetOne : RichText.Model.State.State
expectedExampleOffsetOne =
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
                                , RichText.Model.Node.markedText "ext2" [ RichText.Model.Mark.mark RichText.Definitions.bold [] ]
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 1 ] 0)


inlineElementState : RichText.Model.State.State
inlineElementState =
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
                                , RichText.Model.Node.inlineElement (RichText.Model.Element.element RichText.Definitions.image []) []
                                , RichText.Model.Node.markedText "text2" [ RichText.Model.Mark.mark RichText.Definitions.bold [] ]
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 2 ] 0)


testBackspaceText : Test
testBackspaceText =
    Test.describe "Tests the backspaceText transform"
        [ Test.test "Tests that the example case works as expected" <|
            \_ -> Expect.equal (Ok expectedExample) (RichText.Commands.backspaceText example)
        , Test.test "Tests that the example case works as expected when the offset is 1" <|
            \_ ->
                Expect.equal (Ok expectedExampleOffsetOne)
                    (RichText.Commands.backspaceText (example |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.caret [ 0, 1 ] 1)))
        , Test.test "it should return an error if the offset is > 1" <|
            \_ ->
                Expect.equal (Err "I use native behavior when doing backspace when the anchor offset could not result in a node change")
                    (RichText.Commands.backspaceText (example |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.caret [ 0, 1 ] 2)))
        , Test.test "it should return an error if it's at the beginning of the document" <|
            \_ ->
                Expect.equal (Err "Cannot backspace if the previous node is a block")
                    (RichText.Commands.backspaceText (example |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.caret [ 0, 0 ] 0)))
        , Test.test "it should return an error if the previous node is an inline element" <|
            \_ ->
                Expect.equal (Err "Cannot backspace if the previous node is an inline leaf")
                    (RichText.Commands.backspaceText inlineElementState)
        ]
