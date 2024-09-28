module TestNode exposing (testAllRange, testAnyRange, testConcatMap, testFindAncestor, testFindBackwardFrom, testFindBackwardFromExclusive, testFindForwardFrom, testFindForwardFromExclusive, testFindLastPath, testFindTextBlockNodeAncestor, testFoldl, testFoldlRange, testFoldr, testFoldrRange, testIndexedFoldl, testIndexedFoldr, testIndexedMap, testInsertAfter, testInsertBefore, testJoinBlocks, testMap, testNext, testNodeAt, testPrevious, testRemoveInRange, testRemoveNodeAndEmptyParents, testReplace, testReplaceWithFragment, testSplitBlockAtPathAndOffset, testSplitTextLeaf)

import Array
import Expect
import RichText.Definitions
import RichText.Model.Element
import RichText.Model.InlineElement
import RichText.Model.Node
import RichText.Model.Text
import RichText.Node
import Set
import Test exposing (Test)


rootNode : RichText.Model.Node.Block
rootNode =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.doc [])
        (RichText.Model.Node.blockChildren <| Array.fromList [ pNode ])


pNode : RichText.Model.Node.Block
pNode =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.paragraph [])
        (RichText.Model.Node.inlineChildren <|
            Array.fromList [ textNode1, textNode2 ]
        )


textNode1 : RichText.Model.Node.Inline
textNode1 =
    RichText.Model.Node.plainText "sample1"


textNode2 : RichText.Model.Node.Inline
textNode2 =
    RichText.Model.Node.plainText "sample2"


testNodeAt : Test
testNodeAt =
    Test.describe "Tests the function which finds a node given a node path and a block node"
        [ Test.test "Test that we can find the root node" <|
            \_ ->
                Expect.equal (Just (RichText.Node.Block rootNode)) (RichText.Node.nodeAt [] rootNode)
        , Test.test "Test that we can find the p node" <|
            \_ ->
                Expect.equal (Just (RichText.Node.Block pNode)) (RichText.Node.nodeAt [ 0 ] rootNode)
        , Test.test "Test that we can find the first text node" <|
            \_ ->
                Expect.equal (Just (RichText.Node.Inline textNode1)) (RichText.Node.nodeAt [ 0, 0 ] rootNode)
        , Test.test "Test that we can find the second text node" <|
            \_ ->
                Expect.equal (Just (RichText.Node.Inline textNode2)) (RichText.Node.nodeAt [ 0, 1 ] rootNode)
        , Test.test "Test that invalid paths return no result" <|
            \_ ->
                Expect.equal Nothing (RichText.Node.nodeAt [ 0, 2 ] rootNode)
        , Test.test "Test that invalid paths that are too long return no result" <|
            \_ ->
                Expect.equal Nothing (RichText.Node.nodeAt [ 0, 0, 0 ] rootNode)
        ]


nodePathList : RichText.Model.Node.Path -> RichText.Node.Node -> List RichText.Model.Node.Path -> List RichText.Model.Node.Path
nodePathList path _ list =
    path :: list


nodeNameOrTextValue : RichText.Model.Node.Path -> RichText.Node.Node -> List String -> List String
nodeNameOrTextValue _ node list =
    (case node of
        RichText.Node.Block bn ->
            RichText.Model.Element.name (RichText.Model.Node.element bn)

        RichText.Node.Inline il ->
            case il of
                RichText.Model.Node.Text tl ->
                    RichText.Model.Text.text tl

                RichText.Model.Node.InlineElement p ->
                    RichText.Model.Element.name (RichText.Model.InlineElement.element p)
    )
        :: list


testIndexedFoldr : Test
testIndexedFoldr =
    Test.describe "Tests that indexFoldr works as expected"
        [ Test.test "Test that the node paths are passed in as expected" <|
            \_ -> Expect.equal [ [], [ 0 ], [ 0, 0 ], [ 0, 1 ] ] (RichText.Node.indexedFoldr nodePathList [] (RichText.Node.Block rootNode))
        , Test.test "Test that the nodes are passed in as expected" <|
            \_ -> Expect.equal [ "doc", "paragraph", "sample1", "sample2" ] (RichText.Node.indexedFoldr nodeNameOrTextValue [] (RichText.Node.Block rootNode))
        ]


testFoldr : Test
testFoldr =
    Test.describe "Tests that foldr works as expected"
        [ Test.test "Test that the nodes are passed in as expected" <|
            \_ -> Expect.equal [ "doc", "paragraph", "sample1", "sample2" ] (RichText.Node.foldr (nodeNameOrTextValue []) [] (RichText.Node.Block rootNode))
        ]


