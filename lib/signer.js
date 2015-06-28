'use struct';

var utils = require('./utils'),
  qs = require('querystring');

/**
 * 正規リクエスト
 *
 * クライアントとサーバー側で同じ文字列を使用して署名することで、
 * 署名の検証を正しく行うことができる。そのためにリクエストを正規化する。
 *
 * @param  {object} args リクエスト情報
 * @param  {string} args.path リクエストされたURI
 * @param  {string} args.method リクエストHTTPメソッド
 * @param  {string} args.query クエリストリング
 * @param  {string} args.headers リクエストヘッダー
 * @param  {string} args.payload リクエストボディ
 * @return {string} 正規化されたリクエスト文字列
 */
function canonicalString(args) {
  var parts = [];
  parts.push(args.method.toUpperCase());
  parts.push(utils.uriEscapePath(args.path));
  parts.push(utils.queryParamsToString(qs.parse(args.query)));
  parts.push(utils.canonicalHeaders(args.headers));
  parts.push(utils.signedHeaders(args.headers));
  parts.push(utils.sha256sum(args.payload));

  return parts.join('\n');
}

/**
 * 署名文字列を作成
 * @param  {string} date                API要求日付 ISO 8601形式
 * @param  {string} canonicalStringHash 正規リクエストのSHA-256ハッシュ値
 * @return {string}                     署名文字列
 */
function signText(date, canonicalStringHash) {
  var parts = [];
  parts.push('HMAC-SHA-256');
  parts.push(date);
  parts.push(canonicalStringHash);

  return parts.join('\n');
}

exports.sign = function sign(args) {
  var cs = canonicalString(args);
  var st = signText(args.date, utils.sha256sum(cs));
  return utils.sign(args.signKey, st).toString('hex');
};
