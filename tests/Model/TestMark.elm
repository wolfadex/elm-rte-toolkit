module Model.TestMark exposing (testSort, testToggle)

import Expect
import RichText.Config.MarkDefinition
import RichText.Definitions
import RichText.Model.Attribute
import RichText.Model.Mark
import Test exposing (Test)


markdownMarkOrder : RichText.Model.Mark.MarkOrder
markdownMarkOrder =
    RichText.Model.Mark.markOrderFromSpec RichText.Definitions.markdown


marksToSort : List RichText.Model.Mark.Mark
marksToSort =
    [ RichText.Model.Mark.mark RichText.Definitions.bold [], RichText.Model.Mark.mark RichText.Definitions.italic [], RichText.Model.Mark.mark RichText.Definitions.code [], RichText.Model.Mark.mark RichText.Definitions.link [] ]


expectedMarksAfterSort : List RichText.Model.Mark.Mark
expectedMarksAfterSort =
    [ RichText.Model.Mark.mark RichText.Definitions.link [], RichText.Model.Mark.mark RichText.Definitions.bold [], RichText.Model.Mark.mark RichText.Definitions.italic [], RichText.Model.Mark.mark RichText.Definitions.code [] ]


dummy1 : RichText.Config.MarkDefinition.MarkDefinition
dummy1 =
    RichText.Config.MarkDefinition.defaultMarkDefinition "dummy1"


dummy2 : RichText.Config.MarkDefinition.MarkDefinition
dummy2 =
    RichText.Config.MarkDefinition.defaultMarkDefinition "dummy2"


marksOutsideOfSpec : List RichText.Model.Mark.Mark
marksOutsideOfSpec =
    [ RichText.Model.Mark.mark RichText.Definitions.bold [], RichText.Model.Mark.mark dummy2 [], RichText.Model.Mark.mark RichText.Definitions.italic [], RichText.Model.Mark.mark dummy1 [], RichText.Model.Mark.mark RichText.Definitions.code [], RichText.Model.Mark.mark RichText.Definitions.link [] ]


expectedMarksOutsideOfSpec : List RichText.Model.Mark.Mark
expectedMarksOutsideOfSpec =
    [ RichText.Model.Mark.mark dummy1 [], RichText.Model.Mark.mark dummy2 [], RichText.Model.Mark.mark RichText.Definitions.link [], RichText.Model.Mark.mark RichText.Definitions.bold [], RichText.Model.Mark.mark RichText.Definitions.italic [], RichText.Model.Mark.mark RichText.Definitions.code [] ]


testSort : Test
testSort =
    Test.describe "Tests that sort works correctly"
        [ Test.test "marks are sorted in the right order" <|
            \_ ->
                Expect.equal expectedMarksAfterSort (RichText.Model.Mark.sort markdownMarkOrder marksToSort)
        , Test.test "marks not in the spec are sorted by alphabetical order in the beginning of the list" <|
            \_ ->
                Expect.equal expectedMarksOutsideOfSpec (RichText.Model.Mark.sort markdownMarkOrder marksOutsideOfSpec)
        ]


beforeAddNewMark : List RichText.Model.Mark.Mark
beforeAddNewMark =
    [ RichText.Model.Mark.mark RichText.Definitions.bold [] ]


afterAddNewMark : List RichText.Model.Mark.Mark
afterAddNewMark =
    [ RichText.Model.Mark.mark RichText.Definitions.bold [], RichText.Model.Mark.mark RichText.Definitions.italic [] ]


beforeAddExistingMark : List RichText.Model.Mark.Mark
beforeAddExistingMark =
    [ RichText.Model.Mark.mark RichText.Definitions.link [ RichText.Model.Attribute.StringAttribute "href" "google.com" ] ]


afterAddExistingMark : List RichText.Model.Mark.Mark
afterAddExistingMark =
    [ RichText.Model.Mark.mark RichText.Definitions.link [ RichText.Model.Attribute.StringAttribute "href" "yahoo.com" ] ]


testToggle : Test
testToggle =
    Test.describe "Tests that toggle works correctly"
        [ Test.test "adding a new mark works as expected" <|
            \_ ->
                Expect.equal
                    afterAddNewMark
                    (RichText.Model.Mark.toggle RichText.Model.Mark.Add markdownMarkOrder (RichText.Model.Mark.mark RichText.Definitions.italic []) beforeAddNewMark)
        , Test.test "adding a mark with the same name replaces the current mark" <|
            \_ ->
                Expect.equal
                    afterAddExistingMark
                    (RichText.Model.Mark.toggle RichText.Model.Mark.Add markdownMarkOrder (RichText.Model.Mark.mark RichText.Definitions.link [ RichText.Model.Attribute.StringAttribute "href" "yahoo.com" ]) beforeAddExistingMark)
        , Test.test "removing a mark works as expected" <|
            \_ ->
                Expect.equal
                    [ RichText.Model.Mark.mark RichText.Definitions.bold [], RichText.Model.Mark.mark RichText.Definitions.italic [] ]
                    (RichText.Model.Mark.toggle RichText.Model.Mark.Remove markdownMarkOrder (RichText.Model.Mark.mark RichText.Definitions.code []) [ RichText.Model.Mark.mark RichText.Definitions.code [], RichText.Model.Mark.mark RichText.Definitions.bold [], RichText.Model.Mark.mark RichText.Definitions.italic [] ])
        , Test.test "flipping a mark that's not in the list should add it" <|
            \_ ->
                Expect.equal
                    [ RichText.Model.Mark.mark RichText.Definitions.bold [], RichText.Model.Mark.mark RichText.Definitions.italic [], RichText.Model.Mark.mark RichText.Definitions.code [] ]
                    (RichText.Model.Mark.toggle RichText.Model.Mark.Flip markdownMarkOrder (RichText.Model.Mark.mark RichText.Definitions.code []) [ RichText.Model.Mark.mark RichText.Definitions.bold [], RichText.Model.Mark.mark RichText.Definitions.italic [] ])
        , Test.test "flipping a mark that's in the list should remove it" <|
            \_ ->
                Expect.equal
                    [ RichText.Model.Mark.mark RichText.Definitions.bold [], RichText.Model.Mark.mark RichText.Definitions.italic [] ]
                    (RichText.Model.Mark.toggle RichText.Model.Mark.Flip markdownMarkOrder (RichText.Model.Mark.mark RichText.Definitions.code []) [ RichText.Model.Mark.mark RichText.Definitions.bold [], RichText.Model.Mark.mark RichText.Definitions.italic [], RichText.Model.Mark.mark RichText.Definitions.code [] ])
        ]
