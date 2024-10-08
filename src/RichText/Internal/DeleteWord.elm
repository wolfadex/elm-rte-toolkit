module RichText.Internal.DeleteWord exposing (backspaceWordRegex, deleteWordRegex)

{-
   This is a helper module derived from the DraftJS logic for determining how to delete a word.
-}

import Regex exposing (Regex)


punctuationRegexString : String
punctuationRegexString =
    "[.,+*?$|#{}()'\\^\\-\\[\\]\\\\\\/!@%\"~=<>_:;"
        ++ "・、。〈-】〔-〟：-？！-／"
        ++ "［-｀｛-･⸮؟٪-٬؛،؍"
        ++ "﴾﴿᠁।၊။‐-‧‰-⁞]"


chameleonCharactersRegexString : String
chameleonCharactersRegexString =
    "['‘’]"


whitespaceAndPunctuationRegexString : String
whitespaceAndPunctuationRegexString =
    "\\s|(?![_])" ++ punctuationRegexString


deleteWordRegexString : String
deleteWordRegexString =
    "^" ++ "(?:" ++ whitespaceAndPunctuationRegexString ++ ")*" ++ "(?:" ++ chameleonCharactersRegexString ++ "|(?!" ++ whitespaceAndPunctuationRegexString ++ ").)*" ++ "(?:(?!" ++ whitespaceAndPunctuationRegexString ++ ").)"


backspaceWordRegexString : String
backspaceWordRegexString =
    "(?:(?!" ++ whitespaceAndPunctuationRegexString ++ ").)" ++ "(?:" ++ chameleonCharactersRegexString ++ "|(?!" ++ whitespaceAndPunctuationRegexString ++ ").)*" ++ "(?:" ++ whitespaceAndPunctuationRegexString ++ ")*" ++ "$"


deleteWordRegex : Regex
deleteWordRegex =
    Maybe.withDefault Regex.never (Regex.fromString deleteWordRegexString)


backspaceWordRegex : Regex
backspaceWordRegex =
    Maybe.withDefault Regex.never (Regex.fromString backspaceWordRegexString)
