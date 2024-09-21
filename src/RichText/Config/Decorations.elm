module RichText.Config.Decorations exposing
    ( Decorations, ElementDecoration, MarkDecoration, emptyDecorations, elementDecorations, markDecorations, topLevelAttributes, withMarkDecorations, withElementDecorations, withTopLevelAttributes
    , Tagger
    , addElementDecoration, addMarkDecoration, selectableDecoration
    )

{-| Decorations are functions which add a list of Html.Attribute to rendered elements and marks. They're
useful for adding things like event listeners and conditional styles/attributes outside of those defined in the spec.


# Decorations

@docs Decorations, ElementDecoration, MarkDecoration, emptyDecorations, elementDecorations, markDecorations, topLevelAttributes, withMarkDecorations, withElementDecorations, withTopLevelAttributes
@docs Tagger


# Helpers

@docs addElementDecoration, addMarkDecoration, selectableDecoration

-}

import Dict exposing (Dict)
import Html
import Html.Attributes
import Html.Events
import RichText.Config.ElementDefinition
import RichText.Config.MarkDefinition
import RichText.Internal.Constants
import RichText.Internal.Editor
import RichText.Model.Element
import RichText.Model.Mark
import RichText.Model.Node
import Set


{-| `Decorations` is a collection of mark and element decorators used in th editor view.


    decorations =
        emptyDecorations
            |> addElementDecoration image (selectableDecoration InternalMsg)

    --> a collection of decorations that contains a single element decoration for image

-}
type Decorations msg
    = Decorations (DecorationsContents msg)


type alias DecorationsContents msg =
    { marks : Dict String (List (MarkDecoration msg))
    , elements : Dict String (List (ElementDecoration msg))
    , topLevelAttributes : List (Html.Attribute msg)
    }


{-| Translates an editor message type into your message type.
-}
type alias Tagger msg =
    RichText.Internal.Editor.Tagger msg


{-| `ElementDecoration` is a type alias for an element decoration function. The arguments
are as follows:

  - the first argument is the path to this node from the editor root
  - the second argument is the element to decorate
  - The third argument is the relative path of the rendered html node. This is useful if you
    want to apply attributes to only a subset of the rendered html nodes of an element.

```
-- A decoration which adds an onclick listener to a checkbox in a custom checkbox item element
toggleCheckboxDecoration : Path -> Element -> Path -> List (Html.Attribute Msg)
toggleCheckboxDecoration editorNodePath element relativeHtmlNodePath =
    let
        checked =
            Maybe.withDefault False (findBoolAttribute "checked" (Element.attributes element))
    in
    if relativeHtmlNodePath == [ 0, 0 ] then
        [ Html.Events.onClick (ToggleCheckedTodoItem editorNodePath (not checked)) ]

    else
        []
```

-}
type alias ElementDecoration msg =
    RichText.Model.Node.Path -> RichText.Model.Element.Element -> RichText.Model.Node.Path -> List (Html.Attribute msg)


{-| `MarkDecoration` is a type alias for an mark decoration function. The arguments
are as follows:

  - the first argument is the path to this node from the editor root
  - the second argument is the mark to decorate
  - the third argument is the relative path of the rendered html node. This is useful if you
    want to apply attributes to only a subset of the rendered html nodes of an element.

```
-- A decoration that adds a highlight class attribute to rendered link marks
highlight : Path -> Mark -> Path -> List (Html.Attribute Msg)
highlight _ _ _ =
    [ Html.Attributes.class "highlight" ]
```

-}
type alias MarkDecoration msg =
    RichText.Model.Node.Path -> RichText.Model.Mark.Mark -> RichText.Model.Node.Path -> List (Html.Attribute msg)


{-| Empty decorations
-}
emptyDecorations : Decorations msg
emptyDecorations =
    Decorations { marks = Dict.empty, elements = Dict.empty, topLevelAttributes = [] }


