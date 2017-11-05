'use strict';

var msgpack = require('./msgpack.codec.js').msgpack;

module.exports = {
    pack:   msgpack.pack,
    unpack: msgpack.unpack,
    encode: msgpack.pack,
    decode: msgpack.unpack,
}
