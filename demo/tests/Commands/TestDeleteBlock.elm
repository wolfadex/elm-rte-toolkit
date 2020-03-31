module Commands.TestDeleteBlock exposing (..)

import Array
import Expect
import RichText.Commands exposing (deleteBlock)
import RichText.Model.Element as Element
import RichText.Model.Node
    exposing
        ( Block
        , Children(..)
        , Inline
        , block
        , blockChildren
        , inlineChildren
        , plainText
        )
import RichText.Model.Selection exposing (caret, singleNodeRange)
import RichText.Model.State exposing (State, state, withSelection)
import RichText.Specs exposing (doc, horizontalRule, paragraph)
import Test exposing (Test, describe, test)


example : State
example =
    state
        (block
            (Element.element doc [])
            (blockChildren <|
                Array.fromList
                    [ block
                        (Element.element paragraph [])
                        (inlineChildren <| Array.fromList [ plainText "p1" ])
                    , block
                        (Element.element horizontalRule [])
                        Leaf
                    , block
                        (Element.element paragraph [])
                        (inlineChildren <| Array.fromList [ plainText "p2" ])
                    ]
            )
        )
        (Just <| caret [ 0, 0 ] 2)


expectedExample : State
expectedExample =
    state
        (block
            (Element.element doc [])
            (blockChildren <|
                Array.fromList
                    [ block
                        (Element.element paragraph [])
                        (inlineChildren <| Array.fromList [ plainText "p1" ])
                    , block
                        (Element.element paragraph [])
                        (inlineChildren <| Array.fromList [ plainText "p2" ])
                    ]
            )
        )
        (Just <| caret [ 0, 0 ] 2)


testDeleteBlock : Test
testDeleteBlock =
    describe "Tests the deleteBlock transform"
        [ test "Tests that the example case works as expected" <|
            \_ -> Expect.equal (Ok expectedExample) (deleteBlock example)
        , test "it should give an error if the selection is not at the beginning of a text block" <|
            \_ ->
                Expect.equal (Err "Cannot delete a block element if we're not at the end of a text block")
                    (deleteBlock (example |> withSelection (Just <| caret [ 1, 0 ] 1)))
        , test "it should give an error if the selection is a range" <|
            \_ ->
                Expect.equal (Err "Cannot delete a block element if we're not at the end of a text block")
                    (deleteBlock (example |> withSelection (Just <| singleNodeRange [ 1, 0 ] 0 1)))
        ]