testIndexedFoldl : Test
testIndexedFoldl =
    Test.describe "Tests that indexedFoldl works as expected"
        [ Test.test "Test that the node paths are passed in as expected" <|
            \_ -> Expect.equal [ [ 0, 1 ], [ 0, 0 ], [ 0 ], [] ] (RichText.Node.indexedFoldl nodePathList [] (RichText.Node.Block rootNode))
        , Test.test "Test that the nodes are passed in as expected" <|
            \_ -> Expect.equal [ "sample2", "sample1", "paragraph", "doc" ] (RichText.Node.indexedFoldl nodeNameOrTextValue [] (RichText.Node.Block rootNode))
        ]


testFoldl : Test
testFoldl =
    Test.describe "Tests that foldl works as expected"
        [ Test.test "Test that the nodes are passed in as expected" <|
            \_ -> Expect.equal [ "sample2", "sample1", "paragraph", "doc" ] (RichText.Node.foldl (nodeNameOrTextValue []) [] (RichText.Node.Block rootNode))
        ]


setAnnotations : String -> RichText.Node.Node -> RichText.Node.Node
setAnnotations mark node =
    let
        annotations =
            Set.singleton mark
    in
    case node of
        RichText.Node.Block bn ->
            let
                params =
                    RichText.Model.Node.element bn
            in
            RichText.Node.Block (bn |> RichText.Model.Node.withElement (params |> RichText.Model.Element.withAnnotations annotations))

        RichText.Node.Inline il ->
            case il of
                RichText.Model.Node.Text tl ->
                    RichText.Node.Inline (RichText.Model.Node.Text (tl |> RichText.Model.Text.withAnnotations annotations))

                RichText.Model.Node.InlineElement l ->
                    let
                        params =
                            RichText.Model.InlineElement.element l
                    in
                    RichText.Node.Inline (RichText.Model.Node.InlineElement (l |> RichText.Model.InlineElement.withElement (params |> RichText.Model.Element.withAnnotations annotations)))


dummyAnnotation =
    "__dummy__"


addDummyAnnotation : RichText.Node.Node -> RichText.Node.Node
addDummyAnnotation node =
    setAnnotations dummyAnnotation node


addPathAnnotation : RichText.Model.Node.Path -> RichText.Node.Node -> RichText.Node.Node
addPathAnnotation path node =
    let
        pathAnnotation =
            RichText.Model.Node.toString path
    in
    setAnnotations pathAnnotation node


rootNodeWithPathAnnotation =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.doc [] |> RichText.Model.Element.withAnnotations (Set.singleton ""))
        (RichText.Model.Node.blockChildren <|
            Array.fromList [ pHtmlNodeWithPathAnnotation ]
        )


pHtmlNodeWithPathAnnotation =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.paragraph [] |> RichText.Model.Element.withAnnotations (Set.singleton "0"))
        (RichText.Model.Node.inlineChildren <|
            Array.fromList [ textNode1WithPathAnnotation, textNode2WithPathAnnotation ]
        )


textNode1WithPathAnnotation =
    RichText.Model.Node.Text
        (RichText.Model.Text.empty
            |> RichText.Model.Text.withText "sample1"
            |> RichText.Model.Text.withAnnotations (Set.singleton "0:0")
        )


textNode2WithPathAnnotation =
    RichText.Model.Node.Text
        (RichText.Model.Text.empty
            |> RichText.Model.Text.withText "sample2"
            |> RichText.Model.Text.withAnnotations (Set.singleton "0:1")
        )


testIndexedMap : Test
testIndexedMap =
    Test.describe "Tests that indexedMap works as expected"
        [ Test.test "Test that node paths are passed in correctly" <|
            \_ ->
                Expect.equal (RichText.Node.Block rootNodeWithPathAnnotation)
                    (RichText.Node.indexedMap addPathAnnotation (RichText.Node.Block rootNode))
        ]


rootNodeWithSameAnnotation =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.doc [] |> RichText.Model.Element.withAnnotations (Set.singleton dummyAnnotation))
        (RichText.Model.Node.blockChildren <|
            Array.fromList [ pHtmlNodeWithSameAnnotation ]
        )


