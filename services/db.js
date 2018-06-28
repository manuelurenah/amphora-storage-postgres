'use strict';

const bluebird = require('bluebird');
var redis = require('../redis'),
  postgres = require('../postgres/client');


function put(key, value) {
  return redis.put(key, value)
    .then(() => postgres.put(key, value));
}

function get(key) {
  return redis.get(key)
    .then(JSON.parse) // Always parse on the way out to match Mongo
    .catch(() => postgres.get(key));
}

function batch(ops) {
  return redis.batch(ops)
    .then(() => postgres.batch(ops));
}

function del(key) {
  // TODO: keys will not always exist in redis, failover gracefully
  return redis.del(key)
    .then(() => postgres.del(key));
}

function createReadStream(options) {
  return postgres.createReadStream(options);
}

module.exports.put = put;
module.exports.get = get;
module.exports.del = del;
module.exports.batch = batch;
module.exports.createReadStream = createReadStream;
