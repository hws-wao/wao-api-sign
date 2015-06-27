var assert = require('assert');
var sigKey = require('../lib/signature_key.js');

var sig1 = sigKey.create("some binary data", "20150625");
var sig2 = sigKey.create("some binary data", "20150625b");
assert.equal(sig1, sig2, 'TEST1: [同じキーで作った署名キーはいつも同じものになる]');

var sig3 = sigKey.create("some binary data", "20150625");
var sig4 = sigKey.create("some binary data data", "20150625");
assert.notEqual(sig3, sig4, 'TEST2: [違うキーで作った署名キーは違う文字列になる]');

console.log('TEST OK');
