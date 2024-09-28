module Commands.TestInsertBlock exposing (testInsertBlock)

import Array
import Expect
import RichText.Annotation
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
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "test" ])
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 0 ] 2)


horizontalBlock : RichText.Model.Node.Block
horizontalBlock =
    RichText.Annotation.removeFromBlock RichText.Annotation.selectable <|
        RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.horizontalRule [])
            RichText.Model.Node.Leaf


selectableHorizontalBlock : RichText.Model.Node.Block
selectableHorizontalBlock =
    RichText.Annotation.addToBlock RichText.Annotation.selectable horizontalBlock


expectedExample : RichText.Model.State.State
expectedExample =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "te" ])
                    , horizontalBlock
                    , RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "st" ])
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 2, 0 ] 0)


expectedSelectable : RichText.Model.State.State
expectedSelectable =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "te" ])
                    , selectableHorizontalBlock
                    , RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "st" ])
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 1 ] 0)


expectedRange : RichText.Model.State.State
expectedRange =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "" ])
                    , horizontalBlock
                    , RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "st" ])
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 2, 0 ] 0)


expectedInsertBlockSelected : RichText.Model.State.State
expectedInsertBlockSelected =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "te" ])
                    , selectableHorizontalBlock
                    , selectableHorizontalBlock
                    , RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "st" ])
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 2 ] 0)


stateWithInline : RichText.Model.State.State
stateWithInline =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList
                                [ RichText.Model.Node.plainText "test"
                                , RichText.Model.Node.inlineElement (RichText.Model.Element.element RichText.Definitions.image []) []
                                , RichText.Model.Node.plainText "test2"
                                ]
                        )
                    ]
            )
        )
        (Just <| RichText.Model.Selection.caret [ 0, 1 ] 0)


expectedStateWithInline : RichText.Model.State.State
expectedStateWithInline =
    RichText.Model.State.state
        (RichText.Model.Node.block
            (RichText.Model.Element.element RichText.Definitions.doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList
                    [ RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList
                                [ RichText.Model.Node.plainText "test"
                                ]
                        )
                    , horizontalBlock
                    , RichText.Model.Node.block
                        (RichText.Model.Element.element RichText.Definitions.paragraph [])
                        (RichText.Model.Node.inlineChildren <|
                            Array.fromList
                                [ RichText.Model.Node.inlineElement (RichText.Model.Element.element RichText.Definitions.image []) []
                                , RichText.Model.Node.plainText "test2"
                                ]
                        )
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
                    (RichText.Commands.insertBlock horizontalBlock example)
        , Test.test "a selectable block is selected after insert" <|
            \_ ->
                Expect.equal
                    (Ok expectedSelectable)
                    (RichText.Commands.insertBlock selectableHorizontalBlock example)
        , Test.test "it should insert into a range selection" <|
            \_ ->
                Expect.equal
                    (Ok expectedRange)
                    (RichText.Commands.insertBlock horizontalBlock
                        (example |> RichText.Model.State.withSelection (Just <| RichText.Model.Selection.singleNodeRange [ 0, 0 ] 0 2))
                    )
        , Test.test "it should insert a block if a block is selected" <|
            \_ ->
                Expect.equal
                    (Ok expectedInsertBlockSelected)
                    (RichText.Commands.insertBlock selectableHorizontalBlock expectedSelectable)
        , -- This is somewhat suspicious... perhaps it should remove the inline element instead
          -- of split it
          Test.test "it should insert if an inline is selected" <|
            \_ ->
                Expect.equal
                    (Ok expectedStateWithInline)
                    (RichText.Commands.insertBlock horizontalBlock stateWithInline)
        ]
