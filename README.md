# photomosaic.io

This is a web app for computing photomosaics. If you don't know what a
photomosaic is, you can check out the [Wikipedia
article](https://en.wikipedia.org/wiki/Photographic_mosaic).

To try out the app, you can visit [photomosaic.io](http://photomosaic.io).

## Architecture

This is a [React](https://facebook.github.io/react/) app that manages state with
[Redux](http://redux.js.org/) and side effects with [Redux
Saga](https://github.com/yelouafi/redux-saga).

Image processing and photomosaic computation utilize several libraries for
encoding, decoding, and resizing JPG and PNG images along with libraries for
working with multidimensional arrays:

- [inkjet](https://github.com/gchudnov/inkjet)
- [PNG.js](https://github.com/arian/pngjs)
- [pica](https://github.com/nodeca/pica)
- [scijs](https://github.com/scijs)
- [numjs](https://github.com/nicolaspanel/numjs)
- [StringView](https://developer.mozilla.org/en-US/Add-ons/Code_snippets/StringView)

All heavy computations are performed by pools of Web Workers with Round-robin
scheduling.

## Sample Output

[![Recycle](sample_output/recycle.jpg)](sample_output/recycle.jpg)
