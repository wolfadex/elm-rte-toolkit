module Commands.TestBackspaceBlock exposing (testBackspaceBlock)

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
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "p1" ])
                    , RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.horizontalRule [])
                        RichText.Model.Node.Leaf
                    , RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "p2" ])
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 2, 0 ] 0)


expectedExample : RichText.Model.State.State
expectedExample =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "p1" ])
                    , RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "p2" ])
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 1, 0 ] 0)


testBackspaceBlock : Test
testBackspaceBlock =
    Test.describe "Tests the backspaceBlock transform"
        [ Test.test "Tests that the example case works as expected" <|
            \_ -> Expect.equal (Ok expectedExample) (RichText.Commands.backspaceBlock example)
        , Test.test "it should give an error if the selection is not at the beginning of a text block" <|
            \_ ->
                Expect.equal (Err "Cannot backspace a block element if we're not at the beginning of a text block")
                    (RichText.Commands.backspaceBlock (example |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.caret [ 1, 0 ] 1)))
        , Test.test "it should give an error if the selection is a range" <|
            \_ ->
                Expect.equal (Err "Cannot backspace a block element if we're not at the beginning of a text block")
                    (RichText.Commands.backspaceBlock (example |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.singleNodeRange [ 1, 0 ] 0 1)))
        ]
