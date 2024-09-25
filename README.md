# Rich Text Editor Toolkit

Create rich text editors in Elm.

Rich Text Editor Toolkit is an open source project to make cross platform editors on the web. This package treats contenteditable as an I/O device, and uses browser events and mutation observers to detect changes and update itself. The editor's model is defined and validated by a programmable specification that allows you to create a custom tailored editor that fits your needs.

This package was heavily inspired by other rich text editor frameworks like ProseMirror, Trix, and DraftJS.

## Resources

-   Elm Package: https://package.elm-lang.org/packages/mweiss/elm-rte-toolkit/latest/
-   Demo page: https://wolfadex.github.io/elm-rte-toolkit (source code is in the [demo](demo) directory)
-   Wiki: https://github.com/wolfadex/elm-rte-toolkit/wiki

## Getting started

This package requires some webcomponents to get started.

If you can support ES6, you can include [js/elm-rte-toolkit.js](js/elm-rte-toolkit.js) in your project and import it.

```js
import "elm-rte-toolkit.js";
```

The demo in this repository does it that way.

However, if you want to use a bundler you can import the npm package that has this repository's js compiled to es5 with npm, e.g:

```bash
npm install --save elm-rte-toolkit
```

And in your javascript, you can import it like so:

```js
import "elm-rte-toolkit";
```

### Starting CSS

You can use whatever styles you want for the editor, but you may want to use the following as
a jumping off point. Most importantly, you'll probably want `white-space: pre-wrap;` to distinguish
between multiple spaces:

```css
.rte-main {
    text-align: left;
    outline: none;
    user-select: text;
    -webkit-user-select: text;
    white-space: pre-wrap;
    word-wrap: break-word;
}

.rte-hide-caret {
    caret-color: transparent;
}
```

## Contributing

This package is open-source software, freely distributable under the terms of an [BSD-3-Clause license](LICENSE). The [source code is hosted on GitHub](https://github.com/wolfadex/elm-rte-toolkit).

Contributions in the form of bug reports, pull requests, or thoughtful discussions in the [GitHub issue tracker](https://github.com/wolfadex/elm-rte-toolkit/issues) are welcome. Please see the [Code of Conduct](CODE_OF_CONDUCT.md) for our pledge to contributors.

### Running the demo

To debug the demo locally, run the following from the repository's root directory:

```bash
cd demo
npm run dev
```

To build the demo, run the following from the repository's root directory:

```bash
cd demo
npm run build
```

The demo is hosted with GitHub Pages. To update the demo

1. checkout the gh-pages branch
1. create a new branch, e.g. `git switch -c wolfadex/demo-version-2-0-1`
1. update with the latest changes from the `main` branch
1. switch to the [demo](demo) directory
1. run `npm run build`
1. PR the changes to the `gh-pages` branch

### Running tests

*WARNING* Tests are temporarily disabled and need updating

```bash
npm run test
```

# Notes

This was forked from https://github.com/mweiss/elm-rte-toolkit.

### Goals

-   merge known bug fixes
-   expand the toolkit with more common helpers
