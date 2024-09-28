module Commands.TestInsertAfterBlockLeaf exposing (testInsertBlock)

import Array
import Expect
import RichText.Commands
import RichText.Definitions
import RichText.Model.Element
import RichText.Model.Node
import RichText.Model.Selection
import RichText.Model.State
import Test exposing (Test)


emptyParagraph : RichText.Model.Node.Block
emptyParagraph =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.paragraph [])
        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "" ])


example : RichText.Model.State.State
example =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "test" ])
                    , RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.horizontalRule [])
                        RichText.Model.Node.Leaf
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 1 ] 0)


expectedExample : RichText.Model.State.State
expectedExample =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "test" ])
                    , RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.horizontalRule [])
                        RichText.Model.Node.Leaf
                    , emptyParagraph
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 2, 0 ] 0)


testInsertBlock : Test
testInsertBlock =
    Test.describe "Tests the insertBlock transform"
        [ Test.test "the example case works as expected" <|
            \_ ->
                Expect.equal
                    (Ok expectedExample)
                    (RichText.Commands.insertAfterBlockLeaf emptyParagraph example)
        ]
