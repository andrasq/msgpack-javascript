/**
 * unit test for msgpackjs package
 * 2017-11-04 - AR.
 */

'use strict';

var util = require('util');
var msgpackjs = require('./');

// tuples of [ plain, encoded ]
var string300 = new Array(300+1).join('x');
var string300code = [ 218, 1, 44 ]; for (var i=0; i<300; i++) string300code.push('x'.charCodeAt(0));
var string100k = new Array(100000+1).join('x');
var string100kcode = [ 219, 0, 1, 134, 160 ]; for (var i=0; i<100000; i++) string100kcode.push('x'.charCodeAt(0));
var hash20 = { a:1, bb:2, ccc:3, d:4, e:5, f:6, g:7, h:8, i:9, j:10, k:11, l:12, m:13, n:14, o:15, p:16, q:17, r:18, s:19, t:20 };
var hash20code = [ 222, 0, 20, 161, 97, 1, 162, 98, 98, 2, 163, 99, 99, 99, 3, 161, 100, 4, 161, 101, 5,
    161, 102, 6, 161, 103, 7, 161, 104, 8, 161, 105, 9, 161, 106, 10, 161, 107, 11, 161, 108, 12, 161, 109, 13, 161, 110, 14, 161, 111, 15,
    161, 112, 16, 161, 113, 17, 161, 114, 18, 161, 115, 19, 161, 116, 20 ];
var cyclicHash = { a: 1, b: 2, c: null }; cyclicHash.c = cyclicHash;
var tests = [
    // specials
    [ null, [ 192 ] ],
// FIXME: decodes into null
//    [ undefined, [ 192 ] ],
    [ false, [ 194 ] ],
    [ true, [ 195 ] ],
    [ Infinity, [ 203, 0x7f, 0xf0, 0, 0, 0, 0, 0, 0 ] ],
// FIXME: breaks! decodes into 0
//    [ -Infinity, [ 211, 0, 0, 0, 0, 0, 0, 0, 0 ] ],
// as a double is [ 0xff, 0xf0, 0, 0, 0, 0, 0, 0 ]

    // integers
    [ 0, [0] ],
    [ 1, [1] ],
    [ 127, [127] ],
    [ 128, [204, 128] ],
    [ 1000, [ 205, 3, 232 ] ],
    [ 4e9, [ 206, 238, 107, 40, 0 ] ],
    [ 10e9, [ 207, 0, 0, 0, 2, 84, 11, 228, 0 ] ],
    [ 0, [ 0 ] ],
// TODO: breaks under node-v9, where 0 !== -0 (strictEqual compare fails)
//    [ -0, [ -0 ] ],
    [ -1, [ 255 ] ],
    [ -2, [ 254 ] ],
    [ -127, [ 208, 129 ] ],
    [ 40, [ 40 ] ],
    [ -40, [ 208, 216 ] ],
    [ 0x8000-1, [ 205, 127, 255 ] ],
    [ -0x8000-1, [ 210, 255, 255, 127, 255 ] ],
    [ 0x8000, [ 205, 128, 0 ] ],
    [ -0x8000, [ 210, 255, 255, 128, 0 ] ],
    [ 0x8000+1, [ 205, 128, 1 ] ],
    [ -0x8000+1, [ 209, 128, 1 ] ],
    [ 0x80000000-1, [ 206, 127, 255, 255, 255 ] ],
    [ -0x80000000-1,  [ 211, 255, 255, 255, 255, 127, 255, 255, 255 ] ],
    [ 0x80000000, [ 206, 128, 0, 0, 0 ] ],
    [ -0x80000000, [ 211, 255, 255, 255, 255, 128, 0, 0, 0 ] ],
    [ 0x80000000+1, [ 206, 128, 0, 0, 1 ] ],
    [ -0x80000000+1,  [ 210, 128, 0, 0, 1 ] ],

    // floats
    [ 1.5, [ 203, 63, 248, 0, 0, 0, 0, 0, 0 ] ],
    [ -1.5, [ 203, 191, 248, 0, 0, 0, 0, 0, 0 ] ],

    // short strings
    [ "abcd", [ 164, 97, 98, 99, 100 ] ],
    [ "\u0001\u0012\u0123\u1234", [ 167, 1, 18, 196, 163, 225, 136, 180 ] ],
    [ string300, string300code ],
    [ string100k, string100kcode ],

    // long strings
    [ "abcdefghijklmnopqrstuvwxyz0123456789", [ 217, 36, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110,
        111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57 ] ],

    // arrays
    [ [1], [145, 1] ],
    [ ["a"], [145, 161, 97] ],
    [ [1, "a"], [ 146, 1, 161, 97 ] ],
    [ [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], [ 220, 0, 20, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ] ],
    // objects
    [ { a: 1, b: "b" }, [ 130, 161, 97, 1, 161, 98, 161, 98 ] ],

    // hashes
    [ { a: 1 }, [ 129, 161, 97, 1 ]],
    [ hash20, hash20code ],
];

