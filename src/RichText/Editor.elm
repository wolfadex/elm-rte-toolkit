module RichText.Editor exposing
    ( Editor, init, state, shortKey, history, withHistory, changeCount
    , Config, config, commandMap, decorations, spec
    , Message, update, apply, applyList, applyNoForceSelection
    , view, readOnlyView
    )

{-| This is the main module for an editor, and contains functions for initializing, updating, and
rendering an editor.


# Model

@docs Editor, init, state, shortKey, history, withHistory, changeCount


# Config

@docs Config, config, commandMap, decorations, spec


# Update

@docs Message, update, apply, applyList, applyNoForceSelection


# View

@docs view, readOnlyView

-}

import Array exposing (Array)
import Dict
import Html exposing (Html)
import Html.Attributes
import Html.Events
import Html.Keyed
import Json.Decode
import RichText.Annotation
import RichText.Commands
import RichText.Config.Command
import RichText.Config.Decorations
import RichText.Config.ElementDefinition
import RichText.Config.MarkDefinition
import RichText.Config.Spec
import RichText.Internal.BeforeInput
import RichText.Internal.Constants
import RichText.Internal.DomNode
import RichText.Internal.Editor
import RichText.Internal.Event
import RichText.Internal.HtmlNode
import RichText.Internal.KeyDown
import RichText.Internal.Paste
import RichText.Internal.Path
import RichText.Internal.Selection
import RichText.Internal.Spec
import RichText.Model.Element
import RichText.Model.History
import RichText.Model.HtmlNode
import RichText.Model.InlineElement
import RichText.Model.Mark
import RichText.Model.Node
import RichText.Model.Selection
import RichText.Model.State
import RichText.Model.Text
import RichText.Node


{-| This type represents your Editor configuration, e.g. the non-comparable things that define
the behavior of the editor. This includes the document specification, key and input event command
bindings, decorative functions, and tagger function.
-}
type Config msg
    = Config
        { decorations : RichText.Config.Decorations.Decorations msg
        , spec : RichText.Config.Spec.Spec
        , commandMap : RichText.Config.Command.CommandMap
        , toMsg : Message -> msg
        }


{-| Create the config for your `view` and `update` functions.

    import RichText.Commands exposing (defaultCommandMap)
    import RichText.Config.Decorations exposing (emptyDecorations)
    import RichText.Definitions exposing (markdown)

    type MyMsg
        = InternalMsg Message | ...

    myConfig : Config
    myConfig =
        config
            { decorations = emptyDecorations
            , commandMap = defaultCommandMap
            , spec = markdown
            , toMsg = InternalMsg
            }

-}
config :
    { decorations : RichText.Config.Decorations.Decorations msg
    , spec : RichText.Config.Spec.Spec
    , commandMap : RichText.Config.Command.CommandMap
    , toMsg : Message -> msg
    }
    -> Config msg
config cfg =
    Config cfg


{-| The decorations from the config object.
-}
decorations : Config msg -> RichText.Config.Decorations.Decorations msg
decorations cfg =
    case cfg of
        Config c ->
            c.decorations


{-| The spec from the config object.
-}
spec : Config msg -> RichText.Config.Spec.Spec
spec cfg =
    case cfg of
        Config c ->
            c.spec


{-| The commandMap from the config object.
-}
commandMap : Config msg -> RichText.Config.Command.CommandMap
commandMap cfg =
    case cfg of
        Config c ->
            c.commandMap


updateSelection : Maybe RichText.Model.Selection.Selection -> RichText.Config.Spec.Spec -> Editor -> Editor
updateSelection maybeSelection spec_ editor_ =
    let
        editorState =
            state editor_
    in
    case maybeSelection of
        Nothing ->
            editor_ |> RichText.Internal.Editor.withState (editorState |> RichText.Model.State.withSelection maybeSelection)

        Just selection ->
            let
                translatedSelection =
                    RichText.Internal.Selection.domToEditor spec_ (RichText.Model.State.root editorState) selection
            in
            if RichText.Internal.Editor.isComposing editor_ then
                let
                    bufferedState =
                        Maybe.withDefault editorState (RichText.Internal.Editor.bufferedEditorState editor_)
                in
                editor_ |> RichText.Internal.Editor.withBufferedEditorState (Just (bufferedState |> RichText.Model.State.withSelection translatedSelection))

            else
                editor_ |> RichText.Internal.Editor.withState (editorState |> RichText.Model.State.withSelection translatedSelection)