pHtmlNodeWithSameAnnotation =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.paragraph [] |> RichText.Model.Element.withAnnotations (Set.singleton dummyAnnotation))
        (RichText.Model.Node.inlineChildren <|
            Array.fromList [ textNode1WithSameAnnotation, textNode2WithSameAnnotation ]
        )


textNode1WithSameAnnotation =
    RichText.Model.Node.Text
        (RichText.Model.Text.empty
            |> RichText.Model.Text.withText "sample1"
            |> RichText.Model.Text.withAnnotations (Set.singleton dummyAnnotation)
        )


textNode2WithSameAnnotation =
    RichText.Model.Node.Text
        (RichText.Model.Text.empty
            |> RichText.Model.Text.withText "sample2"
            |> RichText.Model.Text.withAnnotations (Set.singleton dummyAnnotation)
        )


testMap : Test
testMap =
    Test.describe "Tests that map works as expected"
        [ Test.test "Test that nodes are correctly modified" <|
            \_ ->
                Expect.equal (RichText.Node.Block rootNodeWithSameAnnotation)
                    (RichText.Node.map addDummyAnnotation (RichText.Node.Block rootNode))
        ]


testFindTextBlockNodeAncestor : Test
testFindTextBlockNodeAncestor =
    Test.describe "Tests that findTextBlockNodeAncestor works as expected"
        [ Test.test "Tests that we can correct find a text block node ancestor" <|
            \_ ->
                Expect.equal (Just ( [ 0 ], pNode )) (RichText.Node.findTextBlockNodeAncestor [ 0, 0 ] rootNode)
        , Test.test "Tests that we return nothing if no text block can be found" <|
            \_ ->
                Expect.equal Nothing (RichText.Node.findTextBlockNodeAncestor [ 0 ] rootNode)
        ]


testFindAncestor : Test
testFindAncestor =
    Test.describe "Tests that findAncestor works as expected"
        [ Test.test "Tests that we can return the root if it's an ancestor" <|
            \_ ->
                Expect.equal
                    (Just ( [], rootNode ))
                    (RichText.Node.findAncestor
                        (\n -> RichText.Model.Element.name (RichText.Model.Node.element n) == "doc")
                        [ 0, 0 ]
                        rootNode
                    )
        ]


findNodeAtPath : RichText.Model.Node.Path -> RichText.Model.Node.Path -> RichText.Node.Node -> Bool
findNodeAtPath path1 path2 _ =
    path1 == path2


findNodeWithName : String -> RichText.Model.Node.Path -> RichText.Node.Node -> Bool
findNodeWithName name _ node =
    case node of
        RichText.Node.Block bn ->
            RichText.Model.Element.name (RichText.Model.Node.element bn) == name

        RichText.Node.Inline il ->
            case il of
                RichText.Model.Node.InlineElement l ->
                    RichText.Model.Element.name (RichText.Model.InlineElement.element l) == name

                _ ->
                    False


testFindBackwardFrom : Test
testFindBackwardFrom =
    Test.describe "Tests that findBackwardFrom works as expected"
        [ Test.test "Tests that the path is correctly passed in" <|
            \_ ->
                Expect.equal (Just ( [ 0, 0 ], RichText.Node.Inline textNode1 ))
                    (RichText.Node.findBackwardFrom (findNodeAtPath [ 0, 0 ]) [ 0, 1 ] rootNode)
        , Test.test "Tests that the function includes the passed in path" <|
            \_ ->
                Expect.equal (Just ( [ 0, 0 ], RichText.Node.Inline textNode1 ))
                    (RichText.Node.findBackwardFrom (findNodeAtPath [ 0, 0 ]) [ 0, 0 ] rootNode)
        , Test.test "Tests that the function returns Nothing if nothing is found" <|
            \_ ->
                Expect.equal Nothing
                    (RichText.Node.findBackwardFrom (findNodeAtPath [ 1, 0 ]) [ 0, 1 ] rootNode)
        , Test.test "Tests that the function passes in the node parameter correctly" <|
            \_ ->
                Expect.equal (Just ( [], RichText.Node.Block rootNode ))
                    (RichText.Node.findBackwardFrom (findNodeWithName "doc") [ 0, 1 ] rootNode)
        ]


