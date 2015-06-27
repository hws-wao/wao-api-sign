'use struct';

var utils = require('./utils');

/**
 * 署名キーを生成する
 * @param  {String} secretKey シークレットキー
 * @param  {String} date      API要求日付(yyyyMMdd)
 * @return {String}           署名キー
 */
exports.create = function (secretKey, date) {
  var kDate = utils.sign(secretKey, date);
  var kSigning = utils.sign(kDate, 'wao-request');
  return new Buffer(kSigning, 'binary').toString('hex');
};
