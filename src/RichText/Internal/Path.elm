module RichText.Internal.Path exposing
    ( domToEditor
    , editorToDom
    )

{-| This module contains functions related to transforming node paths.
-}

import Array exposing (Array)
import RichText.Config.ElementDefinition
import RichText.Config.MarkDefinition
import RichText.Config.Spec
import RichText.Internal.HtmlNode
import RichText.Internal.Spec
import RichText.Model.Element
import RichText.Model.HtmlNode
import RichText.Model.Mark
import RichText.Model.Node


domToEditorInlineLeafTree : RichText.Config.Spec.Spec -> RichText.Model.Node.InlineTree -> RichText.Model.Node.Path -> Maybe RichText.Model.Node.Path
domToEditorInlineLeafTree spec tree path =
    case tree of
        RichText.Model.Node.LeafNode i ->
            Just [ i ]

        RichText.Model.Node.MarkNode n ->
            let
                markDefinition =
                    RichText.Internal.Spec.markDefinitionWithDefault n.mark spec

                structure =
                    RichText.Config.MarkDefinition.toHtmlNode markDefinition n.mark RichText.Internal.HtmlNode.childNodesPlaceholder
            in
            case removePathUpToChildContents structure path of
                Nothing ->
                    Nothing

                Just rest ->
                    case List.head rest of
                        Nothing ->
                            Just []

                        Just i ->
                            case Array.get i n.children of
                                Nothing ->
                                    Nothing

                                Just l ->
                                    domToEditorInlineLeafTree spec l (List.drop 1 rest)


{-| Translates a DOM node path to an editor node path. Returns Nothing if the
path is invalid.
-}
domToEditor : RichText.Config.Spec.Spec -> RichText.Model.Node.Block -> RichText.Model.Node.Path -> Maybe RichText.Model.Node.Path
domToEditor spec node path =
    if List.isEmpty path then
        Just []

    else
        let
            parameters =
                RichText.Model.Node.element node

            elementDefinition =
                RichText.Internal.Spec.elementDefinitionWithDefault parameters spec

            structure =
                RichText.Config.ElementDefinition.toHtmlNode elementDefinition parameters RichText.Internal.HtmlNode.childNodesPlaceholder
        in
        case removePathUpToChildContents structure path of
            Nothing ->
                Nothing

            Just rest ->
                case List.head rest of
                    Nothing ->
                        Just []

                    Just i ->
                        case RichText.Model.Node.childNodes node of
                            RichText.Model.Node.BlockChildren l ->
                                case Array.get i (RichText.Model.Node.toBlockArray l) of
                                    Nothing ->
                                        Nothing

                                    Just childNode ->
                                        case domToEditor spec childNode (List.drop 1 rest) of
                                            Nothing ->
                                                Nothing

                                            Just p ->
                                                Just (i :: p)

                            RichText.Model.Node.InlineChildren l ->
                                case Array.get i (RichText.Model.Node.toInlineTree l) of
                                    Nothing ->
                                        Nothing

                                    Just tree ->
                                        -- we assume the content of the leaf node is valid, but maybe we should validate its content?
                                        domToEditorInlineLeafTree spec tree (List.drop 1 rest)

                            RichText.Model.Node.Leaf ->
                                -- If we still have path left, it means the path is invalid, so we return Nothing
                                Nothing


{-| Translates an editor node path to a DOM node path. Returns Nothing if the
path is invalid.
-}
editorToDom : RichText.Config.Spec.Spec -> RichText.Model.Node.Block -> RichText.Model.Node.Path -> Maybe RichText.Model.Node.Path
editorToDom spec node path =
    case path of
        [] ->
            Just []

        x :: xs ->
            case pathToChildContentsFromElementParameters spec (RichText.Model.Node.element node) of
                Nothing ->
                    Nothing

                Just childPath ->
                    case RichText.Model.Node.childNodes node of
                        RichText.Model.Node.BlockChildren l ->
                            case Array.get x (RichText.Model.Node.toBlockArray l) of
                                Nothing ->
                                    Nothing

                                Just childNode ->
                                    case editorToDom spec childNode xs of
                                        Nothing ->
                                            Nothing

                                        Just p ->
                                            Just (childPath ++ (x :: p))

                        RichText.Model.Node.InlineChildren l ->
                            case Array.get x (RichText.Model.Node.reverseLookup l) of
                                Nothing ->
                                    Nothing

                                Just inlineTreePath ->
                                    case
                                        pathToChildContentsFromInlineTreePath
                                            spec
                                            (RichText.Model.Node.toInlineArray l)
                                            (RichText.Model.Node.toInlineTree l)
                                            inlineTreePath
                                    of
                                        Nothing ->
                                            Nothing

                                        Just childInlineTreePath ->
                                            Just (childPath ++ childInlineTreePath)

                        RichText.Model.Node.Leaf ->
                            Nothing