selectElement : RichText.Model.Node.Path -> RichText.Config.Spec.Spec -> Editor -> Editor
selectElement path _ editor_ =
    let
        editorState =
            state editor_

        selection =
            case RichText.Node.next path (RichText.Model.State.root editorState) of
                Just ( b, _ ) ->
                    RichText.Model.Selection.range b 0 path 0

                Nothing ->
                    RichText.Model.Selection.caret path 0
    in
    editor_ |> RichText.Internal.Editor.withState (editorState |> RichText.Model.State.withSelection (Just selection)) |> RichText.Internal.Editor.forceReselection


{-| The editor's internal update function. It's important that the editor process all `Message`
events with the update function so it doesn't go out of sync with the virtual DOM.

    update : Msg -> Model -> ( Model, Cmd Msg )
    update msg model =
        case msg of
            EditorMsg editorMsg ->
                ( { model | editor = RichText.Editor.update config editorMsg model.editor }, Cmd.none )

-}
update : Config msg -> Message -> Editor -> Editor
update cfg msg editor_ =
    case cfg of
        Config c ->
            let
                spec_ =
                    c.spec

                commandMap_ =
                    c.commandMap
            in
            case msg of
                RichText.Internal.Editor.ChangeEvent change ->
                    updateChangeEvent change spec_ editor_

                RichText.Internal.Editor.SelectionEvent selection ->
                    updateSelection selection spec_ editor_

                RichText.Internal.Editor.SelectElement path ->
                    selectElement path spec_ editor_

                RichText.Internal.Editor.BeforeInputEvent inputEvent ->
                    RichText.Internal.BeforeInput.handleBeforeInput inputEvent commandMap_ spec_ editor_

                RichText.Internal.Editor.CompositionStart ->
                    handleCompositionStart editor_

                RichText.Internal.Editor.CompositionEnd ->
                    handleCompositionEnd editor_

                RichText.Internal.Editor.KeyDownEvent e ->
                    RichText.Internal.KeyDown.handleKeyDown e commandMap_ spec_ editor_

                RichText.Internal.Editor.PasteWithDataEvent e ->
                    RichText.Internal.Paste.handlePaste e spec_ editor_

                RichText.Internal.Editor.CutEvent ->
                    handleCut spec_ editor_

                RichText.Internal.Editor.Init e ->
                    handleInitEvent e editor_


handleInitEvent : RichText.Internal.Event.InitEvent -> Editor -> Editor
handleInitEvent initEvent editor_ =
    editor_ |> RichText.Internal.Editor.withShortKey initEvent.shortKey


handleCut : RichText.Config.Spec.Spec -> Editor -> Editor
handleCut spec_ editor_ =
    case applyList [ ( "removeRangeSelection", RichText.Config.Command.transform RichText.Commands.removeRange ) ] spec_ editor_ of
        Err _ ->
            editor_

        Ok e ->
            RichText.Internal.Editor.forceRerender e


textChangesDomToEditor : RichText.Config.Spec.Spec -> RichText.Model.Node.Block -> List RichText.Internal.Event.TextChange -> Maybe (List RichText.Internal.Event.TextChange)
textChangesDomToEditor spec_ editorNode changes =
    List.foldl
        (\( p, text ) maybeAgg ->
            case maybeAgg of
                Nothing ->
                    Nothing

                Just agg ->
                    case RichText.Internal.Path.domToEditor spec_ editorNode p of
                        Nothing ->
                            Nothing

                        Just translatedPath ->
                            Just (( translatedPath, text ) :: agg)
        )
        (Just [])
        changes


deriveTextChanges : RichText.Config.Spec.Spec -> RichText.Model.Node.Block -> RichText.Internal.DomNode.DomNode -> Result String (List RichText.Internal.Event.TextChange)
deriveTextChanges spec_ editorNode domNode =
    let
        htmlNode =
            RichText.Internal.HtmlNode.editorBlockNodeToHtmlNode spec_ editorNode
    in
    RichText.Internal.DomNode.findTextChanges htmlNode domNode


applyForceFunctionOnEditor : (Editor -> Editor) -> Editor -> Editor
applyForceFunctionOnEditor rerenderFunc editor_ =
    rerenderFunc
        (case RichText.Internal.Editor.bufferedEditorState editor_ of
            Nothing ->
                editor_

            Just bufferedEditorState ->
                let
                    newEditor =
                        RichText.Internal.Editor.updateEditorState "buffered" bufferedEditorState editor_
                in
                newEditor
                    |> RichText.Internal.Editor.withBufferedEditorState Nothing
                    |> RichText.Internal.Editor.withComposing False
        )