testFindBackwardFromExclusive : Test
testFindBackwardFromExclusive =
    Test.describe "Tests that findBackwardFromExclusive works as expected"
        [ Test.test "Tests that the path is correctly passed in" <|
            \_ ->
                Expect.equal (Just ( [ 0, 0 ], RichText.Node.Inline textNode1 ))
                    (RichText.Node.findBackwardFromExclusive (findNodeAtPath [ 0, 0 ]) [ 0, 1 ] rootNode)
        , Test.test "Tests that the function excludes the passed in path" <|
            \_ ->
                Expect.equal Nothing
                    (RichText.Node.findBackwardFromExclusive (findNodeAtPath [ 0, 0 ]) [ 0, 0 ] rootNode)
        , Test.test "Tests that the function returns Nothing if nothing is found" <|
            \_ ->
                Expect.equal Nothing
                    (RichText.Node.findBackwardFromExclusive (findNodeAtPath [ 1, 0 ]) [ 0, 1 ] rootNode)
        , Test.test "Tests that the function passes in the node parameter correctly" <|
            \_ ->
                Expect.equal (Just ( [], RichText.Node.Block rootNode ))
                    (RichText.Node.findBackwardFromExclusive (findNodeWithName "doc") [ 0, 1 ] rootNode)
        ]


testFindForwardFrom : Test
testFindForwardFrom =
    Test.describe "Tests that findNodeForwardFrom works as expected"
        [ Test.test "Tests that the path is correctly passed in" <|
            \_ ->
                Expect.equal (Just ( [ 0, 0 ], RichText.Node.Inline textNode1 ))
                    (RichText.Node.findForwardFrom (findNodeAtPath [ 0, 0 ]) [ 0 ] rootNode)
        , Test.test "Tests that the function includes the passed in path" <|
            \_ ->
                Expect.equal (Just ( [ 0, 0 ], RichText.Node.Inline textNode1 ))
                    (RichText.Node.findForwardFrom (findNodeAtPath [ 0, 0 ]) [ 0, 0 ] rootNode)
        , Test.test "Tests that the function returns Nothing if nothing is found" <|
            \_ ->
                Expect.equal Nothing
                    (RichText.Node.findForwardFrom (findNodeAtPath [ 1, 0 ]) [ 0, 1 ] rootNode)
        , Test.test "Tests that the function passes in the node parameter correctly" <|
            \_ ->
                Expect.equal (Just ( [], RichText.Node.Block rootNode ))
                    (RichText.Node.findForwardFrom (findNodeWithName "doc") [] rootNode)
        ]


testFindForwardFromExclusive : Test
testFindForwardFromExclusive =
    Test.describe "Tests that findNodeForwardFromExclusive works as expected"
        [ Test.test "Tests that the path is correctly passed in" <|
            \_ ->
                Expect.equal (Just ( [ 0, 0 ], RichText.Node.Inline textNode1 ))
                    (RichText.Node.findForwardFromExclusive (findNodeAtPath [ 0, 0 ]) [ 0 ] rootNode)
        , Test.test "Tests that the function excludes the passed in path" <|
            \_ ->
                Expect.equal Nothing
                    (RichText.Node.findForwardFromExclusive (findNodeAtPath [ 0, 0 ]) [ 0, 0 ] rootNode)
        , Test.test "Tests that the function returns Nothing if nothing is found" <|
            \_ ->
                Expect.equal Nothing
                    (RichText.Node.findForwardFromExclusive (findNodeAtPath [ 1, 0 ]) [ 0, 1 ] rootNode)
        , Test.test "Tests that the function passes in the node parameter correctly" <|
            \_ ->
                Expect.equal (Just ( [ 0 ], RichText.Node.Block pNode ))
                    (RichText.Node.findForwardFromExclusive (findNodeWithName "paragraph") [] rootNode)
        ]


testNext : Test
testNext =
    Test.describe "Tests that next works as expected"
        [ Test.test "Tests that we receive the next element from root" <|
            \_ ->
                Expect.equal (Just ( [ 0 ], RichText.Node.Block pNode ))
                    (RichText.Node.next [] rootNode)
        , Test.test "Tests that we receive nothing after the last node" <|
            \_ ->
                Expect.equal Nothing
                    (RichText.Node.next [ 0, 1 ] rootNode)
        ]


testPrevious : Test
testPrevious =
    Test.describe "Tests that previous works as expected"
        [ Test.test "Tests that we receive the previous element from root" <|
            \_ ->
                Expect.equal (Just ( [], RichText.Node.Block rootNode ))
                    (RichText.Node.previous [ 0 ] rootNode)
        , Test.test "Tests that we receive nothing before the root node" <|
            \_ ->
                Expect.equal Nothing
                    (RichText.Node.previous [] rootNode)
        ]


