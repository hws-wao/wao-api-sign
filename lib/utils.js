'use struct';

var crypto = require('crypto');

/**
 * HMAC-SHA256で署名を作成する
 * @param  {string} key  署名作成のためのキー
 * @param  {string} text 署名作成に使う文字列
 * @return {binary}      署名
 */
exports.sign = function sign(key, text) {
  var hmac = crypto.createHmac('sha256', key);
  hmac.update(text);
  return hmac.digest('binary');
};
