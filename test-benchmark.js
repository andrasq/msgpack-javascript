// to run the benchmark
//   $ npm install qtimeit msgpack@1.0.2 msgpack-js@0.3.0 bson@1.0.4 git+ssh@github.com:andrasq/node-qbson#0.0.11
//   $ node test-benchmark.js

qtimeit = require('qtimeit');
assert = require('assert');

msgpackjs = require('./');
msgpack = require('msgpack');
msgpack_js = require('msgpack-js');
// msgpack_javascript = require('msgpack-javascript');          // broken, cannot packValue() objects
bson = new (require('bson'))();         // version 1.0.4
qbson = require('../qbson/');                                   // http://github.com/andrasq/node-qbson


var data = {"a":1.5,"b":"foo","c":[1,2],"d":true,"e":{}};
var dataBuf = msgpack.pack(data);
var bsonBuf = bson.serialize(data);
var jsonString = JSON.stringify(data);

assert.deepEqual(msgpackjs.unpack(dataBuf), data);
assert.deepEqual(msgpack_js.decode(dataBuf), data);
assert.deepEqual(bson.deserialize(bsonBuf), data);
assert.deepEqual(qbson.decode(bsonBuf), data);
assert.deepEqual(JSON.parse(jsonString), data);

qtimeit.bench.timeGoal = 1;
qtimeit.bench.visualize = true;
qtimeit.bench.showRunDetails = false;
qtimeit.bench.baselineAvg = 500000;
var x;

console.log("AR: msgpackjs benchmark, packing", data);
qtimeit.bench({
    'msgpack 1.0.2 pack': function() {
        x = msgpack.pack(data);
    },

    'msgpack-js 0.3.0 encode': function() {
        x = msgpack_js.encode(data);
    },

    'bson 1.0.4 serialize': function() {
        x = bson.serialize(data);
    },

    'qbson 0.0.11 encode': function() {
        x = qbson.encode(data);
    },

    ' * msgpackjs pack to Array': function() {
        x = msgpackjs.pack(data);
    },

    ' * msgpackjs pack to Buffer': function() {
        x = new Buffer(msgpackjs.pack(data));
    },

    'JSON.stringify': function() {
        x = JSON.stringify(data);
    },
})
console.log("");

console.log("AR: msgpackjs benchmark, unpacking", data);
qtimeit.bench({
    'msgpack 1.0.2 unpack': function() {
        x = msgpack.unpack(dataBuf);
    },

    'msgpack-js 0.3.0 decode': function() {
        x = msgpack_js.encode(dataBuf);
    },

    'bson 1.0.4 deserialize': function() {
        x = bson.deserialize(bsonBuf);
    },

    'qbson 0.0.11 decode': function() {
        x = qbson.decode(bsonBuf);
    },

    ' * msgpackjs unpack Buffer ': function() {
        x = msgpackjs.unpack(dataBuf);
    },

    'JSON.parse': function() {
        x = JSON.parse(jsonString);
    },
})