updateChangeEvent : RichText.Internal.Event.EditorChange -> RichText.Config.Spec.Spec -> Editor -> Editor
updateChangeEvent change spec_ editor_ =
    case change.characterDataMutations of
        Nothing ->
            case Json.Decode.decodeValue RichText.Internal.DomNode.decodeDomNode change.root of
                Err _ ->
                    editor_

                Ok root ->
                    updateChangeEventFullScan change.timestamp change.isComposing root change.selection spec_ editor_

        Just characterDataMutations ->
            updateChangeEventTextChanges
                change.timestamp
                change.isComposing
                (sanitizeMutations characterDataMutations)
                change.selection
                spec_
                editor_


sanitizeMutations : List RichText.Internal.Event.TextChange -> List RichText.Internal.Event.TextChange
sanitizeMutations changes =
    List.map
        (\( p, t ) ->
            if t == RichText.Internal.Constants.zeroWidthSpace then
                ( p, "" )

            else
                ( p, t )
        )
        changes


differentText : RichText.Model.Node.Block -> RichText.Internal.Event.TextChange -> Bool
differentText root ( path, t ) =
    case RichText.Node.nodeAt path root of
        Nothing ->
            True

        -- We'll mark invalid paths as different since it will resolve later when we try to replace the node
        Just node ->
            case node of
                RichText.Node.Inline il ->
                    case il of
                        RichText.Model.Node.Text tl ->
                            RichText.Model.Text.text tl /= t

                        _ ->
                            True

                -- Again, invalid paths will be resolved later, so just mark it as true
                _ ->
                    True


updateChangeEventTextChanges : Int -> Bool -> List RichText.Internal.Event.TextChange -> Maybe RichText.Model.Selection.Selection -> RichText.Config.Spec.Spec -> Editor -> Editor
updateChangeEventTextChanges timestamp composing textChanges selection spec_ editor_ =
    let
        editorComposing =
            composing || RichText.Internal.Editor.isComposing editor_

        -- Fix to issue #4: when composing text, we want to do the text comparison with the
        -- buffered state if it exists.
        stateToCompare =
            if editorComposing then
                Maybe.withDefault (state editor_) (RichText.Internal.Editor.bufferedEditorState editor_)

            else
                state editor_
    in
    case textChangesDomToEditor spec_ (RichText.Model.State.root stateToCompare) textChanges of
        Nothing ->
            applyForceFunctionOnEditor RichText.Internal.Editor.forceRerender editor_

        Just changes ->
            let
                actualChanges =
                    List.filter (differentText (RichText.Model.State.root stateToCompare)) changes
            in
            if List.isEmpty actualChanges then
                editor_

            else
                let
                    editorState =
                        state editor_
                in
                case replaceText (RichText.Model.State.root editorState) actualChanges of
                    Nothing ->
                        applyForceFunctionOnEditor RichText.Internal.Editor.forceRerender editor_

                    Just replacedEditorNodes ->
                        let
                            newEditorState =
                                editorState
                                    |> RichText.Model.State.withSelection (selection |> Maybe.andThen (RichText.Internal.Selection.domToEditor spec_ (RichText.Model.State.root editorState)))
                                    |> RichText.Model.State.withRoot replacedEditorNodes
                        in
                        if editorComposing then
                            editor_
                                |> RichText.Internal.Editor.withBufferedEditorState (Just newEditorState)

                        else
                            let
                                newEditor =
                                    RichText.Internal.Editor.updateEditorStateWithTimestamp (Just timestamp) "textChange" newEditorState editor_
                            in
                            applyForceFunctionOnEditor RichText.Internal.Editor.forceReselection newEditor


updateChangeEventFullScan : Int -> Bool -> RichText.Internal.DomNode.DomNode -> Maybe RichText.Model.Selection.Selection -> RichText.Config.Spec.Spec -> Editor -> Editor
updateChangeEventFullScan timestamp isComposing domRoot selection spec_ editor_ =
    case RichText.Internal.DomNode.extractRootEditorBlockNode domRoot of
        Nothing ->
            applyForceFunctionOnEditor RichText.Internal.Editor.forceCompleteRerender editor_

        Just editorRootDomNode ->
            if needCompleteRerender domRoot then
                applyForceFunctionOnEditor RichText.Internal.Editor.forceCompleteRerender editor_

            else
                case deriveTextChanges spec_ (RichText.Model.State.root (state editor_)) editorRootDomNode of
                    Ok changes ->
                        updateChangeEventTextChanges timestamp isComposing changes selection spec_ editor_

                    Err _ ->
                        applyForceFunctionOnEditor RichText.Internal.Editor.forceRerender editor_


