module TestPath exposing
    ( testDomToEditor
    , testEditorToDom
    )

import Array
import Expect
import RichText.Internal.Path
import RichText.Model.Element
import RichText.Model.Mark
import RichText.Model.Node
import RichText.Model.Text
import SimpleSpec
import Test exposing (Test)


paragraphParams =
    RichText.Model.Element.element SimpleSpec.paragraph []


codeBlockParams =
    RichText.Model.Element.element SimpleSpec.codeBlock []


crazyBlockParams =
    RichText.Model.Element.element SimpleSpec.crazyBlock []


boldMark =
    RichText.Model.Mark.mark SimpleSpec.bold []


paragraphNode =
    RichText.Model.Node.block
        paragraphParams
        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "sample" ])


boldParagraphNode =
    RichText.Model.Node.block
        paragraphParams
        (RichText.Model.Node.inlineChildren <|
            Array.fromList
                [ RichText.Model.Node.Text
                    (RichText.Model.Text.empty
                        |> RichText.Model.Text.withText "sample"
                        |> RichText.Model.Text.withMarks [ boldMark ]
                    )
                ]
        )


crazyBlockNode =
    RichText.Model.Node.block
        crazyBlockParams
        (RichText.Model.Node.inlineChildren <|
            Array.fromList
                [ RichText.Model.Node.plainText "sample" ]
        )


codeBlockNode =
    RichText.Model.Node.block
        codeBlockParams
        (RichText.Model.Node.inlineChildren <| Array.fromList [ RichText.Model.Node.plainText "sample" ])


testDomToEditor : Test
testDomToEditor =
    Test.describe "Tests the transformation function from a dom node path to an editor node path"
        [ Test.test "Test that an empty spec returns the same path" <|
            \_ ->
                Expect.equal (Just [ 0 ]) (RichText.Internal.Path.domToEditor SimpleSpec.simpleSpec paragraphNode [ 0 ])
        , Test.test "Test the empty path" <|
            \_ ->
                Expect.equal (Just []) (RichText.Internal.Path.domToEditor SimpleSpec.simpleSpec paragraphNode [])
        , Test.test "Test invalid path" <|
            \_ ->
                Expect.equal Nothing (RichText.Internal.Path.domToEditor SimpleSpec.simpleSpec paragraphNode [ 1 ])
        , Test.test "Test node spec with custom toHtmlNode" <|
            \_ ->
                Expect.equal (Just [ 0 ]) (RichText.Internal.Path.domToEditor SimpleSpec.simpleSpec codeBlockNode [ 0, 0 ])
        , Test.test "Test invalid node with custom toHtmlNode" <|
            \_ ->
                Expect.equal Nothing (RichText.Internal.Path.domToEditor SimpleSpec.simpleSpec codeBlockNode [ 1, 0 ])
        , Test.test "Test bold spec with custom toHtmlNode" <|
            \_ ->
                Expect.equal (Just [ 0 ]) (RichText.Internal.Path.domToEditor SimpleSpec.simpleSpec boldParagraphNode [ 0, 0 ])
        , Test.test "Test more complicated custom toHtmlNode" <|
            \_ ->
                Expect.equal (Just [ 0 ]) (RichText.Internal.Path.domToEditor SimpleSpec.simpleSpec crazyBlockNode [ 2, 0 ])
        , Test.test "Test more complicated custom toHtmlNode but select the parent in the dom tree" <|
            \_ ->
                Expect.equal (Just []) (RichText.Internal.Path.domToEditor SimpleSpec.simpleSpec crazyBlockNode [ 2 ])
        , Test.test "Test more complicated custom toHtmlNode but select a sibling node in the dom tree" <|
            \_ ->
                Expect.equal (Just []) (RichText.Internal.Path.domToEditor SimpleSpec.simpleSpec crazyBlockNode [ 1, 0 ])
        ]


testEditorToDom : Test
testEditorToDom =
    Test.describe "Tests the transformation function from an editor node path to a dom node path"
        [ Test.test "Test that an empty spec returns the same path" <|
            \_ ->
                Expect.equal (Just [ 0 ]) (RichText.Internal.Path.editorToDom SimpleSpec.simpleSpec paragraphNode [ 0 ])
        , Test.test "Test the empty path" <|
            \_ ->
                Expect.equal (Just []) (RichText.Internal.Path.editorToDom SimpleSpec.simpleSpec paragraphNode [])
        , Test.test "Test invalid path" <|
            \_ ->
                Expect.equal Nothing (RichText.Internal.Path.editorToDom SimpleSpec.simpleSpec paragraphNode [ 1 ])
        , Test.test "Test node spec with custom toHtmlNode" <|
            \_ ->
                Expect.equal (Just [ 0, 0 ]) (RichText.Internal.Path.editorToDom SimpleSpec.simpleSpec codeBlockNode [ 0 ])
        , Test.test "Test invalid node with custom toHtmlNode" <|
            \_ ->
                Expect.equal Nothing (RichText.Internal.Path.editorToDom SimpleSpec.simpleSpec codeBlockNode [ 1 ])
        , Test.test "Test bold spec with custom toHtmlNode" <|
            \_ ->
                Expect.equal (Just [ 0, 0 ]) (RichText.Internal.Path.editorToDom SimpleSpec.simpleSpec boldParagraphNode [ 0 ])
        , Test.test "Test more complicated custom toHtmlNode" <|
            \_ ->
                Expect.equal (Just [ 2, 0 ]) (RichText.Internal.Path.editorToDom SimpleSpec.simpleSpec crazyBlockNode [ 0 ])
        ]