{-| A dictionary of mark name to a list of mark decorations.
-}
markDecorations : Decorations msg -> Dict String (List (MarkDecoration msg))
markDecorations (Decorations c) =
    c.marks


{-| A dictionary of element names to a list of mark decorations.
-}
elementDecorations : Decorations msg -> Dict String (List (ElementDecoration msg))
elementDecorations (Decorations c) =
    c.elements


{-| The extra attributes added to the node with `contenteditable="true"` set.
-}
topLevelAttributes : Decorations msg -> List (Html.Attribute msg)
topLevelAttributes (Decorations c) =
    c.topLevelAttributes


{-| Creates a decorations object with the given mark decorations set
-}
withMarkDecorations : Dict String (List (MarkDecoration msg)) -> Decorations msg -> Decorations msg
withMarkDecorations marks (Decorations c) =
    Decorations { c | marks = marks }


{-| Creates a decorations object with the given element decorations set
-}
withElementDecorations : Dict String (List (ElementDecoration msg)) -> Decorations msg -> Decorations msg
withElementDecorations elements (Decorations c) =
    Decorations { c | elements = elements }


{-| Creates a decorations object with the given top level attributes, e.g. extra attributes that are added
to the editor node with `contenteditable="true"` set.
-}
withTopLevelAttributes : List (Html.Attribute msg) -> Decorations msg -> Decorations msg
withTopLevelAttributes topLevelAttributes_ (Decorations c) =
    Decorations { c | topLevelAttributes = topLevelAttributes_ }


{-| Adds an element decoration for a defined node.


    decorations =
        emptyDecorations
            |> addElementDecoration image (selectableDecoration InternalMsg)

    --> a collection of decorations that contains a single element decoration for image

-}
addElementDecoration : RichText.Config.ElementDefinition.ElementDefinition -> ElementDecoration msg -> Decorations msg -> Decorations msg
addElementDecoration definition decorator decorations =
    let
        eleDecorators : Dict String (List (ElementDecoration msg))
        eleDecorators =
            elementDecorations decorations

        name : String
        name =
            RichText.Config.ElementDefinition.name definition

        previousDecorations : List (ElementDecoration msg)
        previousDecorations =
            Maybe.withDefault [] (Dict.get name eleDecorators)
    in
    decorations
        |> withElementDecorations (Dict.insert name (decorator :: previousDecorations) eleDecorators)


{-| Adds a mark decoration for a defined mark.


    decorations =
        emptyDecorations
            |> addMarkDecoration link highlight

    --> a collection of decorations that contains a single mark decoration for a link

-}
addMarkDecoration : RichText.Config.MarkDefinition.MarkDefinition -> MarkDecoration msg -> Decorations msg -> Decorations msg
addMarkDecoration definition decorator decorations =
    let
        mDecorators : Dict String (List (MarkDecoration msg))
        mDecorators =
            markDecorations decorations

        name : String
        name =
            RichText.Config.MarkDefinition.name definition

        previousDecorations : List (MarkDecoration msg)
        previousDecorations =
            Maybe.withDefault [] (Dict.get name mDecorators)
    in
    decorations
        |> withMarkDecorations (Dict.insert name (decorator :: previousDecorations) mDecorators)


{-| Useful decoration for selectable elements. Adds an onclick listener that will select the element,
as well as adds an rte-selected class if this item is selected.
-}
selectableDecoration : Tagger msg -> RichText.Model.Node.Path -> RichText.Model.Element.Element -> RichText.Model.Node.Path -> List (Html.Attribute msg)
selectableDecoration tagger editorNodePath elementParameters _ =
    (if Set.member RichText.Internal.Constants.selection (RichText.Model.Element.annotations elementParameters) then
        [ Html.Attributes.class "rte-selected" ]

     else
        []
    )
        ++ [ Html.Events.onClick
                (tagger <|
                    RichText.Internal.Editor.SelectElement editorNodePath
                )
           ]
