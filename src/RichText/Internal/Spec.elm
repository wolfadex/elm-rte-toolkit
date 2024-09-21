module RichText.Internal.Spec exposing (elementDefinitionWithDefault, htmlToElementArray, markDefinitionWithDefault)

import Array exposing (Array)
import Html.Parser
import Result exposing (Result)
import RichText.Config.ElementDefinition
import RichText.Config.MarkDefinition
import RichText.Config.Spec
import RichText.Internal.Constants
import RichText.Internal.Definitions
import RichText.Model.Element
import RichText.Model.HtmlNode
import RichText.Model.InlineElement
import RichText.Model.Mark
import RichText.Model.Node
import RichText.Model.Text
import RichText.Node


resultFilterMap : (a -> Result String b) -> Array a -> ( Array b, List String )
resultFilterMap f xs =
    let
        maybePush : (a -> Result String b) -> a -> ( Array b, List String ) -> ( Array b, List String )
        maybePush f_ mx xs_ =
            case f_ mx of
                Ok x ->
                    Tuple.mapFirst (Array.push x) xs_

                Err err ->
                    Tuple.mapSecond ((::) err) xs_
    in
    Array.foldl (maybePush f) ( Array.empty, [] ) xs


htmlToElementArray : RichText.Config.Spec.Spec -> String -> Result String (Array RichText.Node.Fragment)
htmlToElementArray spec html =
    case stringToHtmlNodeArray html of
        Err s ->
            Err s

        Ok htmlNodeArray ->
            let
                ( newArray, errList ) =
                    resultFilterMap (htmlNodeToEditorFragment spec []) htmlNodeArray
            in
            if Array.length newArray /= Array.length htmlNodeArray then
                Err <|
                    "Could not create a valid editor node array from html node array:\n"
                        ++ List.foldr
                            (++)
                            ""
                            (List.map (\err -> "\n" ++ err) errList)

            else
                Ok <| reduceEditorFragmentArray newArray


htmlNodeToEditorFragment : RichText.Config.Spec.Spec -> List RichText.Model.Mark.Mark -> RichText.Model.HtmlNode.HtmlNode -> Result String RichText.Node.Fragment
htmlNodeToEditorFragment spec marks node =
    case node of
        RichText.Model.HtmlNode.TextNode s ->
            Ok <|
                RichText.Node.InlineFragment <|
                    Array.fromList
                        [ RichText.Model.Node.Text <|
                            (RichText.Model.Text.empty
                                |> RichText.Model.Text.withText (String.replace RichText.Internal.Constants.zeroWidthSpace "" s)
                                |> RichText.Model.Text.withMarks marks
                            )
                        ]

        _ ->
            let
                definitions : List RichText.Config.ElementDefinition.ElementDefinition
                definitions =
                    RichText.Config.Spec.elementDefinitions spec

                maybeElementAndChildren :
                    Maybe
                        ( RichText.Config.ElementDefinition.ElementDefinition
                        , ( RichText.Model.Element.Element
                          , Array RichText.Model.HtmlNode.HtmlNode
                          )
                        )
                maybeElementAndChildren =
                    List.foldl
                        (\definition result ->
                            case result of
                                Nothing ->
                                    case RichText.Config.ElementDefinition.fromHtmlNode definition definition node of
                                        Nothing ->
                                            Nothing

                                        Just v ->
                                            Just ( definition, v )

                                Just _ ->
                                    result
                        )
                        Nothing
                        definitions
            in
            case maybeElementAndChildren of
                Just ( definition, ( element, children ) ) ->
                    let
                        contentType : RichText.Config.ElementDefinition.ContentType
                        contentType =
                            RichText.Config.ElementDefinition.contentType definition
                    in
                    if contentType == RichText.Internal.Definitions.InlineLeafNodeType then
                        Ok <|
                            RichText.Node.InlineFragment <|
                                Array.fromList
                                    [ RichText.Model.Node.InlineElement <|
                                        RichText.Model.InlineElement.inlineElement element marks
                                    ]

                    else
                        let
                            childArr : Result String RichText.Model.Node.Children
                            childArr =
                                children
                                    |> Array.map (htmlNodeToEditorFragment spec [])
                                    |> arrayToChildNodes contentType
                        in
                        case childArr of
                            Err s ->
                                Err s

                            Ok childNodes ->
                                Ok <| RichText.Node.BlockFragment <| Array.fromList [ RichText.Model.Node.block element childNodes ]

                Nothing ->
                    case htmlNodeToMark spec node of
                        Nothing ->
                            Err "No mark or node matches the spec"

                        Just ( mark, children ) ->
                            let
                                newMarks : List RichText.Model.Mark.Mark
                                newMarks =
                                    RichText.Model.Mark.toggle
                                        RichText.Model.Mark.Add
                                        (RichText.Model.Mark.markOrderFromSpec spec)
                                        mark
                                        marks
                            in
                            children
                                |> Array.map (htmlNodeToEditorFragment spec newMarks)
                                |> arrayToFragment


htmlNodeToMark : RichText.Config.Spec.Spec -> RichText.Model.HtmlNode.HtmlNode -> Maybe ( RichText.Model.Mark.Mark, Array RichText.Model.HtmlNode.HtmlNode )
htmlNodeToMark spec node =
    List.foldl
        (\definition result ->
            case result of
                Nothing ->
                    case RichText.Config.MarkDefinition.fromHtmlNode definition definition node of
                        Nothing ->
                            Nothing

                        Just m ->
                            Just m

                Just _ ->
                    result
        )
        Nothing
        (RichText.Config.Spec.markDefinitions spec)


