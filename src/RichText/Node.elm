module RichText.Node exposing
    ( insertAfter, insertBefore, replace, replaceWithFragment
    , removeInRange, removeNodeAndEmptyParents
    , allRange, anyRange, isEmptyTextBlock, selectionIsBeginningOfTextBlock, selectionIsEndOfTextBlock
    , concatMap, indexedMap, joinBlocks, map
    , Iterator, last, next, nodeAt, previous, findAncestor, findBackwardFrom, findBackwardFromExclusive, findClosestBlockPath, findForwardFrom, findForwardFromExclusive, findTextBlockNodeAncestor
    , foldl, foldlRange, foldr, foldrRange, indexedFoldl, indexedFoldr
    , splitBlockAtPathAndOffset, splitTextLeaf
    , toggleMark
    , Fragment(..), Node(..)
    )

{-| This module contains convenience functions for working with `Block` and `Inline` nodes.


# Insert / Replace

@docs insertAfter, insertBefore, replace, replaceWithFragment


# Remove

@docs removeInRange, removeNodeAndEmptyParents


# Predicates

@docs allRange, anyRange, isEmptyTextBlock, selectionIsBeginningOfTextBlock, selectionIsEndOfTextBlock


# Transform

@docs concatMap, indexedMap, joinBlocks, map


# Searching

@docs Iterator, last, next, nodeAt, previous, findAncestor, findBackwardFrom, findBackwardFromExclusive, findClosestBlockPath, findForwardFrom, findForwardFromExclusive, findTextBlockNodeAncestor


# Folds

@docs foldl, foldlRange, foldr, foldrRange, indexedFoldl, indexedFoldr


# Split

@docs splitBlockAtPathAndOffset, splitTextLeaf


# Marks

@docs toggleMark


# Types

These are convenience types to wrap around inline and block node and arrays

@docs Fragment, Node

-}

import Array exposing (Array)
import Array.Extra
import List.Extra
import RichText.Model.InlineElement
import RichText.Model.Mark
import RichText.Model.Node
    exposing
        ( Block
        , Children(..)
        , Inline(..)
        , Path
        , blockChildren
        , childNodes
        , inlineChildren
        , parent
        )
import RichText.Model.Selection
import RichText.Model.Text


{-| Node represents either a `Block` or `Inline`. It's a convenience type that wraps an argument
or return value of a function that can use either block or inline, like `nodeAt` or `replace`.
-}
type Node
    = Block Block
    | Inline Inline


{-| A `Fragment` represents an array of `Block` or `Inline` nodes. It's a convenience type used
for things like insertion or deserialization.
-}
type Fragment
    = BlockFragment (Array Block)
    | InlineFragment (Array Inline)


{-| Returns the last path and node in the block.

    ( lastPath, lastNode ) =
        last node

-}
last : Block -> ( Path, Node )
last node =
    case childNodes node of
        BlockChildren a ->
            let
                arr : Array Block
                arr =
                    RichText.Model.Node.toBlockArray a

                lastIndex : Int
                lastIndex =
                    Array.length arr - 1
            in
            case Array.get lastIndex arr of
                Nothing ->
                    ( [], Block node )

                Just b ->
                    let
                        ( p, n ) =
                            last b
                    in
                    ( lastIndex :: p, n )

        InlineChildren a ->
            let
                array : Array Inline
                array =
                    RichText.Model.Node.toInlineArray a

                lastIndex : Int
                lastIndex =
                    Array.length array - 1
            in
            case Array.get lastIndex array of
                Nothing ->
                    ( [], Block node )

                Just l ->
                    ( [ lastIndex ], Inline l )

        Leaf ->
            ( [], Block node )


{-| Type alias for a function that takes a path and a root block and returns a path and node. Useful
for generalizing functions like previous and next that can iterate through a Block.
-}
type alias Iterator =
    Path -> Block -> Maybe ( Path, Node )


{-| Returns the previous path and node, if one exists, relative to the given path.

    rootNode : Block
    rootNode =
        block
            (Element.element doc [])
            (RichText.Model.Node.blockChildren <| Array.fromList [ pNode ])

    pNode : Block
    pNode =
        block
            (Element.element paragraph [])
            (inlineChildren <|
                Array.fromList [ textNode1, textNode2 ]
            )

    textNode1 : Inline
    textNode1 =
        plainText "sample1"

    textNode2 : Inline
    textNode2 =
        plainText "sample2"

    previous [0, 1] rootNode == Just ([0, 0], Inline textNode1)

-}
previous : Iterator
previous path node =
    case path of
        [] ->
            Nothing

        [ x ] ->
            let
                prevIndex : Int
                prevIndex =
                    x - 1
            in
            case childNodes node of
                BlockChildren a ->
                    case Array.get prevIndex (RichText.Model.Node.toBlockArray a) of
                        Nothing ->
                            Just ( [], Block node )

                        Just b ->
                            let
                                ( p, n ) =
                                    last b
                            in
                            Just ( prevIndex :: p, n )

                InlineChildren a ->
                    case Array.get prevIndex (RichText.Model.Node.toInlineArray a) of
                        Nothing ->
                            Just ( [], Block node )

                        Just l ->
                            Just ( [ prevIndex ], Inline l )

                Leaf ->
                    Just ( [], Block node )

        x :: xs ->
            case childNodes node of
                BlockChildren a ->
                    case Array.get x (RichText.Model.Node.toBlockArray a) of
                        Nothing ->
                            Nothing

                        Just b ->
                            case previous xs b of
                                Nothing ->
                                    Just ( [ x ], Block b )

                                Just ( p, n ) ->
                                    Just ( x :: p, n )

                InlineChildren a ->
                    case Array.get (x - 1) (RichText.Model.Node.toInlineArray a) of
                        Nothing ->
                            Just ( [], Block node )

                        Just l ->
                            Just ( [ x - 1 ], Inline l )

                Leaf ->
                    Nothing


