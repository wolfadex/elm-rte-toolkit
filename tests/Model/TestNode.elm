module Model.TestNode exposing (testCommonAncestor, testDecrement, testIncrement, testMarksToMarkNodeList, testParent, testToString)

import Array
import Expect
import RichText.Model.Mark
import RichText.Model.Node
import SimpleSpec
import Test exposing (Test)


mark1 =
    RichText.Model.Mark.mark SimpleSpec.bold []


mark2 =
    RichText.Model.Mark.mark SimpleSpec.italic []


mark3 =
    RichText.Model.Mark.mark SimpleSpec.strikethrough []


testMarkLists =
    [ [ mark1, mark2 ], [ mark1, mark2, mark3 ], [ mark2 ], [] ]


expectedMarkNodes =
    Array.fromList <|
        [ RichText.Model.Node.MarkNode
            { mark = mark1
            , children =
                Array.fromList <|
                    [ RichText.Model.Node.MarkNode
                        { mark = mark2
                        , children =
                            Array.fromList <|
                                [ RichText.Model.Node.LeafNode 0
                                , RichText.Model.Node.MarkNode
                                    { mark = mark3
                                    , children =
                                        Array.fromList <|
                                            [ RichText.Model.Node.LeafNode 1 ]
                                    }
                                ]
                        }
                    ]
            }
        , RichText.Model.Node.MarkNode { mark = mark2, children = Array.fromList <| [ RichText.Model.Node.LeafNode 2 ] }
        , RichText.Model.Node.LeafNode 3
        ]


testNoMarksList =
    [ [], [], [], [] ]


expectedNoMarksList =
    Array.fromList <| [ RichText.Model.Node.LeafNode 0, RichText.Model.Node.LeafNode 1, RichText.Model.Node.LeafNode 2, RichText.Model.Node.LeafNode 3 ]


testMarksToMarkNodeList : Test
testMarksToMarkNodeList =
    Test.describe "Tests that marksToMarkNodeList works as expected"
        [ Test.test "Tests that the output of marksToMarkNodeList is correct" <|
            \_ ->
                Expect.equal expectedMarkNodes (RichText.Model.Node.marksToMarkNodeList testMarkLists)
        , Test.test "Tests that the output of no marks is correct" <|
            \_ ->
                Expect.equal expectedNoMarksList (RichText.Model.Node.marksToMarkNodeList testNoMarksList)
        ]


testCommonAncestor : Test
testCommonAncestor =
    Test.describe "Tests that commonAncestor works as expected"
        [ Test.test "Test that the we can find the common ancestor of root and another path" <|
            \_ -> Expect.equal [] (RichText.Model.Node.commonAncestor [] [ 0, 1 ])
        , Test.test "Test that the we can find the common ancestor of parent and another path" <|
            \_ -> Expect.equal [ 0 ] (RichText.Model.Node.commonAncestor [ 0 ] [ 0, 1 ])
        , Test.test "Test that the we can find the common ancestor of two siblings" <|
            \_ -> Expect.equal [ 0 ] (RichText.Model.Node.commonAncestor [ 0, 2 ] [ 0, 1 ])
        , Test.test "Test that the we can find the common of two long paths" <|
            \_ -> Expect.equal [ 0, 1 ] (RichText.Model.Node.commonAncestor [ 0, 1, 2, 3, 4 ] [ 0, 1, 3, 2, 4 ])
        ]


testDecrement : Test
testDecrement =
    Test.describe "Tests that decrement works as expected"
        [ Test.test "Decrementing the root path gives the root path" <|
            \_ -> Expect.equal [] (RichText.Model.Node.decrement [])
        , Test.test "Decrementing a path should work as expected" <|
            \_ -> Expect.equal [ 0, 1 ] (RichText.Model.Node.decrement [ 0, 2 ])
        , Test.test "Decrementing can go negative" <|
            \_ -> Expect.equal [ 0, -1 ] (RichText.Model.Node.decrement [ 0, 0 ])
        ]


testIncrement : Test
testIncrement =
    Test.describe "Tests that increment works as expected"
        [ Test.test "Incrementing the root path gives the root path" <|
            \_ -> Expect.equal [] (RichText.Model.Node.increment [])
        , Test.test "Incrementing a path should work as expected" <|
            \_ -> Expect.equal [ 0, 2 ] (RichText.Model.Node.increment [ 0, 1 ])
        ]


testParent : Test
testParent =
    Test.describe "Tests that parent works as expected"
        [ Test.test "The parent of the root path is the root path" <|
            \_ -> Expect.equal [] (RichText.Model.Node.parent [])
        , Test.test "The parent should be the same list with the last element removed" <|
            \_ -> Expect.equal [ 1, 2, 3 ] (RichText.Model.Node.parent [ 1, 2, 3, 4 ])
        ]


testToString : Test
testToString =
    Test.describe "Tests that toString works as expected"
        [ Test.test "The root path toString is the empty string" <|
            \_ -> Expect.equal "" (RichText.Model.Node.toString [])
        , Test.test "The path toString should work for a path of length 1" <|
            \_ -> Expect.equal "1" (RichText.Model.Node.toString [ 1 ])
        , Test.test "The path toString should work for a path of length > 1" <|
            \_ -> Expect.equal "1:3:0" (RichText.Model.Node.toString [ 1, 3, 0 ])
        ]
