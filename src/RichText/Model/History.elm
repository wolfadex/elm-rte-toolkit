module RichText.Model.History exposing (History, empty, peek, undoList, redoList)

{-| This module contains the type used to store undo/redo history.

@docs History, empty, peek, undoList, redoList

-}

import RichText.Internal.History
import RichText.Model.State


{-| `History` contains the undo deque and redo stack related to undo history.
-}
type alias History =
    RichText.Internal.History.History


{-| Provides an empty `History` with the given config. The config values are as follows:

  - `groupDelayMilliseconds` is the interval which the editor will ignore adding multiple text changes onto the undo stack. This is
    so the history doesn't get overwhelmed by single character changes.
  - `size` is the number of states stored in the history

-}
empty : { groupDelayMilliseconds : Int, size : Int } -> History
empty =
    RichText.Internal.History.empty


{-| Returns the last executed action and previous state on the undo stack.
-}
peek : History -> Maybe ( String, RichText.Model.State.State )
peek =
    RichText.Internal.History.peek


{-| Returns the entire undo stack.
-}
undoList : History -> List ( String, RichText.Model.State.State )
undoList =
    RichText.Internal.History.undoList


{-| Returns the entire redo stack.
-}
redoList : History -> List RichText.Model.State.State
redoList =
    RichText.Internal.History.redoList