{-| Returns the next path and node, if one exists, relative to the given path.

    rootNode : Block
    rootNode =
        block
            (Element.element doc [])
            (RichText.Model.Node.blockChildren <| Array.fromList [ pNode ])

    pNode : Block
    pNode =
        block
            (Element.element paragraph [])
            (inlineChildren <|
                Array.fromList [ textNode1, textNode2 ]
            )

    textNode1 : Inline
    textNode1 =
        plainText "sample1"

    textNode2 : Inline
    textNode2 =
        plainText "sample2"

    next [0, 0] rootNode == Just ([0, 1], Inline textNode2)

-}
next : Iterator
next path node =
    case path of
        [] ->
            case childNodes node of
                BlockChildren a ->
                    case Array.get 0 (RichText.Model.Node.toBlockArray a) of
                        Nothing ->
                            Nothing

                        Just b ->
                            Just ( [ 0 ], Block b )

                InlineChildren a ->
                    case Array.get 0 (RichText.Model.Node.toInlineArray a) of
                        Nothing ->
                            Nothing

                        Just b ->
                            Just ( [ 0 ], Inline b )

                Leaf ->
                    Nothing

        x :: xs ->
            case childNodes node of
                BlockChildren a ->
                    let
                        arr : Array Block
                        arr =
                            RichText.Model.Node.toBlockArray a
                    in
                    case Array.get x arr of
                        Nothing ->
                            Nothing

                        Just b ->
                            case next xs b of
                                Nothing ->
                                    case Array.get (x + 1) arr of
                                        Nothing ->
                                            Nothing

                                        Just bNext ->
                                            Just ( [ x + 1 ], Block bNext )

                                Just ( p, n ) ->
                                    Just ( x :: p, n )

                InlineChildren a ->
                    case Array.get (x + 1) (RichText.Model.Node.toInlineArray a) of
                        Nothing ->
                            Nothing

                        Just b ->
                            Just ( [ x + 1 ], Inline b )

                Leaf ->
                    Nothing


{-| Starting from the given path, scans the node forward until the predicate
has been met or it reaches the last node.
-}
findForwardFrom : (Path -> Node -> Bool) -> Path -> Block -> Maybe ( Path, Node )
findForwardFrom =
    findNodeFrom next


{-| Starting from but excluding the given path, scans the node forward until
the predicate has been met or it reaches the last node.
-}
findForwardFromExclusive : (Path -> Node -> Bool) -> Path -> Block -> Maybe ( Path, Node )
findForwardFromExclusive =
    findNodeFromExclusive next


{-| Starting from the given path, scans the node backward until the predicate
has been met or it reaches the last node.
-}
findBackwardFrom : (Path -> Node -> Bool) -> Path -> Block -> Maybe ( Path, Node )
findBackwardFrom =
    findNodeFrom previous


{-| Starting from but excluding the given path, scans the node backward until the predicate
has been met or it reaches the last node.
-}
findBackwardFromExclusive : (Path -> Node -> Bool) -> Path -> Block -> Maybe ( Path, Node )
findBackwardFromExclusive =
    findNodeFromExclusive previous


findNodeFromExclusive : Iterator -> (Path -> Node -> Bool) -> Path -> Block -> Maybe ( Path, Node )
findNodeFromExclusive iterator pred path node =
    case iterator path node of
        Nothing ->
            Nothing

        Just ( nextPath, _ ) ->
            findNodeFrom iterator pred nextPath node


findNodeFrom : Iterator -> (Path -> Node -> Bool) -> Path -> Block -> Maybe ( Path, Node )
findNodeFrom iterator pred path node =
    case nodeAt path node of
        Just n ->
            if pred path n then
                Just ( path, n )

            else
                findNodeFromExclusive iterator pred path node

        Nothing ->
            Nothing


{-| Map a given function onto a block's children recursively and flatten the resulting list.

    rootNode : Block
    rootNode =
        block
            (Element.element doc [])
            (RichText.Model.Node.blockChildren <| Array.fromList [ pNode ])

    pNode : Block
    pNode =
        block
            (Element.element paragraph [])
            (inlineChildren <|
                Array.fromList [ textNode1, textNode2 ]
            )

    textNode1 : Inline
    textNode1 =
        plainText "sample1"

    textNode2 : Inline
    textNode2 =
        plainText "sample2"

    doubleRoot : Block
    doubleRoot =
        block
            (Element.element doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList [ doublePNode, doublePNode ]
            )

    doublePNode : Block
    doublePNode =
        block
            (Element.element paragraph [])
            (inlineChildren <|
                Array.fromList [ textNode1, textNode1, textNode2, textNode2 ]
            )

    concatMap (\node -> [ node, node ]) rootNode == doubleRoot
    --> True

-}
concatMap : (Node -> List Node) -> Block -> Block
concatMap func node =
    let
        newChildren : Children
        newChildren =
            case childNodes node of
                Leaf ->
                    Leaf

                BlockChildren a ->
                    a
                        |> RichText.Model.Node.toBlockArray
                        |> Array.toList
                        |> List.map Block
                        |> List.concatMap func
                        |> List.concatMap
                            (\x ->
                                case x of
                                    Block v ->
                                        [ v ]

                                    Inline _ ->
                                        []
                            )
                        |> List.map (concatMap func)
                        |> Array.fromList
                        |> RichText.Model.Node.blockChildren

                InlineChildren a ->
                    a
                        |> RichText.Model.Node.toInlineArray
                        |> Array.toList
                        |> List.map Inline
                        |> List.concatMap func
                        |> List.concatMap
                            (\x ->
                                case x of
                                    Block _ ->
                                        []

                                    Inline v ->
                                        [ v ]
                            )
                        |> Array.fromList
                        |> inlineChildren
    in
    node |> RichText.Model.Node.withChildNodes newChildren


{-| Apply a function to this node and all child nodes.

    setAnnotations : String -> Node -> Node
    setAnnotations mark node =
        let
            annotations =
                Set.fromList [ mark ]
        in
        case node of
            Block bn ->
                let
                    params =
                        Node.element bn
                in
                Block (bn |> withElement (params |> Element.withAnnotations annotations))

            Inline il ->
                case il of
                    Text tl ->
                        Inline (Text (tl |> RichText.Model.Text.withAnnotations annotations))

                    InlineElement l ->
                        let
                            params =
                                RichText.Model.InlineElement.element l
                        in
                        Inline (InlineElement (l |> RichText.Model.InlineElement.withElement (params |> Element.withAnnotations annotations)))

    setDummyAnnotation : Node -> Node
    setDummyAnnotation node =
        setAnnotations dummyAnnotation node

    map setDummyAnnotation (Block rootNode)
    --> Recursively adds a dummy annotation to rootNode and all its children

-}
map : (Node -> Node) -> Node -> Node
map func node =
    case func node of
        Block blockNode ->
            Block <|
                (blockNode
                    |> RichText.Model.Node.withChildNodes
                        (case childNodes blockNode of
                            BlockChildren a ->
                                RichText.Model.Node.blockChildren <|
                                    Array.map
                                        (\v ->
                                            case map func (Block v) of
                                                Block b ->
                                                    b

                                                _ ->
                                                    v
                                        )
                                        (RichText.Model.Node.toBlockArray a)

                            InlineChildren a ->
                                inlineChildren <|
                                    Array.map
                                        (\v ->
                                            case map func (Inline v) of
                                                Inline b ->
                                                    b

                                                _ ->
                                                    v
                                        )
                                        (RichText.Model.Node.toInlineArray a)

                            Leaf ->
                                Leaf
                        )
                )

        Inline inlineLeaf ->
            Inline inlineLeaf


