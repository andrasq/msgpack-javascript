# msgpackjs

[![Build Status](https://api.travis-ci.org/andrasq/node-msgpackjs.svg?branch=master)](https://travis-ci.org/andrasq/node-msgpackjs?branch=master)
[![Coverage Status](https://codecov.io/github/andrasq/node-msgpackjs/coverage.svg?branch=master)](https://codecov.io/github/andrasq/node-msgpackjs?branch=master)

This is an unmodified fork of the github [`msgpack-javascript`](https://github.com/msgpack/msgpack-javascript),
a very fast browser-friendly pure JavaScript msgpack coder with no dependencies.

`msgpack-javascript` (the github repo, not the npm package by that name) is the fastest
msgpack coder I've come across.  This is a nodejs npm package that includes all the
original sources and exports two methods, `pack` and `unpack`.

The msgpack format is described at
[https://github.com/msgpack/msgpack/blob/master/spec.md](https://github.com/msgpack/msgpack/blob/master/spec.md).


## Description

The goal is to republish `msgpack-javascript`, and to track the original closely.  I've
removed the original test files and 6mb test data, but added some unit tests to spot-check
correctness and for code coverage, and wrote this readme.  The version numbers differ to
allow independent releases; the initial package version is `0.9.0` and is derived from
the latest gitub `msgpack-javascript`, version 1.05 of 2015-02-16 04:04 GMT
commit [`2cfda99`](https://github.com/andrasq/msgpack-javascript/commit/2cfda99e28b5b7599427300a88a11cfb71ec9eba).

My unit tests cover the basics and omit Uint8Array, maps, huge arrays or huge objects, and
binary data.  There are a couple of failures, `-Infinity` is decoded as `+Infinity` and its
own encoding of `-Infinity` it decodes as `0`.  These are errata to be fixed.


## API

Unlike other msgpack coders, this one encodes to an array of byte values, not to a Buffer.

### pack( item )

Encode the item and return an Array containing the encoded item.  To obtain the
corresponding byte stream, make it into a Buffer:

    var msgpack = require('msgpackjs');
    var encoded = msgpackjs.pack(object);
    var bytes = new Buffer(encoded);

### unpack( encoded )

Decode the encoded item in the buffer and return the JavaScript object.  The encoded item
can be either an array of numbers or a Buffer.

    var msgpack = require('msgpackjs');
    var decoded = msgpackjs.unpack(bytes);


## Benchmark

The results from the included `test-benchmark.js`.  JSON and BSON are included for
comparison, they are similar data bundles.

    AR: msgpackjs benchmark, packing { a: 1.5, b: 'foo', c: [ 1, 2 ], d: true, e: {} }
    qtimeit=0.21.0 node=8.6.0 v8=6.0.287.53 platform=linux kernel=4.14.0-rc5-amd64 up_threshold=false
    arch=ia32 mhz=4514 cpuCount=8 cpu="Intel(R) Core(TM) i7-6700K CPU @ 4.00GHz"
    name                                speed           rate
    msgpack 1.0.2 pack                208,184 ops/sec    416 >>
    msgpack-js 0.3.0 encode           230,048 ops/sec    460 >>
    bson 1.0.4 serialize              409,762 ops/sec    820 >>>>
    qbson 0.0.11 encode             1,068,923 ops/sec   2138 >>>>>>>>>>>
     * msgpackjs pack to Array      2,542,821 ops/sec   5086 >>>>>>>>>>>>>>>>>>>>>>>>>
     * msgpackjs pack to Buffer     1,742,438 ops/sec   3485 >>>>>>>>>>>>>>>>>
    JSON.stringify                  1,329,468 ops/sec   2659 >>>>>>>>>>>>>

    AR: msgpackjs benchmark, unpacking { a: 1.5, b: 'foo', c: [ 1, 2 ], d: true, e: {} }
    qtimeit=0.21.0 node=8.6.0 v8=6.0.287.53 platform=linux kernel=4.14.0-rc5-amd64 up_threshold=false
    arch=ia32 mhz=4515 cpuCount=8 cpu="Intel(R) Core(TM) i7-6700K CPU @ 4.00GHz"
    name                                speed           rate
    msgpack 1.0.2 unpack              483,090 ops/sec    966 >>>>>
    msgpack-js 0.3.0 decode         2,818,036 ops/sec   5636 >>>>>>>>>>>>>>>>>>>>>>>>>>>>
    bson 1.0.4 deserialize          1,470,989 ops/sec   2942 >>>>>>>>>>>>>>>
    qbson 0.0.11 decode             3,164,769 ops/sec   6330 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
     * msgpackjs unpack Buffer      2,401,535 ops/sec   4803 >>>>>>>>>>>>>>>>>>>>>>>>
    JSON.parse                      1,202,556 ops/sec   2405 >>>>>>>>>>>>


## TODO

- comprehensive test of utf8 handling (the code rolls its own utf8 coder)
- comprehensive test of `double` and `float` handling (the code rolls its own binary
  32-bit and 64-bit floating-point read/write functions)


## Related Work

- [`msgpack-javascript`](https://github.com/msgpack/msgpack-javascript) - the original sources to on github
- [`msgpackjs`](https://npmjs.com/package/msgpackjs) - the above in an npm package
- [`msgpack`](https://npmjs.com/package/msgpack) - compiled msgpack plugin for nodejs, slow; 2900 KB
- [`msgpack-lite`](https://npmjs.com/package/msgpack-lite) - claims to be 90% faster but is even slower than msgpack; 660 KB
- [`q-msgpack`](https://github.com/andrasq/node-q-msgpack) - my own experimental encoder (no decode); 32 KB
- [`msgpack-javascript`](https://npmjs.com/package/msgpack-javascript) - a partial functionality package
  unrelated to the github version, cannot pack objects; 10,188 KB
- [`msgpack-js`](https://npmjs.com/package/msgpack-js) - javascript msgpack coder; 250 KB
- [`bson`](https://npmjs.com/package/bson) - the official nodejs mongodb BSON format encoder / decoder; 790 KB
- [`qbson`](https://github.com/andrasq/node-qbson) - experimental fast BSON encoder / decoder; 124 KB
- [`qtimeit`](https://npmjs.com/package/qtimeit) - accurate benchmarking
- `JSON.stringify` - JavaScript built-in