needCompleteRerender : RichText.Internal.DomNode.DomNode -> Bool
needCompleteRerender root =
    case root of
        RichText.Internal.DomNode.DomNode v ->
            let
                cnodes =
                    Maybe.withDefault Array.empty v.childNodes
            in
            Array.length cnodes /= 1


editorChangeDecoder : Json.Decode.Decoder Message
editorChangeDecoder =
    Json.Decode.map RichText.Internal.Editor.ChangeEvent
        (Json.Decode.map5 RichText.Internal.Event.EditorChange
            (Json.Decode.at [ "detail", "root" ] Json.Decode.value)
            (Json.Decode.at [ "detail", "selection" ] selectionDecoder)
            (Json.Decode.maybe (Json.Decode.at [ "detail", "characterDataMutations" ] characterDataMutationsDecoder))
            (Json.Decode.at [ "detail", "timestamp" ] Json.Decode.int)
            (Json.Decode.at [ "detail", "isComposing" ] (Json.Decode.oneOf [ Json.Decode.bool, Json.Decode.succeed False ]))
        )


characterDataMutationsDecoder : Json.Decode.Decoder (List RichText.Internal.Event.TextChange)
characterDataMutationsDecoder =
    Json.Decode.list (Json.Decode.map2 Tuple.pair (Json.Decode.field "path" (Json.Decode.list Json.Decode.int)) (Json.Decode.field "text" Json.Decode.string))


onEditorChange : (Message -> msg) -> Html.Attribute msg
onEditorChange msgFunc =
    Html.Events.on "editorchange" (Json.Decode.map msgFunc editorChangeDecoder)


selectionDecoder : Json.Decode.Decoder (Maybe RichText.Model.Selection.Selection)
selectionDecoder =
    Json.Decode.maybe
        (Json.Decode.map4 RichText.Model.Selection.range
            (Json.Decode.at [ "anchorNode" ] (Json.Decode.list Json.Decode.int))
            (Json.Decode.at [ "anchorOffset" ] Json.Decode.int)
            (Json.Decode.at [ "focusNode" ] (Json.Decode.list Json.Decode.int))
            (Json.Decode.at [ "focusOffset" ] Json.Decode.int)
        )


editorSelectionChangeDecoder : Json.Decode.Decoder Message
editorSelectionChangeDecoder =
    Json.Decode.map RichText.Internal.Editor.SelectionEvent
        (Json.Decode.at [ "detail" ] selectionDecoder)


pasteWithDataDecoder : Json.Decode.Decoder Message
pasteWithDataDecoder =
    Json.Decode.map RichText.Internal.Editor.PasteWithDataEvent <|
        Json.Decode.map2
            RichText.Internal.Event.PasteEvent
            (Json.Decode.at [ "detail", "text" ] Json.Decode.string)
            (Json.Decode.at [ "detail", "html" ] Json.Decode.string)


initDecoder : Json.Decode.Decoder Message
initDecoder =
    Json.Decode.map RichText.Internal.Editor.Init <|
        Json.Decode.map
            RichText.Internal.Event.InitEvent
            (Json.Decode.at [ "detail", "shortKey" ] Json.Decode.string)


onCompositionStart : (Message -> msg) -> Html.Attribute msg
onCompositionStart msgFunc =
    Html.Events.on "compositionstart" (Json.Decode.succeed (msgFunc RichText.Internal.Editor.CompositionStart))


onCompositionEnd : (Message -> msg) -> Html.Attribute msg
onCompositionEnd msgFunc =
    Html.Events.on "editorcompositionend" (Json.Decode.succeed (msgFunc RichText.Internal.Editor.CompositionEnd))


onPasteWithData : (Message -> msg) -> Html.Attribute msg
onPasteWithData msgFunc =
    Html.Events.on "pastewithdata" (Json.Decode.map msgFunc pasteWithDataDecoder)


onCut : (Message -> msg) -> Html.Attribute msg
onCut msgFunc =
    Html.Events.on "cut" (Json.Decode.succeed (msgFunc RichText.Internal.Editor.CutEvent))


onInit : (Message -> msg) -> Html.Attribute msg
onInit msgFunc =
    Html.Events.on "editorinit" (Json.Decode.map msgFunc initDecoder)


onEditorSelectionChange : (Message -> msg) -> Html.Attribute msg
onEditorSelectionChange msgFunc =
    Html.Events.on "editorselectionchange" (Json.Decode.map msgFunc editorSelectionChangeDecoder)