removedRootNode : RichText.Model.Node.Block
removedRootNode =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.doc [])
        (RichText.Model.Node.blockChildren <|
            Array.fromList [ removedPHtmlNode ]
        )


removedPHtmlNode : RichText.Model.Node.Block
removedPHtmlNode =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.paragraph [])
        (RichText.Model.Node.inlineChildren <|
            Array.fromList [ textNode2 ]
        )


removedRootAll : RichText.Model.Node.Block
removedRootAll =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.doc [])
        (RichText.Model.Node.blockChildren Array.empty)


removedPHtmlNodeAll : RichText.Model.Node.Block
removedPHtmlNodeAll =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.paragraph [])
        (RichText.Model.Node.inlineChildren Array.empty)


removedRootNodeRemovedPNodeAll : RichText.Model.Node.Block
removedRootNodeRemovedPNodeAll =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.doc [])
        (RichText.Model.Node.blockChildren <|
            Array.fromList [ removedPHtmlNodeAll ]
        )


testRemoveNodeAndEmptyParents : Test
testRemoveNodeAndEmptyParents =
    Test.describe "Tests that removeNodeAndEmptyParents works as expected"
        [ Test.test "Tests that we can remove a text node properly" <|
            \_ ->
                Expect.equal removedRootNode
                    (RichText.Node.removeNodeAndEmptyParents [ 0, 0 ] rootNode)
        , Test.test "Tests that we remove parents properly" <|
            \_ ->
                Expect.equal removedRootAll
                    (RichText.Node.removeNodeAndEmptyParents [ 0, 0 ] removedRootNode)
        ]


testRemoveInRange : Test
testRemoveInRange =
    Test.describe "Tests that removeInRange works as expected"
        [ Test.test "Tests that we remove elements we want" <|
            \_ ->
                Expect.equal removedRootAll
                    (RichText.Node.removeInRange [ 0 ] [ 0 ] rootNode)
        , Test.test "Tests that we remove elements we want, part ii" <|
            \_ ->
                Expect.equal removedRootNodeRemovedPNodeAll
                    (RichText.Node.removeInRange [ 0, 0 ] [ 0, 1 ] rootNode)
        ]


replaceRootPNode =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.doc [])
        (RichText.Model.Node.blockChildren <| Array.fromList [ replacePNode ])


replacePNode =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.paragraph [])
        (RichText.Model.Node.inlineChildren <|
            Array.fromList [ textNode2, textNode2 ]
        )


testReplace : Test
testReplace =
    Test.describe "Tests that replace works as expected"
        [ Test.test "Tests that we replace the element we want" <|
            \_ ->
                Expect.equal (Ok replaceRootPNode)
                    (RichText.Node.replace [ 0, 0 ] (RichText.Node.Inline textNode2) rootNode)
        ]


testReplaceWithFragment : Test
testReplaceWithFragment =
    Test.describe "Tests that replaceWithFragment works as expected"
        [ Test.test "Tests that we replace the element we want" <|
            \_ ->
                Expect.equal (Ok replaceRootPNode)
                    (RichText.Node.replaceWithFragment [ 0, 0 ] (RichText.Node.InlineFragment <| Array.fromList [ textNode2 ]) rootNode)
        ]


testAllRange : Test
testAllRange =
    Test.describe "Tests that allRange works as expected"
        [ Test.test "Tests that an empty range returns true" <|
            \_ -> Expect.equal True <| RichText.Node.allRange (\_ -> False) [ 0, 1 ] [ 0, 0 ] rootNode
        , Test.test "Tests that a single node range works as expected" <|
            \_ -> Expect.equal True <| RichText.Node.allRange (\node -> node == RichText.Node.Block pNode) [ 0 ] [ 0 ] rootNode
        , Test.test "Tests that a node range with one false returns False" <|
            \_ -> Expect.equal False <| RichText.Node.allRange (\node -> node == RichText.Node.Block pNode) [ 0 ] [ 0, 0 ] rootNode
        ]


testAnyRange : Test
testAnyRange =
    Test.describe "Tests that anyRange works as expected"
        [ Test.test "Tests that an empty range returns false" <|
            \_ -> Expect.equal False <| RichText.Node.anyRange (\_ -> False) [ 0, 1 ] [ 0, 0 ] rootNode
        , Test.test "Tests that a single node range works as expected" <|
            \_ -> Expect.equal True <| RichText.Node.anyRange (\node -> node == RichText.Node.Block pNode) [ 0 ] [ 0 ] rootNode
        , Test.test "Tests that a node range with one true value returns True" <|
            \_ -> Expect.equal True <| RichText.Node.anyRange (\node -> node == RichText.Node.Block pNode) [ 0 ] [ 0, 0 ] rootNode
        , Test.test "Tests that a node range with no true values returns False" <|
            \_ -> Expect.equal False <| RichText.Node.anyRange (\_ -> False) [ 0 ] [ 0, 1 ] rootNode
        ]