{-| Same as map but the function is also applied with the path of each element (starting at []).

    indexedMap
        (\path node ->
            if path == [ 0, 0 ] then
                text2

            else
                node
        )
        (Block rootNode)
    --> replaces the node at [0, 0] with the text2 node

-}
indexedMap : (Path -> Node -> Node) -> Node -> Node
indexedMap =
    indexedMapRec []


indexedMapRec : Path -> (Path -> Node -> Node) -> Node -> Node
indexedMapRec path func node =
    case func path node of
        Block blockNode ->
            let
                cn : Children
                cn =
                    case childNodes blockNode of
                        BlockChildren a ->
                            RichText.Model.Node.blockChildren <|
                                Array.indexedMap
                                    (\i v ->
                                        case indexedMapRec (path ++ [ i ]) func (Block v) of
                                            Block b ->
                                                b

                                            _ ->
                                                v
                                    )
                                    (RichText.Model.Node.toBlockArray a)

                        InlineChildren a ->
                            inlineChildren <|
                                Array.indexedMap
                                    (\i v ->
                                        case indexedMapRec (path ++ [ i ]) func (Inline v) of
                                            Inline b ->
                                                b

                                            _ ->
                                                v
                                    )
                                    (RichText.Model.Node.toInlineArray a)

                        Leaf ->
                            Leaf
            in
            Block (blockNode |> RichText.Model.Node.withChildNodes cn)

        Inline inlineLeaf ->
            Inline inlineLeaf


{-| Reduce a node from the bottom right (e.g. from last to first).

    nodeNameOrTextValue : Node -> List String -> List String
    nodeNameOrTextValue node list =
        (case node of
            Block bn ->
                Element.name (Node.element bn)

            Inline il ->
                case il of
                    Text tl ->
                        RichText.Model.Text.text tl

                    InlineElement p ->
                        Element.name (RichText.Model.InlineElement.element p)
        )
            :: list

    foldr nodeNameOrTextValue [] (Block rootNode)
    --> [ "doc", "paragraph", "sample1", "sample2" ]

-}
foldr : (Node -> b -> b) -> b -> Node -> b
foldr func acc node =
    func
        node
        (case node of
            Block blockNode ->
                let
                    children : Array Node
                    children =
                        case childNodes blockNode of
                            Leaf ->
                                Array.empty

                            InlineChildren a ->
                                Array.map Inline (RichText.Model.Node.toInlineArray a)

                            BlockChildren a ->
                                Array.map Block (RichText.Model.Node.toBlockArray a)
                in
                Array.foldr
                    (\childNode agg ->
                        foldr func agg childNode
                    )
                    acc
                    children

            Inline _ ->
                acc
        )


{-| Reduce a node from the top left (e.g. from first to last).

    rootNode : Block
    rootNode =
        block
            (Element.element doc [])
            (RichText.Model.Node.blockChildren <| Array.fromList [ pNode ])

    pNode : Block
    pNode =
        block
            (Element.element paragraph [])
            (inlineChildren <|
                Array.fromList [ textNode1, textNode2 ]
            )

    textNode1 : Inline
    textNode1 =
        plainText "sample1"

    textNode2 : Inline
    textNode2 =
        plainText "sample2"

    nodeNameOrTextValue : Node -> List String -> List String
    nodeNameOrTextValue node list =
        (case node of
            Block bn ->
                Element.name (Node.element bn)

            Inline il ->
                case il of
                    Text tl ->
                        RichText.Model.Text.text tl

                    InlineElement p ->
                        Element.name (RichText.Model.InlineElement.element p)
        )
            :: list

    foldl nodeNameOrTextValue [] (Block rootNode)
    -->  [ "sample2", "sample1", "paragraph", "doc" ]

-}
foldl : (Node -> b -> b) -> b -> Node -> b
foldl func acc node =
    case node of
        Block blockNode ->
            let
                children : Array Node
                children =
                    case childNodes blockNode of
                        Leaf ->
                            Array.empty

                        InlineChildren a ->
                            Array.map Inline (RichText.Model.Node.toInlineArray a)

                        BlockChildren a ->
                            Array.map Block (RichText.Model.Node.toBlockArray a)
            in
            Array.foldl
                (\childNode agg ->
                    foldl func agg childNode
                )
                (func node acc)
                children

        Inline _ ->
            func node acc


{-| Same as `foldr` but the reduce function also has the current node's path.

    pathList : Path -> Node -> List Path -> List Path
    pathList path _ list =
        path :: list

    (indexedFoldr pathList [] (Block rootNode)) == [ [], [ 0 ], [ 0, 0 ], [ 0, 1 ] ]

-}
indexedFoldr : (Path -> Node -> b -> b) -> b -> Node -> b
indexedFoldr =
    indexedFoldrRec []


indexedFoldrRec : Path -> (Path -> Node -> b -> b) -> b -> Node -> b
indexedFoldrRec path func acc node =
    func
        path
        node
        (case node of
            Block blockNode ->
                let
                    children : Array ( Int, Node )
                    children =
                        Array.indexedMap Tuple.pair <|
                            case childNodes blockNode of
                                Leaf ->
                                    Array.empty

                                InlineChildren a ->
                                    Array.map Inline (RichText.Model.Node.toInlineArray a)

                                BlockChildren a ->
                                    Array.map Block (RichText.Model.Node.toBlockArray a)
                in
                Array.foldr
                    (\( index, childNode ) agg ->
                        indexedFoldrRec (path ++ [ index ]) func agg childNode
                    )
                    acc
                    children

            Inline _ ->
                acc
        )