replaceText : RichText.Model.Node.Block -> List RichText.Internal.Event.TextChange -> Maybe RichText.Model.Node.Block
replaceText editorNode changes =
    List.foldl
        (\change maybeNode ->
            case maybeNode of
                Nothing ->
                    Nothing

                Just node ->
                    applyTextChange node change
        )
        (Just editorNode)
        changes


applyTextChange : RichText.Model.Node.Block -> RichText.Internal.Event.TextChange -> Maybe RichText.Model.Node.Block
applyTextChange editorNode ( path, text ) =
    case path of
        [] ->
            Nothing

        x :: xs ->
            case RichText.Model.Node.childNodes editorNode of
                RichText.Model.Node.BlockChildren array ->
                    let
                        a =
                            RichText.Model.Node.toBlockArray array
                    in
                    case Array.get x a of
                        Nothing ->
                            Nothing

                        Just cblock ->
                            case applyTextChange cblock ( xs, text ) of
                                Nothing ->
                                    Nothing

                                Just textChangeNode ->
                                    Just <|
                                        (editorNode
                                            |> RichText.Model.Node.withChildNodes (RichText.Model.Node.blockChildren <| Array.set x textChangeNode a)
                                        )

                RichText.Model.Node.InlineChildren array ->
                    if not <| List.isEmpty xs then
                        Nothing

                    else
                        let
                            a =
                                RichText.Model.Node.toInlineArray array
                        in
                        case Array.get x a of
                            Nothing ->
                                Nothing

                            Just inlineNode ->
                                case inlineNode of
                                    RichText.Model.Node.Text contents ->
                                        Just
                                            (editorNode
                                                |> RichText.Model.Node.withChildNodes
                                                    (RichText.Model.Node.inlineChildren <|
                                                        Array.set x
                                                            (RichText.Model.Node.Text
                                                                (contents |> RichText.Model.Text.withText (String.replace RichText.Internal.Constants.zeroWidthSpace "" text))
                                                            )
                                                            a
                                                    )
                                            )

                                    _ ->
                                        Nothing

                RichText.Model.Node.Leaf ->
                    Nothing


selectionAttribute : Maybe RichText.Model.Selection.Selection -> Int -> Int -> String
selectionAttribute maybeSelection renderCount selectionCount =
    case maybeSelection of
        Nothing ->
            "render-count=" ++ String.fromInt renderCount

        Just selection ->
            String.join ","
                [ "anchor-offset=" ++ String.fromInt (RichText.Model.Selection.anchorOffset selection)
                , "anchor-node=" ++ RichText.Model.Node.toString (RichText.Model.Selection.anchorNode selection)
                , "focus-offset=" ++ String.fromInt (RichText.Model.Selection.focusOffset selection)
                , "focus-node=" ++ RichText.Model.Node.toString (RichText.Model.Selection.focusNode selection)
                , "render-count=" ++ String.fromInt renderCount
                , "selection-count=" ++ String.fromInt selectionCount
                ]


onBeforeInput : RichText.Internal.Editor.Tagger msg -> RichText.Config.Command.CommandMap -> RichText.Config.Spec.Spec -> Editor -> Html.Attribute msg
onBeforeInput tagger commandMap_ spec_ editor_ =
    Html.Events.preventDefaultOn "beforeinput" (RichText.Internal.BeforeInput.preventDefaultOnBeforeInputDecoder tagger commandMap_ spec_ editor_)


onKeyDown : RichText.Internal.Editor.Tagger msg -> RichText.Config.Command.CommandMap -> RichText.Config.Spec.Spec -> Editor -> Html.Attribute msg
onKeyDown tagger commandMap_ spec_ editor_ =
    Html.Events.preventDefaultOn "keydown" (RichText.Internal.KeyDown.preventDefaultOnKeyDownDecoder tagger commandMap_ spec_ editor_)


handleCompositionStart : Editor -> Editor
handleCompositionStart editor_ =
    editor_
        |> RichText.Internal.Editor.withComposing True


handleCompositionEnd : Editor -> Editor
handleCompositionEnd editor_ =
    case RichText.Internal.Editor.bufferedEditorState editor_ of
        Nothing ->
            editor_ |> RichText.Internal.Editor.withComposing False

        Just _ ->
            applyForceFunctionOnEditor RichText.Internal.Editor.forceReselection editor_


