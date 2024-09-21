module Demo exposing (main)

import Html
import Html.Attributes
import Browser
import Url exposing (Url)
import Browser.Navigation
import RichText.Editor


main : Program () Model Msg
main =
    Browser.application
        { init = init
        , subscriptions = subscriptions
        , update = update
        , view = view
        , onUrlRequest = OnUrlChangeRequested
        , onUrlChange = OnUrlChanged
        }


type alias Model =
    { navKey : Browser.Navigation.Key
    }

init : () -> Url -> Browser.Navigation.Key -> ( Model, Cmd Msg )
init () url key =
    ( { navKey = key }
    , Cmd.none
    )

subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


type Msg
    = OnUrlChangeRequested Browser.UrlRequest
    | OnUrlChanged Url


update : Msg -> Model -> ( Model, Cmd msg )
update msg model =
    case msg of
        OnUrlChangeRequested urlRequest ->
            case urlRequest of
                Browser.Internal url ->
                    ( model
                    , Browser.Navigation.pushUrl model.navKey (Url.toString url)
                    )

                Browser.External url ->
                    ( model
                    , Browser.Navigation.load url
                    )
        OnUrlChanged url ->
            ( model, Cmd.none)



view : Model -> Browser.Document Msg
view model =
    { title = "elm-rte-toolkit Demo"
    , body =
        [Html.text "RTE Toolkit"]
    }
