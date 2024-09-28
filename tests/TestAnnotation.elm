module TestAnnotation exposing (testIsSelectable)

import Expect
import RichText.Annotation
import RichText.Definitions
import RichText.Model.Element
import RichText.Model.Node
import RichText.Node
import Set
import Test exposing (Test)


testIsSelectable : Test
testIsSelectable =
    Test.describe "Tests that a node is selectable"
        [ Test.test "Test that a text node is selectable" <|
            \_ -> Expect.equal True <| RichText.Annotation.isSelectable (RichText.Node.Inline (RichText.Model.Node.plainText ""))
        , Test.test "Test that a element node with a selectable mark is selectable" <|
            \_ ->
                Expect.equal True <|
                    RichText.Annotation.isSelectable
                        (RichText.Node.Block
                            (RichText.Model.Node.block (RichText.Model.Element.element RichText.Definitions.doc [] |> RichText.Model.Element.withAnnotations (Set.singleton RichText.Annotation.selectable)) RichText.Model.Node.Leaf)
                        )
        , Test.test "Test that a element node without a selectable mark is not selectable" <|
            \_ ->
                Expect.equal False <|
                    RichText.Annotation.isSelectable
                        (RichText.Node.Block
                            (RichText.Model.Node.block (RichText.Model.Element.element RichText.Definitions.doc []) RichText.Model.Node.Leaf)
                        )
        ]
