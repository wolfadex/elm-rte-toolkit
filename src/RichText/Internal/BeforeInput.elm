module RichText.Internal.BeforeInput exposing (handleBeforeInput, preventDefaultOnBeforeInputDecoder)

import Json.Decode
import RichText.Config.Command
import RichText.Config.Spec
import RichText.Internal.Editor
import RichText.Internal.Event


preventDefaultOn : RichText.Config.Command.CommandMap -> RichText.Config.Spec.Spec -> RichText.Internal.Editor.Editor -> RichText.Internal.Editor.Message -> ( RichText.Internal.Editor.Message, Bool )
preventDefaultOn commandMap spec editor msg =
    case msg of
        RichText.Internal.Editor.BeforeInputEvent inputEvent ->
            if inputEvent.isComposing || RichText.Internal.Editor.isComposing editor then
                ( msg, False )

            else
                ( msg, shouldPreventDefault commandMap spec editor inputEvent )

        _ ->
            ( msg, False )


shouldPreventDefault : RichText.Config.Command.CommandMap -> RichText.Config.Spec.Spec -> RichText.Internal.Editor.Editor -> RichText.Internal.Event.InputEvent -> Bool
shouldPreventDefault commandMap spec editor inputEvent =
    case handleInputEvent commandMap spec editor inputEvent of
        Err _ ->
            False

        Ok _ ->
            True


preventDefaultOnBeforeInputDecoder : RichText.Internal.Editor.Tagger msg -> RichText.Config.Command.CommandMap -> RichText.Config.Spec.Spec -> RichText.Internal.Editor.Editor -> Json.Decode.Decoder ( msg, Bool )
preventDefaultOnBeforeInputDecoder tagger commandMap spec editor =
    Json.Decode.map (\( i, b ) -> ( tagger i, b )) (Json.Decode.map (preventDefaultOn commandMap spec editor) beforeInputDecoder)


beforeInputDecoder : Json.Decode.Decoder RichText.Internal.Editor.Message
beforeInputDecoder =
    Json.Decode.map RichText.Internal.Editor.BeforeInputEvent
        (Json.Decode.map3 RichText.Internal.Event.InputEvent
            (Json.Decode.maybe (Json.Decode.field "data" Json.Decode.string))
            (Json.Decode.oneOf [ Json.Decode.field "isComposing" Json.Decode.bool, Json.Decode.succeed False ])
            (Json.Decode.field "inputType" Json.Decode.string)
        )


handleInputEvent : RichText.Config.Command.CommandMap -> RichText.Config.Spec.Spec -> RichText.Internal.Editor.Editor -> RichText.Internal.Event.InputEvent -> Result String RichText.Internal.Editor.Editor
handleInputEvent commandMap spec editor inputEvent =
    let
        namedCommandList =
            RichText.Config.Command.namedCommandListFromInputEvent inputEvent commandMap
    in
    RichText.Internal.Editor.applyNamedCommandList namedCommandList spec editor


handleBeforeInput : RichText.Internal.Event.InputEvent -> RichText.Config.Command.CommandMap -> RichText.Config.Spec.Spec -> RichText.Internal.Editor.Editor -> RichText.Internal.Editor.Editor
handleBeforeInput inputEvent commandMap spec editor =
    if inputEvent.isComposing || RichText.Internal.Editor.isComposing editor then
        editor

    else
        case handleInputEvent commandMap spec editor inputEvent of
            Err _ ->
                editor

            Ok newEditor ->
                -- HACK: Android has very strange behavior with regards to before input events, e.g.
                -- prevent default doesn't actually stop the DOM from being modified, so
                -- we're forcing a rerender if we update the editor state on a command
                RichText.Internal.Editor.forceRerender newEditor
