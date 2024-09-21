module RichText.Internal.KeyDown exposing
    ( handleKeyDown
    , preventDefaultOnKeyDownDecoder
    )

import Json.Decode
import RichText.Config.Command
import RichText.Config.Spec
import RichText.Internal.Editor
import RichText.Internal.Event


preventDefaultOn : RichText.Config.Command.CommandMap -> RichText.Config.Spec.Spec -> RichText.Internal.Editor.Editor -> RichText.Internal.Editor.Message -> ( RichText.Internal.Editor.Message, Bool )
preventDefaultOn commandMap spec editor msg =
    case msg of
        RichText.Internal.Editor.KeyDownEvent key ->
            if key.isComposing || RichText.Internal.Editor.isComposing editor then
                ( msg, False )

            else
                ( msg, shouldPreventDefault commandMap spec editor key )

        _ ->
            ( msg, False )


shouldPreventDefault : RichText.Config.Command.CommandMap -> RichText.Config.Spec.Spec -> RichText.Internal.Editor.Editor -> RichText.Internal.Event.KeyboardEvent -> Bool
shouldPreventDefault comamndMap spec editor keyboardEvent =
    case handleKeyDownEvent comamndMap spec editor keyboardEvent of
        Err _ ->
            False

        Ok _ ->
            True


preventDefaultOnKeyDownDecoder : RichText.Internal.Editor.Tagger msg -> RichText.Config.Command.CommandMap -> RichText.Config.Spec.Spec -> RichText.Internal.Editor.Editor -> Json.Decode.Decoder ( msg, Bool )
preventDefaultOnKeyDownDecoder tagger commandMap spec editor =
    Json.Decode.map (\( i, b ) -> ( tagger i, b )) (Json.Decode.map (preventDefaultOn commandMap spec editor) keyDownDecoder)


keyDownDecoder : Json.Decode.Decoder RichText.Internal.Editor.Message
keyDownDecoder =
    Json.Decode.map RichText.Internal.Editor.KeyDownEvent <|
        Json.Decode.map7 RichText.Internal.Event.KeyboardEvent
            (Json.Decode.field "keyCode" Json.Decode.int)
            (Json.Decode.field "key" Json.Decode.string)
            (Json.Decode.field "altKey" Json.Decode.bool)
            (Json.Decode.field "metaKey" Json.Decode.bool)
            (Json.Decode.field "ctrlKey" Json.Decode.bool)
            (Json.Decode.field "shiftKey" Json.Decode.bool)
            (Json.Decode.oneOf [ Json.Decode.field "isComposing" Json.Decode.bool, Json.Decode.succeed False ])


handleKeyDownEvent : RichText.Config.Command.CommandMap -> RichText.Config.Spec.Spec -> RichText.Internal.Editor.Editor -> RichText.Internal.Event.KeyboardEvent -> Result String RichText.Internal.Editor.Editor
handleKeyDownEvent commandMap spec editor event =
    let
        namedCommandList =
            RichText.Config.Command.namedCommandListFromKeyboardEvent (RichText.Internal.Editor.shortKey editor) event commandMap
    in
    RichText.Internal.Editor.applyNamedCommandList namedCommandList spec editor


handleKeyDown : RichText.Internal.Event.KeyboardEvent -> RichText.Config.Command.CommandMap -> RichText.Config.Spec.Spec -> RichText.Internal.Editor.Editor -> RichText.Internal.Editor.Editor
handleKeyDown keyboardEvent commandMap spec editor =
    if keyboardEvent.isComposing || RichText.Internal.Editor.isComposing editor then
        editor

    else
        Result.withDefault editor <| handleKeyDownEvent commandMap spec editor keyboardEvent