{-| Same as `foldl` but the reduce function also has the current node's path.

    pathList : Path -> Node -> List Path -> List Path
    pathList path _ list =
        path :: list

    (indexedFoldl pathList [] (Block rootNode)) == [ [ 0, 1 ], [ 0, 0 ], [ 0 ], [] ]

-}
indexedFoldl : (Path -> Node -> b -> b) -> b -> Node -> b
indexedFoldl =
    indexedFoldlRec []


indexedFoldlRec : Path -> (Path -> Node -> b -> b) -> b -> Node -> b
indexedFoldlRec path func acc node =
    case node of
        Block blockNode ->
            let
                children : Array ( Int, Node )
                children =
                    Array.indexedMap Tuple.pair <|
                        case childNodes blockNode of
                            Leaf ->
                                Array.empty

                            InlineChildren a ->
                                Array.map Inline (RichText.Model.Node.toInlineArray a)

                            BlockChildren a ->
                                Array.map Block (RichText.Model.Node.toBlockArray a)
            in
            Array.foldl
                (\( index, childNode ) agg ->
                    indexedFoldlRec (path ++ [ index ]) func agg childNode
                )
                (func path node acc)
                children

        Inline _ ->
            func path node acc


{-| Same as `foldl` but only applied the nodes between the given paths, inclusive.

    foldlRange [] [ 1 ] nodeNameOrTextValue [] (Block rootNode)
    -->  [ "sample2", "sample1", "paragraph" ]

-}
foldlRange : Path -> Path -> (Node -> b -> b) -> b -> Block -> b
foldlRange start end func acc root =
    case nodeAt start root of
        Nothing ->
            acc

        Just node ->
            foldlRangeRec start end func acc root node


foldlRangeRec : Path -> Path -> (Node -> b -> b) -> b -> Block -> Node -> b
foldlRangeRec start end func acc root node =
    if start > end then
        acc

    else
        let
            result : b
            result =
                func node acc
        in
        case next start root of
            Nothing ->
                result

            Just ( p, n ) ->
                foldlRangeRec p end func result root n


{-| Same as `foldr` but only applied the nodes between the given paths, inclusive.

    foldlRange [ 0 ] [ 0, 1 ] nodeNameOrTextValue [] (Block rootNode)
    --> [ "paragraph", "sample1", "sample2" ]

-}
foldrRange : Path -> Path -> (Node -> b -> b) -> b -> Block -> b
foldrRange start end func acc root =
    case nodeAt end root of
        Nothing ->
            acc

        Just node ->
            foldrRangeRec start end func acc root node


foldrRangeRec : Path -> Path -> (Node -> b -> b) -> b -> Block -> Node -> b
foldrRangeRec start end func acc root node =
    if start > end then
        acc

    else
        let
            result : b
            result =
                func node acc
        in
        case previous end root of
            Nothing ->
                result

            Just ( p, n ) ->
                foldrRangeRec start p func result root n


{-| Returns a Ok Block that replaces the node at the node path with the given fragment. If it is
unable to replace it do to an invalid path or the wrong type of node, a Err string describing
the error is returned.

    -- replaces the node at [0, 0] with the given inline fragment
    replaceWithFragment [ 0, 0 ] (InlineFragment <| Array.fromList [ textNode ]) rootNode

-}
replaceWithFragment : Path -> Fragment -> Block -> Result String Block
replaceWithFragment path fragment root =
    case path of
        [] ->
            Err "Invalid path"

        [ x ] ->
            case childNodes root of
                BlockChildren a ->
                    case fragment of
                        BlockFragment blocks ->
                            let
                                arr : Array Block
                                arr =
                                    RichText.Model.Node.toBlockArray a
                            in
                            Ok <|
                                (root
                                    |> RichText.Model.Node.withChildNodes
                                        (RichText.Model.Node.blockChildren
                                            (Array.append
                                                (Array.append
                                                    (Array.Extra.sliceUntil x arr)
                                                    blocks
                                                )
                                                (Array.Extra.sliceFrom (x + 1) arr)
                                            )
                                        )
                                )

                        InlineFragment _ ->
                            Err "I cannot replace a block fragment with an inline leaf fragment"

                InlineChildren a ->
                    case fragment of
                        InlineFragment leaves ->
                            let
                                arr : Array Inline
                                arr =
                                    RichText.Model.Node.toInlineArray a
                            in
                            Ok <|
                                (root
                                    |> RichText.Model.Node.withChildNodes
                                        (inlineChildren
                                            (Array.append
                                                (Array.append
                                                    (Array.Extra.sliceUntil x arr)
                                                    leaves
                                                )
                                                (Array.Extra.sliceFrom (x + 1) arr)
                                            )
                                        )
                                )

                        BlockFragment _ ->
                            Err "I cannot replace an inline fragment with a block fragment"

                Leaf ->
                    Err "Not implemented"

        x :: xs ->
            case childNodes root of
                BlockChildren a ->
                    let
                        arr : Array Block
                        arr =
                            RichText.Model.Node.toBlockArray a
                    in
                    case Array.get x arr of
                        Nothing ->
                            Err "I received an invalid path, I can't find a block node at the given index."

                        Just node ->
                            case replaceWithFragment xs fragment node of
                                Ok n ->
                                    root
                                        |> RichText.Model.Node.withChildNodes
                                            (RichText.Model.Node.blockChildren
                                                (Array.set x n arr)
                                            )
                                        |> Ok

                                Err v ->
                                    Err v

                InlineChildren _ ->
                    Err "I received an invalid path, I reached an inline leaf array but I still have more path left."

                Leaf ->
                    Err "I received an invalid path, I am on a leaf node, but I still have more path left."


{-| Replaces the node at the path with the given editor node.

    -- replaces the node at [0, 0] with the inline text
    replace [ 0, 0 ] (Inline textNode) rootNode

-}
replace : Path -> Node -> Block -> Result String Block
replace path node root =
    case path of
        [] ->
            case node of
                Block n ->
                    Ok n

                Inline _ ->
                    Err "I cannot replace a block node with an inline leaf."

        _ ->
            let
                fragment : Fragment
                fragment =
                    case node of
                        Block n ->
                            BlockFragment <| Array.fromList [ n ]

                        Inline n ->
                            InlineFragment <| Array.fromList [ n ]
            in
            replaceWithFragment path fragment root


