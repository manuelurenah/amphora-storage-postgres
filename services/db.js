'use strict';

var redis = require('../redis'),
  postgres = require('../postgres/client');

/**
 * [put description]
 * @param  {[type]} key   [description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
function put(key, value) {
  return redis.put(key, value)
    .then(() => postgres.put(key, value));
}

/**
 * [get description]
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
function get(key) {
  return redis.get(key)
    .then(JSON.parse) // Always parse on the way out to match Mongo
    .catch(() => postgres.get(key));
}

/**
 * [batch description]
 * @param  {[type]} ops [description]
 * @return {[type]}     [description]
 */
function batch(ops) {
  return redis.batch(ops)
    .then(() => postgres.batch(ops));
}

/**
 * [del description]
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
function del(key) {
  // TODO: keys will not always exist in redis, failover gracefully
  return redis.del(key)
    .then(() => postgres.del(key));
}

/**
 * [createReadStream description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function createReadStream(options) {
  return postgres.createReadStream(options);
}

module.exports.put = put;
module.exports.get = get;
module.exports.del = del;
module.exports.batch = batch;
module.exports.createReadStream = createReadStream;