{- Helper method to traverse the give node with the node path and return
   the node path that remains after finding the child nodes placeholder.  If no
   placeholder is found, then Nothing is returned.
-}


removePathUpToChildContents : RichText.Model.HtmlNode.HtmlNode -> RichText.Model.Node.Path -> Maybe RichText.Model.Node.Path
removePathUpToChildContents node path =
    case node of
        RichText.Model.HtmlNode.ElementNode _ _ children ->
            if children == RichText.Internal.HtmlNode.childNodesPlaceholder then
                Just path

            else
                case path of
                    [] ->
                        Just path

                    x :: xs ->
                        case Array.get x children of
                            Nothing ->
                                Nothing

                            Just child ->
                                removePathUpToChildContents child xs

        RichText.Model.HtmlNode.TextNode _ ->
            Nothing



{- Helper method to return a node path to the which should contain the child contents. -}


pathToChildContents : RichText.Model.HtmlNode.HtmlNode -> Maybe RichText.Model.Node.Path
pathToChildContents node =
    case node of
        RichText.Model.HtmlNode.ElementNode _ _ children ->
            if children == RichText.Internal.HtmlNode.childNodesPlaceholder then
                Just []

            else
                Array.foldl
                    (\( i, childNode ) maybePath ->
                        case maybePath of
                            Nothing ->
                                case pathToChildContents childNode of
                                    Nothing ->
                                        Nothing

                                    Just path ->
                                        Just (i :: path)

                            _ ->
                                maybePath
                    )
                    Nothing
                    (Array.indexedMap Tuple.pair children)

        RichText.Model.HtmlNode.TextNode _ ->
            Nothing



{- Helper method that returns the path to the child contents from a list of marks -}


pathToChildContentsFromMark : RichText.Config.Spec.Spec -> RichText.Model.Mark.Mark -> Maybe RichText.Model.Node.Path
pathToChildContentsFromMark spec mark =
    let
        markDefinition =
            RichText.Internal.Spec.markDefinitionWithDefault mark spec

        markStructure =
            RichText.Config.MarkDefinition.toHtmlNode markDefinition mark RichText.Internal.HtmlNode.childNodesPlaceholder
    in
    pathToChildContents markStructure



{- Helper method to determine the path to the child contents from an element editor node -}


pathToChildContentsFromElementParameters : RichText.Config.Spec.Spec -> RichText.Model.Element.Element -> Maybe RichText.Model.Node.Path
pathToChildContentsFromElementParameters spec parameters =
    let
        elementDefinition =
            RichText.Internal.Spec.elementDefinitionWithDefault parameters spec

        nodeStructure =
            RichText.Config.ElementDefinition.toHtmlNode elementDefinition parameters RichText.Internal.HtmlNode.childNodesPlaceholder
    in
    pathToChildContents nodeStructure


pathToChildContentsFromInlineTreePath : RichText.Config.Spec.Spec -> Array RichText.Model.Node.Inline -> Array RichText.Model.Node.InlineTree -> RichText.Model.Node.Path -> Maybe RichText.Model.Node.Path
pathToChildContentsFromInlineTreePath spec array treeArray path =
    case path of
        [] ->
            Nothing

        x :: xs ->
            case Array.get x treeArray of
                Nothing ->
                    Nothing

                Just tree ->
                    case tree of
                        RichText.Model.Node.LeafNode i ->
                            case Array.get i array of
                                Nothing ->
                                    Nothing

                                Just _ ->
                                    Just [ x ]

                        RichText.Model.Node.MarkNode n ->
                            case pathToChildContentsFromMark spec n.mark of
                                Nothing ->
                                    Nothing

                                Just p ->
                                    case pathToChildContentsFromInlineTreePath spec array n.children xs of
                                        Nothing ->
                                            Nothing

                                        Just rest ->
                                            Just <| x :: p ++ rest