{-| Returns Just the parent of the given path if the path refers to an inline node, otherwise
inline content, otherwisereturn Nothing.

    rootNode : Block
    rootNode =
        block
            (Element.element doc [])
            (RichText.Model.Node.blockChildren <| Array.fromList [ pNode ])

    pNode : Block
    pNode =
        block
            (Element.element paragraph [])
            (inlineChildren <|
                Array.fromList [ textNode1, textNode2 ]
            )

    textNode1 : Inline
    textNode1 =
        plainText "sample1"

    textNode2 : Inline
    textNode2 =
        plainText "sample2"

    findTextBlockNodeAncestor [ 0, 0 ] rootNode
    --> Just ( [ 0 ], pNode )

    findTextBlockNodeAncestor [ 0 ] rootNode
    --> Nothing ==

-}
findTextBlockNodeAncestor : Path -> Block -> Maybe ( Path, Block )
findTextBlockNodeAncestor =
    findAncestor
        (\n ->
            case childNodes n of
                InlineChildren _ ->
                    True

                _ ->
                    False
        )


{-| Find ancestor from path finds the closest ancestor from the given NodePath that matches the
predicate.

    -- Finds the closest list item ancestor if it exists
    findAncestor (\n -> Element.name (Node.element n) == "list_item")

-}
findAncestor : (Block -> Bool) -> Path -> Block -> Maybe ( Path, Block )
findAncestor pred path node =
    case path of
        [] ->
            Nothing

        x :: xs ->
            case childNodes node of
                BlockChildren a ->
                    case Array.get x (RichText.Model.Node.toBlockArray a) of
                        Nothing ->
                            Nothing

                        Just childNode ->
                            case findAncestor pred xs childNode of
                                Nothing ->
                                    if pred node then
                                        Just ( [], node )

                                    else
                                        Nothing

                                Just ( p, result ) ->
                                    Just ( x :: p, result )

                _ ->
                    if pred node then
                        Just ( [], node )

                    else
                        Nothing


{-| Returns the node at the specified path if it exists.

    rootNode : Block
    rootNode =
        block
            (Element.element doc [])
            (RichText.Model.Node.blockChildren <| Array.fromList [ pNode ])

    pNode : Block
    pNode =
        block
            (Element.element paragraph [])
            (inlineChildren <|
                Array.fromList [ textNode1, textNode2 ]
            )

    nodeAt [0] rootNode == Just (Block pNode)

-}
nodeAt : Path -> Block -> Maybe Node
nodeAt path node =
    case path of
        [] ->
            Just <| Block node

        x :: xs ->
            case childNodes node of
                BlockChildren arr ->
                    case Array.get x (RichText.Model.Node.toBlockArray arr) of
                        Nothing ->
                            Nothing

                        Just childNode ->
                            nodeAt xs childNode

                InlineChildren a ->
                    case Array.get x (RichText.Model.Node.toInlineArray a) of
                        Nothing ->
                            Nothing

                        Just childLeafNode ->
                            if List.isEmpty xs then
                                Just <| Inline childLeafNode

                            else
                                Nothing

                Leaf ->
                    Nothing


{-| This method removes all the nodes inclusive to both the start and end path. Note that
an ancestor is not removed if the start path or end path is a child node.

    rootNode : Block
    rootNode =
        block
            (Element.element doc [])
            (RichText.Model.Node.blockChildren <| Array.fromList [ pNode ])


    emptyRoot : Block
    emptyRoot =
        block
            (Element.element doc [])
            (RichText.Model.Node.blockChildren <| Array.empty)

    removeInRange [0] [0] root == emptyRoot
    --> True

-}
removeInRange : Path -> Path -> Block -> Block
removeInRange start end node =
    let
        startIndex : Int
        startIndex =
            Maybe.withDefault 0 (List.head start)

        endIndex : Int
        endIndex =
            case List.head end of
                Nothing ->
                    case childNodes node of
                        BlockChildren a ->
                            Array.length (RichText.Model.Node.toBlockArray a)

                        InlineChildren a ->
                            Array.length (RichText.Model.Node.toInlineArray a)

                        Leaf ->
                            0

                Just e ->
                    e
    in
    if startIndex > endIndex then
        node

    else
        let
            startRest : List Int
            startRest =
                Maybe.withDefault [] (List.tail start)

            endRest : List Int
            endRest =
                Maybe.withDefault [] (List.tail end)
        in
        if startIndex == endIndex then
            case childNodes node of
                BlockChildren a ->
                    let
                        array : Array Block
                        array =
                            RichText.Model.Node.toBlockArray a
                    in
                    if List.isEmpty startRest && List.isEmpty endRest then
                        node
                            |> RichText.Model.Node.withChildNodes
                                (RichText.Model.Node.blockChildren <|
                                    Array.Extra.removeAt startIndex array
                                )

                    else
                        case Array.get startIndex array of
                            Nothing ->
                                node

                            Just b ->
                                node
                                    |> RichText.Model.Node.withChildNodes
                                        (RichText.Model.Node.blockChildren <|
                                            Array.set startIndex (removeInRange startRest endRest b) array
                                        )

                InlineChildren a ->
                    if List.isEmpty startRest && List.isEmpty endRest then
                        node |> RichText.Model.Node.withChildNodes (inlineChildren <| Array.Extra.removeAt startIndex (RichText.Model.Node.toInlineArray a))

                    else
                        node

                Leaf ->
                    node

        else
            case childNodes node of
                BlockChildren a ->
                    let
                        arr : Array Block
                        arr =
                            RichText.Model.Node.toBlockArray a

                        left : Array Block
                        left =
                            Array.Extra.sliceUntil startIndex arr

                        right : Array Block
                        right =
                            Array.Extra.sliceFrom (endIndex + 1) arr

                        leftRest : Array Block
                        leftRest =
                            if List.isEmpty startRest then
                                Array.empty

                            else
                                case Array.get startIndex arr of
                                    Nothing ->
                                        Array.empty

                                    Just b ->
                                        Array.fromList [ removeInRange startRest (last b |> Tuple.first) b ]

                        rightRest : Array Block
                        rightRest =
                            if List.isEmpty endRest then
                                Array.empty

                            else
                                case Array.get endIndex arr of
                                    Nothing ->
                                        Array.empty

                                    Just b ->
                                        Array.fromList [ removeInRange [] endRest b ]
                    in
                    node |> RichText.Model.Node.withChildNodes (blockChildren <| List.foldr Array.append Array.empty [ left, leftRest, rightRest, right ])

                InlineChildren a ->
                    let
                        arr : Array Inline
                        arr =
                            RichText.Model.Node.toInlineArray a

                        left : Array Inline
                        left =
                            Array.Extra.sliceUntil
                                (if List.isEmpty startRest then
                                    startIndex

                                 else
                                    startIndex + 1
                                )
                                arr

                        right : Array Inline
                        right =
                            Array.Extra.sliceFrom
                                (if List.isEmpty endRest then
                                    endIndex + 1

                                 else
                                    endIndex
                                )
                                arr
                    in
                    node |> RichText.Model.Node.withChildNodes (inlineChildren <| Array.append left right)

                Leaf ->
                    node