doubleRoot : RichText.Model.Node.Block
doubleRoot =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.doc [])
        (RichText.Model.Node.blockChildren <|
            Array.fromList [ doublePNode, doublePNode ]
        )


doublePNode : RichText.Model.Node.Block
doublePNode =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.paragraph [])
        (RichText.Model.Node.inlineChildren <|
            Array.fromList [ textNode1, textNode1, textNode2, textNode2 ]
        )


testConcatMap : Test
testConcatMap =
    Test.describe "Tests that concatMap works as expected"
        [ Test.test "Tests that the identity function returns the same node" <|
            \_ ->
                Expect.equal rootNode <| RichText.Node.concatMap (\node -> [ node ]) rootNode
        , Test.test "Tests that the double function returns the expected tree" <|
            \_ -> Expect.equal doubleRoot <| RichText.Node.concatMap (\node -> [ node, node ]) rootNode
        ]


nodeBeforeTextLeafSplit =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.paragraph [])
        (RichText.Model.Node.inlineChildren <|
            Array.fromList [ RichText.Model.Node.plainText "sam" ]
        )


nodeAfterTextLeafSplit =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.paragraph [])
        (RichText.Model.Node.inlineChildren <|
            Array.fromList [ RichText.Model.Node.plainText "ple1" ]
        )


nodeWithTextLeafToSplit =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.paragraph [])
        (RichText.Model.Node.inlineChildren <|
            Array.fromList [ textNode1 ]
        )


inlineImg =
    RichText.Model.Node.inlineElement (RichText.Model.Element.element RichText.Definitions.image []) []


nodeAfterInlineLeafSplit =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.paragraph [])
        (RichText.Model.Node.inlineChildren <|
            Array.fromList [ inlineImg ]
        )


nodeBeforeInlineLeafSplit =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.paragraph [])
        (RichText.Model.Node.inlineChildren Array.empty)


nodeWithInlineLeafToSplit =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.paragraph [])
        (RichText.Model.Node.inlineChildren <| Array.fromList [ inlineImg ])


testSplitBlockAtPathAndOffset : Test
testSplitBlockAtPathAndOffset =
    Test.describe "Tests that testSplitBlockAtPathAndOffset works as expected"
        [ Test.test "Tests that you cannot split a block at an invalid path" <|
            \_ -> Expect.equal Nothing <| RichText.Node.splitBlockAtPathAndOffset [ 1 ] 0 rootNode
        , Test.test "Tests that splitting a block node uses the offset to split before" <|
            \_ -> Expect.equal (Just ( removedRootAll, rootNode )) <| RichText.Node.splitBlockAtPathAndOffset [] 0 rootNode
        , Test.test "Tests that splitting a block node uses the offset to split after" <|
            \_ -> Expect.equal (Just ( rootNode, removedRootAll )) <| RichText.Node.splitBlockAtPathAndOffset [] 1 rootNode
        , Test.test "Tests that splitting a text leaf works correctly" <|
            \_ -> Expect.equal (Just ( nodeBeforeTextLeafSplit, nodeAfterTextLeafSplit )) <| RichText.Node.splitBlockAtPathAndOffset [ 0 ] 3 nodeWithTextLeafToSplit
        , Test.test "Tests that splitting an inline leaf works correctly" <|
            \_ -> Expect.equal (Just ( nodeBeforeInlineLeafSplit, nodeAfterInlineLeafSplit )) <| RichText.Node.splitBlockAtPathAndOffset [ 0 ] 0 nodeWithInlineLeafToSplit
        ]


testSplitTextLeaf : Test
testSplitTextLeaf =
    Test.describe "Tests that splitTextLeaf works as expected"
        [ Test.test "Tests that splitting a text leaf works as expected" <|
            \_ ->
                Expect.equal
                    ( RichText.Model.Text.empty |> RichText.Model.Text.withText "sam"
                    , RichText.Model.Text.empty |> RichText.Model.Text.withText "ple1"
                    )
                <|
                    RichText.Node.splitTextLeaf 3 (RichText.Model.Text.empty |> RichText.Model.Text.withText "sample1")
        ]