shouldHideCaret : RichText.Model.State.State -> Bool
shouldHideCaret editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            True

        Just selection ->
            if not <| RichText.Model.Selection.isCollapsed selection then
                False

            else
                case RichText.Node.nodeAt (RichText.Model.Selection.anchorNode selection) (RichText.Model.State.root editorState) of
                    Nothing ->
                        False

                    Just node ->
                        case node of
                            RichText.Node.Block _ ->
                                True

                            RichText.Node.Inline leaf ->
                                case leaf of
                                    RichText.Model.Node.InlineElement _ ->
                                        True

                                    _ ->
                                        False


markCaretSelectionOnEditorNodes : RichText.Model.State.State -> RichText.Model.Node.Block
markCaretSelectionOnEditorNodes editorState =
    case RichText.Model.State.selection editorState of
        Nothing ->
            RichText.Model.State.root editorState

        Just selection ->
            if RichText.Model.Selection.isCollapsed selection then
                RichText.Annotation.annotateSelection selection (RichText.Model.State.root editorState)

            else
                RichText.Model.State.root editorState


editorToDomSelection : RichText.Config.Spec.Spec -> Editor -> Maybe RichText.Model.Selection.Selection
editorToDomSelection spec_ editor_ =
    case RichText.Model.State.selection (state editor_) of
        Nothing ->
            Nothing

        Just selection ->
            RichText.Internal.Selection.editorToDom spec_ (RichText.Model.State.root (state editor_)) selection


{-| Take an editor model and config and render it in the DOM.
-}
view : Config msg -> Editor -> Html msg
view cfg editor_ =
    case cfg of
        Config c ->
            let
                tagger =
                    c.toMsg

                commandMap_ =
                    c.commandMap

                decorations_ =
                    c.decorations

                spec_ =
                    c.spec

                state_ =
                    state editor_
            in
            Html.Keyed.node "elm-editor"
                [ onEditorChange tagger
                , onEditorSelectionChange tagger
                , onCompositionStart tagger
                , onCompositionEnd tagger
                , onPasteWithData tagger
                , onCut tagger
                , onInit tagger
                ]
                [ ( String.fromInt (RichText.Internal.Editor.completeRerenderCount editor_)
                  , Html.Keyed.node "div"
                        ([ Html.Attributes.contenteditable True
                         , Html.Attributes.class "rte-main"
                         , Html.Attributes.attribute "data-rte-main" "true"
                         , Html.Attributes.classList [ ( "rte-hide-caret", shouldHideCaret state_ ) ]
                         , onBeforeInput tagger commandMap_ spec_ editor_
                         , onKeyDown tagger commandMap_ spec_ editor_
                         ]
                            ++ RichText.Config.Decorations.topLevelAttributes decorations_
                        )
                        [ ( String.fromInt (RichText.Internal.Editor.renderCount editor_)
                          , viewEditorBlockNode
                                spec_
                                decorations_
                                []
                                (markCaretSelectionOnEditorNodes state_)
                          )
                        ]
                  )
                , ( "selectionstate"
                  , Html.node "selection-state"
                        [ Html.Attributes.attribute
                            "selection"
                            (selectionAttribute
                                (editorToDomSelection spec_ editor_)
                                (RichText.Internal.Editor.renderCount editor_)
                                (RichText.Internal.Editor.selectionCount editor_)
                            )
                        ]
                        []
                  )
                ]


{-| Renders the contents of the editor with `contenteditable` set to false and the event listeners
removed.
-}
readOnlyView : Config msg -> Editor -> Html msg
readOnlyView cfg editor_ =
    case cfg of
        Config c ->
            let
                decorations_ =
                    c.decorations

                spec_ =
                    c.spec

                state_ =
                    state editor_
            in
            Html.node "div"
                ([ Html.Attributes.class "rte-main"
                 , Html.Attributes.attribute "data-rte-main" "true"
                 ]
                    ++ RichText.Config.Decorations.topLevelAttributes decorations_
                )
                [ viewEditorBlockNode
                    spec_
                    decorations_
                    []
                    (markCaretSelectionOnEditorNodes state_)
                ]


viewHtmlNode : RichText.Model.HtmlNode.HtmlNode -> List (RichText.Model.Node.Path -> List (Html.Attribute msg)) -> Array (Html msg) -> RichText.Model.Node.Path -> Html msg
viewHtmlNode node decorators vdomChildren backwardsRelativePath =
    case node of
        RichText.Model.HtmlNode.ElementNode name attributes children ->
            let
                childNodes =
                    if children == RichText.Internal.HtmlNode.childNodesPlaceholder then
                        vdomChildren

                    else
                        Array.indexedMap
                            (\i n -> viewHtmlNode n decorators vdomChildren (i :: backwardsRelativePath))
                            children
            in
            Html.node
                name
                (List.map (\( k, v ) -> Html.Attributes.attribute k v) attributes
                    ++ List.concatMap (\d -> d (List.reverse backwardsRelativePath)) decorators
                )
                (Array.toList childNodes)

        RichText.Model.HtmlNode.TextNode v ->
            Html.text v


