'use struct';

module.exports = (function() {
  var Signer = function Sign() {};

  Signer.prototype.sign = require('./signer').sign;

  return Signer;
})();
