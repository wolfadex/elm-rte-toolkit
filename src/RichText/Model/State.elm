module RichText.Model.State exposing (State, state, root, selection, withRoot, withSelection)

{-| A `State` consists of a root block and a selection. `State` allows you to keep
track of and manipulate the contents of the editor.

@docs State, state, root, selection, withRoot, withSelection

-}

import RichText.Model.Node
import RichText.Model.Selection


{-| A `State` consists of a root block and a selection. `State` allows you to keep
track of and manipulate the contents of the editor.
-}
type State
    = State Contents


type alias Contents =
    { root : RichText.Model.Node.Block
    , selection : Maybe RichText.Model.Selection.Selection
    }


{-| Creates a `State`. The arguments are as follows:

  - `root` is a block node that represents the root of the editor.

  - `selection` is a `Maybe RichText.Model.Selection.Selection` that is the selected part of the editor

```
root : RichText.Model.Node.Block
root =
    block
        (Element.element doc [])
        (blockChildren <|
            Array.fromList
                [ block
                    (Element.element paragraph [])
                    (inlineChildren <| Array.fromList [ plainText "" ])
                ]
        )

state root Nothing
--> an empty editor state with no selection
```

-}
state : RichText.Model.Node.Block -> Maybe RichText.Model.Selection.Selection -> State
state root_ sel_ =
    State { root = root_, selection = sel_ }


{-| the selection from the state
-}
selection : State -> Maybe RichText.Model.Selection.Selection
selection st =
    case st of
        State s ->
            s.selection


{-| the root node from the state
-}
root : State -> RichText.Model.Node.Block
root st =
    case st of
        State s ->
            s.root


{-| a state with the given selection
-}
withSelection : Maybe RichText.Model.Selection.Selection -> State -> State
withSelection sel st =
    case st of
        State s ->
            State { s | selection = sel }


{-| a state with the given root
-}
withRoot : RichText.Model.Node.Block -> State -> State
withRoot node st =
    case st of
        State s ->
            State { s | root = node }