{-| Removes the node at the given path, and recursively removes parent blocks that have no remaining
child nodes, excluding the root.

    rootNode : Block
    rootNode =
        block
            (Element.element doc [])
            (RichText.Model.Node.blockChildren <|
                Array.fromList [ removedPHtmlNode ]
            )

    pNode : Block
    pNode =
        block
            (Element.element paragraph [])
            (inlineChildren <|
                Array.fromList [ textNode ]
            )

    textNode : Inline
    textNode =
        plainText "sample1"

    removedRoot : Block
    removedRoot =
        block
            (Element.element doc [])
            (RichText.Model.Node.blockChildren Array.empty)

    removeNodeAndEmptyParents [0, 0] root == removedRoot
    --> True

-}
removeNodeAndEmptyParents : Path -> Block -> Block
removeNodeAndEmptyParents path node =
    case path of
        [] ->
            node

        [ x ] ->
            case childNodes node of
                BlockChildren a ->
                    node |> RichText.Model.Node.withChildNodes (RichText.Model.Node.blockChildren <| Array.Extra.removeAt x (RichText.Model.Node.toBlockArray a))

                InlineChildren a ->
                    node |> RichText.Model.Node.withChildNodes (inlineChildren <| Array.Extra.removeAt x (RichText.Model.Node.toInlineArray a))

                Leaf ->
                    node

        x :: xs ->
            case childNodes node of
                BlockChildren a ->
                    let
                        arr : Array Block
                        arr =
                            RichText.Model.Node.toBlockArray a
                    in
                    case Array.get x arr of
                        Nothing ->
                            node

                        Just n ->
                            let
                                newNode : Block
                                newNode =
                                    removeNodeAndEmptyParents xs n
                            in
                            case childNodes newNode of
                                BlockChildren newNodeChildren ->
                                    let
                                        newChildNodes : Array Block
                                        newChildNodes =
                                            RichText.Model.Node.toBlockArray newNodeChildren
                                    in
                                    if Array.isEmpty newChildNodes then
                                        node |> RichText.Model.Node.withChildNodes (RichText.Model.Node.blockChildren <| Array.Extra.removeAt x arr)

                                    else
                                        node |> RichText.Model.Node.withChildNodes (RichText.Model.Node.blockChildren <| Array.set x newNode arr)

                                InlineChildren newNodeChildren ->
                                    let
                                        newChildNodes : Array Inline
                                        newChildNodes =
                                            RichText.Model.Node.toInlineArray newNodeChildren
                                    in
                                    if Array.isEmpty newChildNodes then
                                        node |> RichText.Model.Node.withChildNodes (RichText.Model.Node.blockChildren <| Array.Extra.removeAt x arr)

                                    else
                                        node |> RichText.Model.Node.withChildNodes (RichText.Model.Node.blockChildren <| Array.set x newNode arr)

                                _ ->
                                    node |> RichText.Model.Node.withChildNodes (RichText.Model.Node.blockChildren <| Array.set x newNode arr)

                InlineChildren _ ->
                    node

                Leaf ->
                    node


{-| Splits a text leaf into two based on the given offset.

    splitTextLeaf 1 (emptyText <| RichText.Model.Text.withText "test")
    --> (Text "t", Text "est")

-}
splitTextLeaf : Int -> RichText.Model.Text.Text -> ( RichText.Model.Text.Text, RichText.Model.Text.Text )
splitTextLeaf offset leaf =
    let
        leafText : String
        leafText =
            RichText.Model.Text.text leaf
    in
    ( leaf |> RichText.Model.Text.withText (String.left offset leafText)
    , leaf |> RichText.Model.Text.withText (String.dropLeft offset leafText)
    )


