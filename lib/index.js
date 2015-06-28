'use struct';

module.exports = (function () {
  var Signer = function Sign() {};

  Signer.prototype.sign = require('./signer').sign;
  Signer.prototype.createSignKey = require('./signature_key').create;

  return Signer;
})();
