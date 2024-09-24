module RichText.Model.Text exposing (Text, empty, text, marks, annotations, withText, withMarks, withAnnotations)

{-| `Text` represents an editor text node and associated mark and annotation metadata.

@docs Text, empty, text, marks, annotations, withText, withMarks, withAnnotations

-}

import RichText.Model.Mark
import Set exposing (Set)


{-| `Text` represents an editor text node and associated mark and annotation metadata.
-}
type Text
    = Text TextContents


type alias TextContents =
    { marks : List RichText.Model.Mark.Mark
    , annotations : Set String
    , text : String
    }


{-| empty `Text`
-}
empty : Text
empty =
    Text { text = "", marks = [], annotations = Set.empty }


{-| marks from `Text`
-}
marks : Text -> List RichText.Model.Mark.Mark
marks parameters =
    case parameters of
        Text c ->
            c.marks


{-| annotations from `Text`
-}
annotations : Text -> Set String
annotations parameters =
    case parameters of
        Text c ->
            c.annotations


{-| text from `Text`
-}
text : Text -> String
text parameters =
    case parameters of
        Text c ->
            c.text


{-| `Text` with the given text
-}
withText : String -> Text -> Text
withText s parameters =
    case parameters of
        Text c ->
            Text { c | text = s }


{-| `Text` with the given annotations
-}
withAnnotations : Set String -> Text -> Text
withAnnotations ann parameters =
    case parameters of
        Text c ->
            Text { c | annotations = ann }


{-| `Text` with the given marks
-}
withMarks : List RichText.Model.Mark.Mark -> Text -> Text
withMarks m parameters =
    case parameters of
        Text c ->
            Text { c | marks = m }