{-| Splits a block at the given path and offset and returns Just the split nodes.
If the path is invalid or the node cannot be split, Nothing is returned.

    textNode1 : Inline
    textNode1 =
        plainText "sample1"

    nodeWithTextLeafToSplit : Block
    nodeWithTextLeafToSplit =
        block
            (Element.element paragraph [])
            (inlineChildren <|
                Array.fromList [ textNode1 ]
            )

    nodeBeforeTextLeafSplit : Block
    nodeBeforeTextLeafSplit =
        block
            (Element.element paragraph [])
            (inlineChildren <|
                Array.fromList [ plainText "sam" ]
            )

    nodeAfterTextLeafSplit : Block
    nodeAfterTextLeafSplit =
        block
            (Element.element paragraph [])
            (inlineChildren <|
                Array.fromList [ plainText "ple1" ]
            )

    Just (nodeBeforeTextLeafSplit, nodeAfterTextLeafSplit) ==
        splitBlockAtPathAndOffset [ 0 ] 3 nodeWithTextLeafToSplit

-}
splitBlockAtPathAndOffset : Path -> Int -> Block -> Maybe ( Block, Block )
splitBlockAtPathAndOffset path offset node =
    case path of
        [] ->
            case childNodes node of
                BlockChildren a ->
                    let
                        arr : Array Block
                        arr =
                            RichText.Model.Node.toBlockArray a
                    in
                    Just
                        ( node |> RichText.Model.Node.withChildNodes (RichText.Model.Node.blockChildren (Array.Extra.sliceUntil offset arr))
                        , node |> RichText.Model.Node.withChildNodes (RichText.Model.Node.blockChildren (Array.Extra.sliceFrom offset arr))
                        )

                InlineChildren a ->
                    let
                        arr : Array Inline
                        arr =
                            RichText.Model.Node.toInlineArray a
                    in
                    Just
                        ( node |> RichText.Model.Node.withChildNodes (inlineChildren (Array.Extra.sliceUntil offset arr))
                        , node |> RichText.Model.Node.withChildNodes (inlineChildren (Array.Extra.sliceFrom offset arr))
                        )

                Leaf ->
                    Just ( node, node )

        x :: xs ->
            case childNodes node of
                BlockChildren a ->
                    let
                        arr : Array Block
                        arr =
                            RichText.Model.Node.toBlockArray a
                    in
                    case Array.get x arr of
                        Nothing ->
                            Nothing

                        Just n ->
                            case splitBlockAtPathAndOffset xs offset n of
                                Nothing ->
                                    Nothing

                                Just ( before, after ) ->
                                    Just
                                        ( node |> RichText.Model.Node.withChildNodes (RichText.Model.Node.blockChildren (Array.append (Array.Extra.sliceUntil x arr) (Array.fromList [ before ])))
                                        , node |> RichText.Model.Node.withChildNodes (RichText.Model.Node.blockChildren (Array.append (Array.fromList [ after ]) (Array.Extra.sliceFrom (x + 1) arr)))
                                        )

                InlineChildren a ->
                    let
                        arr : Array Inline
                        arr =
                            RichText.Model.Node.toInlineArray a
                    in
                    case Array.get x arr of
                        Nothing ->
                            Nothing

                        Just n ->
                            case n of
                                Text tl ->
                                    let
                                        ( before, after ) =
                                            splitTextLeaf offset tl
                                    in
                                    Just
                                        ( node |> RichText.Model.Node.withChildNodes (inlineChildren (Array.set x (Text before) (Array.Extra.sliceUntil (x + 1) arr)))
                                        , node |> RichText.Model.Node.withChildNodes (inlineChildren (Array.set 0 (Text after) (Array.Extra.sliceFrom x arr)))
                                        )

                                InlineElement _ ->
                                    Just
                                        ( node |> RichText.Model.Node.withChildNodes (inlineChildren (Array.Extra.sliceUntil x arr))
                                        , node |> RichText.Model.Node.withChildNodes (inlineChildren (Array.Extra.sliceFrom x arr))
                                        )

                Leaf ->
                    Nothing


{-| Determine if all elements in range satisfy some test.

    -- Query to determine if all the elements in range are selectable
    allRange isSelectable [ 0, 0 ] [ 0, 2 ] root

-}
allRange : (Node -> Bool) -> Path -> Path -> Block -> Bool
allRange pred start end root =
    if start > end then
        True

    else
        case nodeAt start root of
            Nothing ->
                -- In the case of an invalid path, just return true.
                True

            Just node ->
                if pred node then
                    case next start root of
                        Nothing ->
                            True

                        Just ( nextPath, _ ) ->
                            allRange pred nextPath end root

                else
                    False


{-| Determine if any elements in range satisfy some test.

    -- Query to determine if any elements in range are selectable
    allRange isSelectable [ 0, 0 ] [ 0, 2 ] root

-}
anyRange : (Node -> Bool) -> Path -> Path -> Block -> Bool
anyRange pred start end root =
    not <| allRange (\x -> not <| pred x) start end root


{-| If the node specified by the path is an inline node, returns the parent. If the node at the
path is a block, then returns the same path. Otherwise if the path is invalid,
returns the root path.

    rootNode : Block
    rootNode =
        block
            (Element.element doc [])
            (RichText.Model.Node.blockChildren <| Array.fromList [ pNode ])

    pNode : Block
    pNode =
        block
            (Element.element paragraph [])
            (inlineChildren <|
                Array.fromList [ textNode1, textNode2 ]
            )

    textNode1 : Inline
    textNode1 =
        plainText "sample1"

    textNode2 : Inline
    textNode2 =
        plainText "sample2"

    findClosestBlockPath [0, 0] rootNode
    --> [0]
    findClosestBlockPath [0] rootNode
    --> [0]

-}
findClosestBlockPath : Path -> Block -> Path
findClosestBlockPath path node =
    case nodeAt path node of
        Nothing ->
            []

        Just n ->
            case n of
                Block _ ->
                    path

                Inline _ ->
                    parent path


{-| If the two blocks have the same type of children, returns the joined block. Otherwise, if the
blocks have different children or one or more is a leaf node, then Nothing is return.

    pNode : Block
    pNode =
        block
            (Element.element paragraph [])
            (inlineChildren <|
                Array.fromList [ textNode1, textNode2 ]
            )

    pNodeReverse : Block
    pNodeReverse =
        block
            (Element.element paragraph [])
            (inlineChildren <|
                Array.fromList [ textNode2, textNode1 ]
            )

    pNodeExpectedJoin : Block
    pNodeExpectedJoin =
        block
            (Element.element paragraph [])
            (inlineChildren <|
                Array.fromList [ textNode1, textNode2, textNode2, textNode1 ]
            )

    pNodeExpectedJoin == joinBlocks pNode pNodeReverse

-}
joinBlocks : Block -> Block -> Maybe Block
joinBlocks b1 b2 =
    case childNodes b1 of
        BlockChildren a1 ->
            case childNodes b2 of
                BlockChildren a2 ->
                    Just <|
                        (b1
                            |> RichText.Model.Node.withChildNodes
                                (RichText.Model.Node.blockChildren
                                    (Array.append (RichText.Model.Node.toBlockArray a1)
                                        (RichText.Model.Node.toBlockArray a2)
                                    )
                                )
                        )

                _ ->
                    Nothing

        InlineChildren a1 ->
            case childNodes b2 of
                InlineChildren a2 ->
                    Just <| (b1 |> RichText.Model.Node.withChildNodes (inlineChildren (Array.append (RichText.Model.Node.toInlineArray a1) (RichText.Model.Node.toInlineArray a2))))

                _ ->
                    Nothing

        Leaf ->
            Nothing