viewMark : RichText.Config.Spec.Spec -> RichText.Config.Decorations.Decorations msg -> RichText.Model.Node.Path -> RichText.Model.Mark.Mark -> Array (Html msg) -> Html msg
viewMark spec_ decorations_ backwardsNodePath mark children =
    let
        mDecorators =
            Maybe.withDefault []
                (Dict.get
                    (RichText.Model.Mark.name mark)
                    (RichText.Config.Decorations.markDecorations decorations_)
                )

        decorators =
            List.map (\d -> d (List.reverse backwardsNodePath) mark) mDecorators

        node =
            RichText.Config.MarkDefinition.toHtmlNode (RichText.Internal.Spec.markDefinitionWithDefault mark spec_) mark RichText.Internal.HtmlNode.childNodesPlaceholder
    in
    viewHtmlNode node decorators children []


viewElement : RichText.Config.Spec.Spec -> RichText.Config.Decorations.Decorations msg -> RichText.Model.Element.Element -> RichText.Model.Node.Path -> Array (Html msg) -> Html msg
viewElement spec_ decorations_ elementParameters backwardsNodePath children =
    let
        definition =
            RichText.Internal.Spec.elementDefinitionWithDefault elementParameters spec_

        node =
            RichText.Config.ElementDefinition.toHtmlNode definition elementParameters RichText.Internal.HtmlNode.childNodesPlaceholder

        eDecorators =
            Maybe.withDefault []
                (Dict.get
                    (RichText.Model.Element.name elementParameters)
                    (RichText.Config.Decorations.elementDecorations decorations_)
                )

        decorators =
            List.map (\d -> d (List.reverse backwardsNodePath) elementParameters) eDecorators
    in
    viewHtmlNode node decorators children []


viewInlineLeafTree : RichText.Config.Spec.Spec -> RichText.Config.Decorations.Decorations msg -> RichText.Model.Node.Path -> Array RichText.Model.Node.Inline -> RichText.Model.Node.InlineTree -> Html msg
viewInlineLeafTree spec_ decorations_ backwardsPath inlineLeafArray inlineLeafTree =
    case inlineLeafTree of
        RichText.Model.Node.LeafNode i ->
            case Array.get i inlineLeafArray of
                Just l ->
                    viewInlineLeaf spec_ decorations_ (i :: backwardsPath) l

                Nothing ->
                    -- Not the best thing, but what else can we do if we have an invalid tree?
                    -- This state should be impossible though.
                    Html.div [ Html.Attributes.class "rte-error" ] [ Html.text "Invalid leaf tree." ]

        RichText.Model.Node.MarkNode n ->
            viewMark spec_ decorations_ backwardsPath n.mark <|
                Array.map (viewInlineLeafTree spec_ decorations_ backwardsPath inlineLeafArray) n.children


viewEditorBlockNode : RichText.Config.Spec.Spec -> RichText.Config.Decorations.Decorations msg -> RichText.Model.Node.Path -> RichText.Model.Node.Block -> Html msg
viewEditorBlockNode spec_ decorations_ backwardsPath node =
    viewElement spec_
        decorations_
        (RichText.Model.Node.element node)
        backwardsPath
        (case RichText.Model.Node.childNodes node of
            RichText.Model.Node.BlockChildren l ->
                Array.indexedMap (\i n -> viewEditorBlockNode spec_ decorations_ (i :: backwardsPath) n) (RichText.Model.Node.toBlockArray l)

            RichText.Model.Node.InlineChildren l ->
                Array.map (\n -> viewInlineLeafTree spec_ decorations_ backwardsPath (RichText.Model.Node.toInlineArray l) n) (RichText.Model.Node.toInlineTree l)

            RichText.Model.Node.Leaf ->
                Array.empty
        )


viewText : String -> Html msg
viewText text =
    Html.text
        (if String.isEmpty text then
            RichText.Internal.Constants.zeroWidthSpace

         else
            text
        )


