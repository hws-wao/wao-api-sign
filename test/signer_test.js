var assert = require('assert');
var signer = require('../lib/signer.js');

var req = signer.sign({
  method: 'POST',
  path: '/あいう/___ABC/いいい',
  query: 'aaa=bbb&ccc=dddd&$$bbb="`"`#`"`"',
  headers: {
    'X-Wao-Date': '20140404    0404',
    'X-Wao-Auth': '__     Signd"  b  b  b    "'
  },
  payload: 'aaaaaaaaaaaaaaaa=ccccccccccccccc&bb&fefa',
  date: '2015-06-27T01:08:24.910Z',
  signKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
});

console.log(req);
