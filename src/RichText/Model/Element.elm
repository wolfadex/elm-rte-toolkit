module RichText.Model.Element exposing (ElementDefinition, Element, element, annotations, attributes, name, withAnnotations, withAttributes)

{-| An element represents the parameters of any non-text node.

@docs ElementDefinition, Element, element, annotations, attributes, name, withAnnotations, withAttributes

-}

import RichText.Internal.Definitions as Internal exposing (ElementDefinition)
import RichText.Model.Attribute exposing (Attribute)
import Set exposing (Set)


{-| An `Element` represents the parameters of non-text nodes. It consists of an element name,
a list of attributes, and a set of annotations.
-}
type alias Element =
    Internal.Element


{-| A `ElementDefinition` contains information on how to serialize/deserialize an editor node,
as well as describes what type of node and what children the node can have.
-}
type alias ElementDefinition =
    Internal.ElementDefinition


{-| Creates an element. The arguments are as follows:

  - The first argument is the `ElementDefinition` that defines this element. Note that even though
    elements require an element definition, it's still safe to use `(==)` because the function arguments
    are not stored on the resulting `Element`.

  - The second argument is element's list of attributes.

```
    element header [IntegerAttribute "level" 1]
    --> creates a header (h1) element
```

-}
element : ElementDefinition -> List Attribute -> Element
element =
    Internal.element


{-| Annotations from an element

    annotations (element horizontal_rule [] (Set.singleton selectable))
    --> Set [ selectable ]

-}
annotations : Element -> Set String
annotations =
    Internal.annotationsFromElement


{-| Attributes from an element

    attributes (element image [StringAttribute "src" "logo.svg"])
    --> [StringAttribute "src" "logo.svg"]

-}
attributes : Element -> List Attribute
attributes =
    Internal.attributesFromElement


{-| Name from an element

    name (element image [StringAttribute "src" "logo.svg"])
    --> "image"

-}
name : Element -> String
name =
    Internal.nameFromElement


{-| An element with the annotations changed to the given set

    element <| withAnnotations (Set.singleton selectable)
    --> an element with the annotations changed to the singleton selectable set

-}
withAnnotations : Set String -> Element -> Element
withAnnotations =
    Internal.elementWithAnnotations


{-| An element with the attributes changed to the given list

    element <| withAnnotations [StringAttribute "src" "logo.svg"]
    --> an element with the attributes changed to the list provided

-}
withAttributes : List Attribute -> Element -> Element
withAttributes =
    Internal.elementWithAttributes