viewInlineLeaf : RichText.Config.Spec.Spec -> RichText.Config.Decorations.Decorations msg -> RichText.Model.Node.Path -> RichText.Model.Node.Inline -> Html msg
viewInlineLeaf spec_ decorations_ backwardsPath leaf =
    case leaf of
        RichText.Model.Node.InlineElement l ->
            viewElement spec_ decorations_ (RichText.Model.InlineElement.element l) backwardsPath Array.empty

        RichText.Model.Node.Text v ->
            viewText (RichText.Model.Text.text v)


{-| `Editor` represents the entire state of the editor, and is what you store in your model.
-}
type alias Editor =
    RichText.Internal.Editor.Editor


{-| Initializes an editor

    docNode : Block
    docNode =
        block
            (Element.element doc [])
            (blockChildren <|
                Array.fromList
                    [ block
                        (Element.element paragraph [])
                        (inlineChildren <| Array.fromList [ plainText "Hello world" ])
                    ]
            )

    init <| State.state docNode Nothing

-}
init : RichText.Model.State.State -> Editor
init =
    RichText.Internal.Editor.editor


{-| The internal events that an editor has to respond to.
-}
type alias Message =
    RichText.Internal.Editor.Message


{-| Retrieves the current state from the editor
-}
state : Editor -> RichText.Model.State.State
state =
    RichText.Internal.Editor.state


{-| Retrieves the current history from the editor
-}
history : Editor -> RichText.Model.History.History
history =
    RichText.Internal.Editor.history


{-| The editor shortKey is a platform dependent key for command map bindings. It is initialized
to either `"Control"` or `"Meta"` depending on if the editor webcomponent detects if the platform
is mac/iOS or something else. Note that this gets updated after the editor has been rendered, and
defaults to `"Meta"`.
-}
shortKey : Editor -> String
shortKey =
    RichText.Internal.Editor.shortKey


{-| Change count is a counter that gets incremented any time the editor's state gets updated. You
may want to use this as a quick way to see if the editor has changed via a command after the
`update` function. Note: this is a stop gap until a good story for how programmers can react to
editor state changes has been thought out.
-}
changeCount : Editor -> Int
changeCount =
    RichText.Internal.Editor.changeCount


{-| Sets the history on the editor.

    editor
        |> withHistory newHistory

-}
withHistory : RichText.Model.History.History -> Editor -> Editor
withHistory =
    RichText.Internal.Editor.withHistory


{-| Apply a list of named commands to the editor to try in order, returning the updated editor after
the first command has been successful. If no command was successful, a String describing the last
command's error is returned.

This method stops execution of the commands after the first success. Its intent is to
allow you to group your commands for different contexts, like lift, join, split,
into one chained command. If you want multiple commands to be executed, you may want to compose
the respective transform functions or call apply for each command.

As with the `apply` command, each command is validated after it is applied, and if successful,
the editor state is reduced and the history is updated.

    liftBlock : Spec -> Model -> Model
    liftBlock spec model =
        { model
            | editor =
                Result.withDefault model.editor
                    (applyList
                        [ ( "liftList"
                          , transform <| RichText.List.lift defaultListDefinition
                          )
                        , ( "lift"
                          , transform <| lift
                          )
                        ]
                        spec
                        model.editor
                    )
        }

-}
applyList : RichText.Config.Command.NamedCommandList -> RichText.Config.Spec.Spec -> Editor -> Result String Editor
applyList =
    RichText.Internal.Editor.applyNamedCommandList


{-| Apply a named command to the editor. If the command was successful, the resulting editor
will be returned, otherwise a String describing the command's error is returned.

Note that after the command is executed, it is validated against the spec. If it is not valid, then
an error is returned. If the command is successful and validated, the resulting editor state is reduced
(via `RichText.State.reduce`) and the history is updated.

    wrapBlockNode : Spec -> Model -> Model
    wrapBlockNode spec model =
        { model
            | editor =
                Result.withDefault model.editor
                    (apply
                        ( "wrapBlockquote"
                        , transform <|
                            wrap
                                identity
                                (element blockquote [])
                        )
                        spec
                        model.editor
                    )
        }

-}
apply : RichText.Config.Command.NamedCommand -> RichText.Config.Spec.Spec -> Editor -> Result String Editor
apply =
    RichText.Internal.Editor.applyCommand


{-| Same as `apply`, but the selection state is not forced to update if it hasn't changed. This normally
should not be used, but can be useful for situations like if you have an embedded input element in a
"contentediable=false" wrapper that requires focus or independent selection.
-}
applyNoForceSelection : RichText.Config.Command.NamedCommand -> RichText.Config.Spec.Spec -> Editor -> Result String Editor
applyNoForceSelection =
    RichText.Internal.Editor.applyCommandNoForceSelection