reduceEditorFragmentArray : Array RichText.Node.Fragment -> Array RichText.Node.Fragment
reduceEditorFragmentArray fragmentArray =
    Array.foldl
        (\fragment arr ->
            case Array.get (Array.length arr - 1) arr of
                Nothing ->
                    Array.push fragment arr

                Just prevFragment ->
                    case prevFragment of
                        RichText.Node.InlineFragment pilf ->
                            case fragment of
                                RichText.Node.InlineFragment ilf ->
                                    Array.set (Array.length arr - 1) (RichText.Node.InlineFragment (Array.append pilf ilf)) arr

                                RichText.Node.BlockFragment _ ->
                                    Array.push fragment arr

                        RichText.Node.BlockFragment pbnf ->
                            case fragment of
                                RichText.Node.InlineFragment _ ->
                                    Array.push fragment arr

                                RichText.Node.BlockFragment bnf ->
                                    Array.set (Array.length arr - 1) (RichText.Node.BlockFragment (Array.append pbnf bnf)) arr
        )
        Array.empty
        fragmentArray


arrayToChildNodes : RichText.Internal.Definitions.ContentType -> Array (Result String RichText.Node.Fragment) -> Result String RichText.Model.Node.Children
arrayToChildNodes contentType results =
    if Array.isEmpty results then
        case contentType of
            RichText.Internal.Definitions.BlockLeafNodeType ->
                Ok RichText.Model.Node.Leaf

            _ ->
                Err "Invalid node type for empty fragment result array"

    else
        case arrayToFragment results of
            Err e ->
                Err e

            Ok fragment ->
                case fragment of
                    RichText.Node.InlineFragment ilf ->
                        case contentType of
                            RichText.Internal.Definitions.TextBlockNodeType _ ->
                                Ok <| RichText.Model.Node.inlineChildren ilf

                            _ ->
                                Err "I received an inline leaf fragment, but the node I parsed doesn't accept this child type"

                    RichText.Node.BlockFragment bnf ->
                        case contentType of
                            RichText.Internal.Definitions.BlockNodeType _ ->
                                Ok <| RichText.Model.Node.blockChildren bnf

                            _ ->
                                Err "I received a block node fragment, but the node I parsed doesn't accept this child type"


arrayToFragment : Array (Result String RichText.Node.Fragment) -> Result String RichText.Node.Fragment
arrayToFragment results =
    let
        aResult : Result String (Array RichText.Node.Fragment)
        aResult =
            Array.foldl
                (\fragmentResult arrayResult ->
                    case arrayResult of
                        Err e ->
                            Err e

                        Ok arr ->
                            case fragmentResult of
                                Err e ->
                                    Err e

                                Ok fragment ->
                                    Ok <| Array.push fragment arr
                )
                (Ok Array.empty)
                results
    in
    case aResult of
        Err e ->
            Err e

        Ok result ->
            let
                reducedArray : Array RichText.Node.Fragment
                reducedArray =
                    reduceEditorFragmentArray result
            in
            case Array.get 0 reducedArray of
                Nothing ->
                    Err "Unable to parse an editor fragment from the results"

                Just fragment ->
                    if Array.length reducedArray /= 1 then
                        Err "I received both inline and block fragments, which is invalid."

                    else
                        Ok fragment


stringToHtmlNodeArray : String -> Result String (Array RichText.Model.HtmlNode.HtmlNode)
stringToHtmlNodeArray html =
    case Html.Parser.run html of
        Err _ ->
            Err "Could not parse html string"

        Ok nodeList ->
            Ok <| nodeListToHtmlNodeArray nodeList


nodeListToHtmlNodeArray : List Html.Parser.Node -> Array RichText.Model.HtmlNode.HtmlNode
nodeListToHtmlNodeArray nodeList =
    nodeList
        |> List.concatMap
            (\n ->
                case n of
                    Html.Parser.Element name attributes children ->
                        -- We filter meta tags because chrome adds it to the pasted text/html
                        if String.toLower name /= "meta" then
                            [ RichText.Model.HtmlNode.ElementNode name attributes <| nodeListToHtmlNodeArray children ]

                        else
                            []

                    Html.Parser.Text s ->
                        [ RichText.Model.HtmlNode.TextNode s ]

                    Html.Parser.Comment _ ->
                        []
            )
        |> Array.fromList


markDefinitionWithDefault : RichText.Model.Mark.Mark -> RichText.Config.Spec.Spec -> RichText.Config.MarkDefinition.MarkDefinition
markDefinitionWithDefault mark spec =
    let
        name : String
        name =
            RichText.Internal.Definitions.nameFromMark mark
    in
    Maybe.withDefault
        (RichText.Config.MarkDefinition.defaultMarkDefinition name)
        (RichText.Config.Spec.markDefinition name spec)


elementDefinitionWithDefault : RichText.Model.Element.Element -> RichText.Config.Spec.Spec -> RichText.Config.ElementDefinition.ElementDefinition
elementDefinitionWithDefault ele spec =
    let
        name : String
        name =
            RichText.Internal.Definitions.nameFromElement ele
    in
    Maybe.withDefault
        (RichText.Config.ElementDefinition.defaultElementDefinition
            name
            "block"
            (RichText.Config.ElementDefinition.blockNode [])
        )
        (RichText.Config.Spec.elementDefinition name spec)
