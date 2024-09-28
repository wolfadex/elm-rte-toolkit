module Commands.TestDeleteText exposing (testDeleteText)

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
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 4)


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
                                , RichText.Model.Node.markedText "ext2" [ RichText.Model.Mark.mark RichText.Definitions.bold [] ]
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 1 ] 0)


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
                                [ RichText.Model.Node.plainText "tex"
                                , RichText.Model.Node.markedText "text2" [ RichText.Model.Mark.mark RichText.Definitions.bold [] ]
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 3)


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
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 4)


testDeleteText : Test
testDeleteText =
    Test.describe "Tests the deleteText transform"
        [ Test.test "Tests that the example case works as expected" <|
            \_ -> Expect.equal (Ok expectedExample) (RichText.Commands.deleteText example)
        , Test.test "Tests that the example case works as expected when the offset is 1 off from the end" <|
            \_ ->
                Expect.equal (Ok expectedExampleOffsetOne)
                    (RichText.Commands.deleteText (example |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.caret [ 0, 0 ] 3)))
        , Test.test "it should return an error if the offset is > 1 off from the end" <|
            \_ ->
                Expect.equal (Err "I use the default behavior when deleting text when the anchor offset is not at the end of a text node")
                    (RichText.Commands.deleteText (example |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.caret [ 0, 1 ] 2)))
        , Test.test "it should return an error if it's at the end of the document" <|
            \_ ->
                Expect.equal (Err "I cannot do delete because there is no neighboring text node")
                    (RichText.Commands.deleteText (example |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.caret [ 0, 1 ] 5)))
        , Test.test "it should return an error if the previous node is an inline element" <|
            \_ ->
                Expect.equal (Err "Cannot delete if the previous node is an inline leaf")
                    (RichText.Commands.deleteText inlineElementState)
        ]
