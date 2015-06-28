'use struct';

var crypto = require('crypto');

function map(obj, callback) {
  return Object.keys(obj).map(function (key) {
    if (callback) {
      return callback(key, obj[key]);
    } else {
      return [key, obj[key]];
    }
  });
}

function sortHeaders(a, b) {
  return a[0].toLowerCase() < b[0].toLowerCase() ? -1 : 1;
}

/**
 * HMAC-SHA256で署名を作成する
 * @param  {string} key  署名作成のためのキー
 * @param  {string} text 署名作成に使う文字列
 * @return {binary}      署名
 */
exports.sign = function sign(key, text, type) {
  var hmac = crypto.createHmac('sha256', key);
  hmac.update(text);
  var _type = type | 'binary';
  return hmac.digest(_type);
};

/**
 * SHA256でハッシュする
 * @param  {string} text ハッシュする文字列
 * @return {string}      16進表示のハッシュ値
 */
exports.sha256sum = function sha256sum(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
};

exports.uriEscape = function uriEscape(string) {
  var output = encodeURIComponent(string);
  output = output.replace(/[*]/g, function (ch) {
    return '%' + ch.charCodeAt(0).toString(16).toUpperCase();
  });
  return output;
};

exports.uriEscapePath = function uriEscapePath(path) {
  return path.split('/').map(function (string) {
    return exports.uriEscape(string);
  }).join('/');
};

exports.queryParamsToString = function queryParamsToString(params) {
  var escape = exports.uriEscape;
  var sortedKeys = Object.keys(params).sort();

  var items = sortedKeys.map(function (name) {
    var value = params[name];
    var ename = escape(name);
    var result = ename + '=';
    if (Array.isArray(value)) {
      var vals = [];
      util.arrayEach(value, function (item) {
        vals.push(escape(item));
      });
      result = ename + '=' + vals.sort().join('&' + ename + '=');
    } else if (value !== undefined && value !== null) {
      result = ename + '=' + escape(value);
    }
    return result;
  });

  return items.join('&');
};

exports.canonicalHeaders = function canonicalHeaders(headers) {
  return map(headers).sort(sortHeaders).map(function (header) {
    var key = header[0].toLowerCase();
    return key + ':' + exports.canonicalHeaderValues(header[1].toString());
  }).join('\n');
};

exports.canonicalHeaderValues = function canonicalHeaderValues(values) {
  return values.replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '');
};

exports.signedHeaders = function signedHeaders(headers) {
  return Object.keys(headers).map(function (key) {
    return key.toLowerCase();
  }).sort().join(';');
};
