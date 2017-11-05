# msgpackjs

This is an unmodified fork of [`msgpack-javascript`](https://github.com/msgpack/msgpack-javascript)
version 1.05 (commit [`2cfda99`](https://github.com/andrasq/msgpack-javascript/commit/2cfda99e28b5b7599427300a88a11cfb71ec9eba)
of 2015-02-16 04:04 GMT),
a very fast pure JavaScript msgpack coder with no dependencies.

My intent is to just republish `msgpack-javascript` without alternations, and to track the
original closely.  The version numbers differ to allow independent releases.  I've removed
the original test files and 6mb test data, but added some unit tests to spot-check
correctness and for code coverage, and wrote this readme.

The unit tests cover the basics, but omit Uint8Array, maps, huge arrays or huge objects, and
binary data.  There are a couple of failures, `-Infinity` is decoded as `+Infinity` and its
own encoding of `-Infinity` it decodes as `0`.

## API

### pack( item )

Encode the item and return an array containing the encoded item.  To obtain the
corresponding byte stream, make it into a Buffer:

    var encoded = msgpackjs.pack(object);
    var bytes = new Buffer(encoded);

### unpack( encoded )

Decode the encoded item in the buffer and return the JavaScript object.  The encoded item
can be either an array of numbers or a Buffer.


## Benchmark


## Related Work


- [`msgpack-javascript`](https://github.com/msgpack/msgpack-javascript) - the original sources
- [`msgpack`](https://npmjs.com/package/msgpack) - `msgpack` npm package, much slower
- [`q-msgpack`](https://github.com/andrasq/node-q-msgpack) - my own experimental encoder, no decode

- [`msgpack`](https://npmjs.com/package/msgpack) - compiled msgpack plugin for nodejs
- [`msgpack-js`](https://npmjs.com/package/msgpack-js) - javascript msgpack coder
- [`msgpack-lite`](https://npmjs.com/package/msgpack-lite) - claims to be 90% faster but is slower than msgpack
- [`node-msgpack`](https://github.com/pgriess/node-msgpack) - possibly a diverged version of msgpack
- [`msgpack-javascript`](https://github.com/msgpack/msgpack-javascript) - pure javascript, not nodejs, but very fast
- [`bson`](https://npmjs.com/package/bson) - the official nodejs mongodb BSON format encoder / decoder
- [`qbson`](https://github.com/andrasq/node-qbson) - experimental fast BSON encoder / decoder
- [`q-utf8`](https://npmjs.com/package/q-utf8) - fast javascript utf8 to/from bytes conversion
- [`qtimeit`](https://npmjs.com/package/qtimeit) - accurate benchmarking
- `JSON.stringify` - JavaScript built-in