hrNode : RichText.Model.Node.Block
hrNode =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.horizontalRule [])
        RichText.Model.Node.Leaf


testFindLastPath : Test
testFindLastPath =
    Test.describe "Tests that findLastPath works as expected"
        [ Test.test "If this is a leaf node, it should return the root path" <|
            \_ ->
                Expect.equal ( [], RichText.Node.Block hrNode ) (RichText.Node.last hrNode)
        , Test.test "If this is a node with inline children, it should return the last path correctly" <|
            \_ ->
                Expect.equal ( [ 1 ], RichText.Node.Inline textNode2 ) (RichText.Node.last pNode)
        , Test.test "If this is a node with block children, it should return the last path correctly" <|
            \_ ->
                Expect.equal ( [ 0, 1 ], RichText.Node.Inline textNode2 ) (RichText.Node.last rootNode)
        ]


testFoldlRange : Test
testFoldlRange =
    Test.describe "Tests that foldlRange works as expected"
        [ Test.test "Test that a range query works correctly" <|
            \_ -> Expect.equal [ "sample2", "sample1", "paragraph" ] (RichText.Node.foldlRange [ 0 ] [ 0, 1 ] (nodeNameOrTextValue []) [] rootNode)
        , Test.test "Test that something outside of range does nothing" <|
            \_ -> Expect.equal [] (RichText.Node.foldlRange [ 1 ] [ 1, 1 ] (nodeNameOrTextValue []) [] rootNode)
        , Test.test "Test that an invalid range does nothing" <|
            \_ -> Expect.equal [] (RichText.Node.foldlRange [ 1 ] [ 0 ] (nodeNameOrTextValue []) [] rootNode)
        ]


testFoldrRange : Test
testFoldrRange =
    Test.describe "Tests that foldrRange works as expected"
        [ Test.test "Test that a range query works correctly" <|
            \_ -> Expect.equal [ "paragraph", "sample1", "sample2" ] (RichText.Node.foldrRange [ 0 ] [ 0, 1 ] (nodeNameOrTextValue []) [] rootNode)
        , Test.test "Test that something outside of range does nothing" <|
            \_ -> Expect.equal [] (RichText.Node.foldrRange [ 1 ] [ 1, 1 ] (nodeNameOrTextValue []) [] rootNode)
        , Test.test "Test that an invalid range does nothing" <|
            \_ -> Expect.equal [] (RichText.Node.foldrRange [ 1 ] [ 0 ] (nodeNameOrTextValue []) [] rootNode)
        ]


inlineInsertFragment =
    RichText.Node.InlineFragment (Array.fromList [ textNode1, textNode2 ])


blockInsertFragment =
    RichText.Node.BlockFragment (Array.fromList [ hrNode ])


expectedInsertBeforeBlock : RichText.Model.Node.Block
expectedInsertBeforeBlock =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.doc [])
        (RichText.Model.Node.blockChildren <| Array.fromList [ hrNode, pNode ])


expectedInsertBeforeInline : RichText.Model.Node.Block
expectedInsertBeforeInline =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.doc [])
        (RichText.Model.Node.blockChildren <| Array.fromList [ pNodeExpectedBeforeInline ])


pNodeExpectedBeforeInline : RichText.Model.Node.Block
pNodeExpectedBeforeInline =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.paragraph [])
        (RichText.Model.Node.inlineChildren <|
            Array.fromList [ textNode1, textNode2, textNode1, textNode2 ]
        )


testInsertBefore : Test
testInsertBefore =
    Test.describe "Tests that insertBefore works as expected"
        [ Test.test "Make sure that we can insert an inline fragment" <|
            \_ ->
                Expect.equal (Ok expectedInsertBeforeInline)
                    (RichText.Node.insertBefore [ 0, 0 ] inlineInsertFragment rootNode)
        , Test.test "Make sure that we can insert a block fragment" <|
            \_ ->
                Expect.equal (Ok expectedInsertBeforeBlock)
                    (RichText.Node.insertBefore [ 0 ] blockInsertFragment rootNode)
        , Test.test "Invalid paths should result in an error" <|
            \_ ->
                Expect.equal
                    (Err "There is no node at this path")
                    (RichText.Node.insertBefore [ 0, 9 ] inlineInsertFragment rootNode)
        , Test.test "Trying to insert a block fragment into an inline array should result in an error" <|
            \_ ->
                Expect.equal
                    (Err "I cannot insert a block node fragment into an inline leaf fragment")
                    (RichText.Node.insertBefore [ 0, 0 ] blockInsertFragment rootNode)
        , Test.test "Trying to insert an inline fragment into a block array should result in an error" <|
            \_ ->
                Expect.equal
                    (Err "I cannot insert an inline leaf fragment fragment into a block node fragment")
                    (RichText.Node.insertBefore [ 0 ] inlineInsertFragment rootNode)
        ]


