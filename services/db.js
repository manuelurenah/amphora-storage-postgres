'use strict';

var redis = require('../redis'),
  postgres = require('../postgres/client');

/**
 * Write a single value to cache and db
 *
 * @param  {String} key
 * @param  {Object} value
 * @return {Promise}
 */
function put(key, value) {
  return redis.put(key, value)
    .then(() => postgres.put(key, value));
}

/**
 * Return a value from the db or cache. Must
 * return a Object, not stringified JSON
 *
 * @param  {String} key
 * @return {Promise}
 */
function get(key) {
  return redis.get(key)
    .then(JSON.parse) // Always parse on the way out to match Mongo
    .catch(() => postgres.get(key));
}

/**
 * Process a whole group of saves
 *
 * @param  {Array} ops
 * @return {Promise}
 */
function batch(ops) {
  return redis.batch(ops)
    .then(() => postgres.batch(ops));
}

/**
 * Remove a value from cache and db
 *
 * @param  {String} key
 * @return {Promise}
 */
function del(key) {
  return redis.del(key)
    .then(() => postgres.del(key));
}

module.exports.put = put;
module.exports.get = get;
module.exports.getLists = postgres.getLists;
module.exports.del = del;
module.exports.batch = batch;
module.exports.raw = postgres.raw;
module.exports.putMeta = postgres.putMeta;
module.exports.getMeta = postgres.getMeta;
module.exports.patchMeta = postgres.patchMeta;
module.exports.createReadStream = postgres.createReadStream;
