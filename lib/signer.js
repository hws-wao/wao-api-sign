'use struct';

var utils = require('./utils'),
  qs = require('querystring');

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