{-| Inserts the fragments after the node at the given path and returns the result. Returns an
error if the path is invalid or the fragment cannot be inserted.

    insertAfter [ 0, 0 ] fragment root
    --> Inserts the fragment after the node at path [0, 0]

-}
insertAfter : Path -> Fragment -> Block -> Result String Block
insertAfter path fragment root =
    case nodeAt path root of
        Nothing ->
            Err "There is no node at this path"

        Just node ->
            case node of
                Inline il ->
                    case fragment of
                        InlineFragment a ->
                            let
                                newFragment : Fragment
                                newFragment =
                                    InlineFragment <| Array.fromList (il :: Array.toList a)
                            in
                            replaceWithFragment path newFragment root

                        BlockFragment _ ->
                            Err "I cannot insert a block node fragment into an inline leaf fragment"

                Block bn ->
                    case fragment of
                        BlockFragment a ->
                            let
                                newFragment : Fragment
                                newFragment =
                                    BlockFragment <| Array.fromList (bn :: Array.toList a)
                            in
                            replaceWithFragment path newFragment root

                        InlineFragment _ ->
                            Err "I cannot insert an inline leaf fragment fragment into a block node fragment"


{-| Inserts the fragments before the node at the given path and returns the result. Returns an
error if the path is invalid or the fragment cannot be inserted.

    insertBefore [ 0, 0 ] fragment root
    --> Inserts the fragment before the node at path [0, 0]

-}
insertBefore : Path -> Fragment -> Block -> Result String Block
insertBefore path fragment root =
    case nodeAt path root of
        Nothing ->
            Err "There is no node at this path"

        Just node ->
            case node of
                Inline il ->
                    case fragment of
                        InlineFragment a ->
                            let
                                newFragment : Fragment
                                newFragment =
                                    InlineFragment <| Array.push il a
                            in
                            replaceWithFragment path newFragment root

                        BlockFragment _ ->
                            Err "I cannot insert a block node fragment into an inline leaf fragment"

                Block bn ->
                    case fragment of
                        BlockFragment a ->
                            let
                                newFragment : Fragment
                                newFragment =
                                    BlockFragment <| Array.push bn a
                            in
                            replaceWithFragment path newFragment root

                        InlineFragment _ ->
                            Err "I cannot insert an inline leaf fragment fragment into a block node fragment"


{-| Runs the toggle action on the node for the given mark.

    toggleMark Add markOrder bold node
    --> Adds bold to the given node

-}
toggleMark : RichText.Model.Mark.ToggleAction -> RichText.Model.Mark.MarkOrder -> RichText.Model.Mark.Mark -> Node -> Node
toggleMark action markOrder mark node =
    case node of
        Block _ ->
            node

        Inline il ->
            Inline <|
                case il of
                    Text leaf ->
                        Text <|
                            (leaf
                                |> RichText.Model.Text.withMarks
                                    (RichText.Model.Mark.toggle action
                                        markOrder
                                        mark
                                        (RichText.Model.Text.marks leaf)
                                    )
                            )

                    InlineElement leaf ->
                        InlineElement <|
                            (leaf
                                |> RichText.Model.InlineElement.withMarks
                                    (RichText.Model.Mark.toggle action
                                        markOrder
                                        mark
                                        (RichText.Model.InlineElement.marks leaf)
                                    )
                            )


{-| True if this block has inline content with no children or a single empty text node, false otherwise

    pNode : Block
        pNode =
            block
                (Element.element paragraph [])
                (inlineChildren <|
                    Array.fromList [ emptyText ]
                )

    isEmptyTextBlock pNode
    --> True

-}
isEmptyTextBlock : Node -> Bool
isEmptyTextBlock node =
    case node of
        Block bn ->
            case childNodes bn of
                InlineChildren a ->
                    let
                        array : Array Inline
                        array =
                            RichText.Model.Node.toInlineArray a
                    in
                    case Array.get 0 array of
                        Nothing ->
                            Array.isEmpty array

                        Just n ->
                            (Array.length array == 1)
                                && (case n of
                                        Text t ->
                                            String.isEmpty (RichText.Model.Text.text t)

                                        _ ->
                                            False
                                   )

                _ ->
                    False

        Inline _ ->
            False


{-| True if the selection is collapsed at the beginning of a text block, false otherwise.

    -- selectionIsBeginningOfTextBlock is used for things like lift and join backward
    if selectionIsBeginningOfTextBlock selection (State.root editorState) then
        -- Do join backward logic
    else
        -- Do something else

-}
selectionIsBeginningOfTextBlock : RichText.Model.Selection.Selection -> Block -> Bool
selectionIsBeginningOfTextBlock selection root =
    if not <| RichText.Model.Selection.isCollapsed selection then
        False

    else
        case findTextBlockNodeAncestor (RichText.Model.Selection.anchorNode selection) root of
            Nothing ->
                False

            Just ( _, n ) ->
                case childNodes n of
                    InlineChildren a ->
                        case List.Extra.last (RichText.Model.Selection.anchorNode selection) of
                            Nothing ->
                                False

                            Just i ->
                                if i /= 0 || Array.isEmpty (RichText.Model.Node.toInlineArray a) then
                                    False

                                else
                                    RichText.Model.Selection.anchorOffset selection == 0

                    _ ->
                        False


{-| True if the selection is collapsed at the end of a text block, false otherwise.

    -- selectionIsEndOfTextBlock is used for things like join forward
    if selectionIsEndOfTextBlock selection (State.root editorState) then
        -- Do join forward logic
    else
        -- Do something else

-}
selectionIsEndOfTextBlock : RichText.Model.Selection.Selection -> Block -> Bool
selectionIsEndOfTextBlock selection root =
    if not <| RichText.Model.Selection.isCollapsed selection then
        False

    else
        case findTextBlockNodeAncestor (RichText.Model.Selection.anchorNode selection) root of
            Nothing ->
                False

            Just ( _, n ) ->
                case childNodes n of
                    InlineChildren a ->
                        case List.Extra.last (RichText.Model.Selection.anchorNode selection) of
                            Nothing ->
                                False

                            Just i ->
                                if i /= Array.length (RichText.Model.Node.toInlineArray a) - 1 then
                                    False

                                else
                                    case Array.get i (RichText.Model.Node.toInlineArray a) of
                                        Nothing ->
                                            False

                                        Just leaf ->
                                            case leaf of
                                                Text tl ->
                                                    String.length (RichText.Model.Text.text tl) == RichText.Model.Selection.anchorOffset selection

                                                InlineElement _ ->
                                                    True

                    _ ->
                        False