expectedInsertAfterBlock : RichText.Model.Node.Block
expectedInsertAfterBlock =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.doc [])
        (RichText.Model.Node.blockChildren <| Array.fromList [ pNode, hrNode ])


expectedInsertAfterInline : RichText.Model.Node.Block
expectedInsertAfterInline =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.doc [])
        (RichText.Model.Node.blockChildren <| Array.fromList [ pNodeExpectedAfterInline ])


pNodeExpectedAfterInline : RichText.Model.Node.Block
pNodeExpectedAfterInline =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.paragraph [])
        (RichText.Model.Node.inlineChildren <|
            Array.fromList [ textNode1, textNode1, textNode2, textNode2 ]
        )


testInsertAfter : Test
testInsertAfter =
    Test.describe "Tests that insertAfter works as expected"
        [ Test.test "Make sure that we can insert an inline fragment" <|
            \_ ->
                Expect.equal (Ok expectedInsertAfterInline)
                    (RichText.Node.insertAfter [ 0, 0 ] inlineInsertFragment rootNode)
        , Test.test "Make sure that we can insert a block fragment" <|
            \_ ->
                Expect.equal (Ok expectedInsertAfterBlock)
                    (RichText.Node.insertAfter [ 0 ] blockInsertFragment rootNode)
        , Test.test "Invalid paths should result in an error" <|
            \_ ->
                Expect.equal
                    (Err "There is no node at this path")
                    (RichText.Node.insertAfter [ 0, 9 ] inlineInsertFragment rootNode)
        , Test.test "Trying to insert a block fragment into an inline array should result in an error" <|
            \_ ->
                Expect.equal
                    (Err "I cannot insert a block node fragment into an inline leaf fragment")
                    (RichText.Node.insertAfter [ 0, 0 ] blockInsertFragment rootNode)
        , Test.test "Trying to insert an inline fragment into a block array should result in an error" <|
            \_ ->
                Expect.equal
                    (Err "I cannot insert an inline leaf fragment fragment into a block node fragment")
                    (RichText.Node.insertAfter [ 0 ] inlineInsertFragment rootNode)
        ]


pNodeReverse : RichText.Model.Node.Block
pNodeReverse =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.paragraph [])
        (RichText.Model.Node.inlineChildren <|
            Array.fromList [ textNode2, textNode1 ]
        )


pNodeExpectedJoin : RichText.Model.Node.Block
pNodeExpectedJoin =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.paragraph [])
        (RichText.Model.Node.inlineChildren <|
            Array.fromList [ textNode1, textNode2, textNode2, textNode1 ]
        )


rootWithReversePNode : RichText.Model.Node.Block
rootWithReversePNode =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.doc [])
        (RichText.Model.Node.blockChildren <|
            Array.fromList [ pNodeReverse ]
        )


rootAfterJoin : RichText.Model.Node.Block
rootAfterJoin =
    RichText.Model.Node.block
        (RichText.Model.Element.element RichText.Definitions.doc [])
        (RichText.Model.Node.blockChildren <|
            Array.fromList [ pNode, pNodeReverse ]
        )


testJoinBlocks : Test
testJoinBlocks =
    Test.describe "Tests that joinBlocks works as expected"
        [ Test.test "Make sure that joining two blocks with inline content works as expected" <|
            \_ ->
                Expect.equal (Just pNodeExpectedJoin) (RichText.Node.joinBlocks pNode pNodeReverse)
        , Test.test "Make sure that joining two blocks with block content works as expected" <|
            \_ ->
                Expect.equal (Just rootAfterJoin) (RichText.Node.joinBlocks rootNode rootWithReversePNode)
        , Test.test "Joining a block with a leaf should result in nothing" <|
            \_ ->
                Expect.equal Nothing (RichText.Node.joinBlocks hrNode rootNode)
        , Test.test "Joining block children with inline children should result in nothing" <|
            \_ ->
                Expect.equal Nothing (RichText.Node.joinBlocks pNode rootNode)
        ]