module.exports = {
    'pack': {
        'should encode NaN': function(t) {
            t.deepEqual(msgpackjs.encode(NaN), [ 203, 255, 255, 255, 255, 255, 255, 255, 255 ]);
            t.done();
        },

/**
NOTE: must also uncache msgpackjs
        'should encode array without Array.isArray': function(t) {
            var isArray = Array.isArray;
            Array.isArray = null;
            var encoded = msgpackjs.pack([1,2,3]);
            Array.isArray = isArray;
            t.deepStrictEqual(encoded, [147, 1, 2, 3]);
            t.done();
        },
**/

        'should encode cyclic hash to false': function(t) {
            t.strictEqual(msgpackjs.pack(cyclicHash), false);
            t.done();
        },

        'should encode to array': function(t) {
            for (var i=0; i<tests.length; i++) {
                //t.equal(msgpackjs.pack(tests[i][0]).length, tests[i][1].length, "length of tests row " + i);
                t.deepEqual(msgpackjs.pack(tests[i][0]), tests[i][1], "tests row " + i);
            }
            t.done();
        },

        'should encode to byte string': function(t) {
            t.equal(msgpackjs.pack([1,2,3], true), '\u0093\u0001\u0002\u0003');
            t.equal(msgpackjs.pack({ a: 1 }, true), '\u0081\u00a1\u0061\u0001');
            t.done();
        },
    },

    'unpack': {
        'should unpack an array': function(t) {
            t.equal(msgpackjs.unpack([1]), 1);
            t.equal(msgpackjs.unpack([ 206, 238, 107, 40, 0 ]), 4e9);
            t.done();
        },

        'should unpack a Buffer': function(t) {
            t.equal(msgpackjs.unpack(new Buffer([2])), 2);
            t.equal(msgpackjs.unpack(new Buffer([ 206, 238, 107, 40, 0 ])), 4e9);
            t.done();
        },

        'should decode NaN from double': function(t) {
            t.ok(isNaN(msgpackjs.unpack([203, 0x7f, 0xf8, 0, 0, 0, 0, 0, 0])));
            t.ok(isNaN(msgpackjs.unpack([203, 0x7f, 0xff, 0, 0, 0, 0, 0, 0])));
            t.ok(isNaN(msgpackjs.unpack([203, 0x7f, 0xff, 0x80, 0, 0, 0, 0, 0])));
            t.ok(isNaN(msgpackjs.decode([ 203, 255, 255, 255, 255, 255, 255, 255, 255 ])));
            t.ok(isNaN(msgpackjs.decode(new Buffer([ 203, 255, 255, 255, 255, 255, 255, 255, 255 ]))));
            t.done();
        },

        'should decode NaN from float': function(t) {
            t.ok(isNaN(msgpackjs.unpack([202, 0x7f, 0xc0, 0, 0])));
            t.ok(isNaN(msgpackjs.unpack([202, 0x7f, 0xdf, 0, 0])));
            t.done();
        },

        // 32-bit floats are encoded differently from 64-bit doubles,
        // though javascript only works with doubles
        'should decode float': function(t) {
            t.strictEqual(msgpackjs.unpack([ 202, 0x00, 0x00, 0x00, 0x00 ]), 0.0);
            t.strictEqual(msgpackjs.unpack([ 202, 0x3f, 0xc0, 0x00, 0x00 ]), 1.5);
            t.strictEqual(msgpackjs.unpack([ 202, 0xbf, 0xc0, 0x00, 0x00 ]), -1.5);
            t.strictEqual(msgpackjs.unpack([ 202, 0x7f, 0x80, 0x00, 0x00 ]), Infinity);
// FIXME: returns Infinity, should be -Infinity
//            t.strictEqual(msgpackjs.unpack([ 202, 0xff, 0x80, 0x00, 0x00 ]), -Infinity);
            t.done();
        },

        'should decode int64, int32, int16 and int8': function(t) {
            t.strictEqual(msgpackjs.unpack([0xd3, 0, 0, 0, 0, 0, 0, 1, 0]), 256);
            t.strictEqual(msgpackjs.unpack([0xd3, 255,255,255,255,255,255,255,255]), -1);
            t.strictEqual(msgpackjs.unpack([0xd2, 0, 0, 1, 0]), 256);
            t.strictEqual(msgpackjs.unpack([0xd2, 255, 255, 255, 254]), -2);
            t.strictEqual(msgpackjs.unpack([0xd1, 2, 0]), 512);
            t.strictEqual(msgpackjs.unpack([0xd1, 255, 253]), -3);
            t.strictEqual(msgpackjs.unpack([0xd0, 127]), 127);
            t.strictEqual(msgpackjs.unpack([0xd0, 128]), -128);
            t.strictEqual(msgpackjs.unpack([0xd0, 255]), -1);
            t.done();
        },

        'should decode 0 from double': function(t) {
            t.strictEqual(msgpackjs.unpack([203, 0x00, 0, 0, 0, 0, 0, 0, 0]), 0.0);
            t.strictEqual(msgpackjs.unpack([203, 0x80, 0, 0, 0, 0, 0, 0, 0]), -0.0);
            t.done();
        },

        'should decode +Infinity from double': function(t) {
            t.strictEqual(msgpackjs.unpack([203, 0x7f, 0xf0, 0, 0, 0, 0, 0, 0]), Infinity);
            t.done();
        },

        'should decode -Infinity from double': function(t) {
// FIXME: decodes it into +Infinity, though this is a valid -Infinity as a double
t.skip();
            t.strictEqual(msgpackjs.unpack([203, 0xff, 0xf0, 0, 0, 0, 0, 0, 0]), -Infinity);
            t.done();
        },

        'should decode arrays of bytes': function(t) {
            for (var i=0; i<tests.length; i++) {
                t.deepStrictEqual(msgpackjs.unpack(tests[i][1]), tests[i][0], "tests row " + i);
            }
            t.done();
        },

        'should decode Buffers of bytes': function(t) {
            for (var i=0; i<tests.length; i++) {
                t.deepStrictEqual(msgpackjs.unpack(new Buffer(tests[i][1])), tests[i][0], "tests row " + i);
            }
            t.done();
        },

        'should decode from a byte string': function(t) {
            t.deepStrictEqual(msgpackjs.unpack('\u0093\u0001\u0002\u0003'), [1,2,3]);
            t.deepStrictEqual(msgpackjs.unpack('\u0081\u00a1\u0061\u0001'), { a: 1 });
            t.done();
        },
    },
}
