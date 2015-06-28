var Signer = require('../lib');

var reqDate = '2015-06-27T01:08:24.910Z';

var signer = new Signer();
var req = signer.sign({
  method: 'POST',
  path: '/あいうf/___ABC/いいい',
  query: 'aaa=bbb&ccc=dddd&$$bbb="`"`#`"`"',
  headers: {
    'X-Wao-Date': '20140404    0404',
    'X-Wao-Auth': '__     Signd"  b  b  b    "'
  },
  payload: 'aaaaaaaaaaaaaaaa=ccccccccccccccc&bb&fefa',
  date: reqDate,
  signKey: signer.createSignKey('secretKey', reqDate)
});

console.log(req);
