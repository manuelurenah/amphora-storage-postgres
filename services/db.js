'use strict';

var redis = require('../redis'),
  postgres = require('../postgres/client'),
  { CACHE_ENABLED } = require('./constants');

/**
 * Write a single value to cache and db
 *
 * @param  {String} key
 * @param  {Object} value
 * @return {Promise}
 */
function put(key, value) {
  return postgres.put(key, value)
    .then((res) => {
      // persist to cache only if cache is set up/enabled, return postgres result regardless
      if (CACHE_ENABLED) {
        return redis.put(key, value).then(() => res);
      }

      return res;
    });
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
  return postgres.batch(ops)
    .then((res) => {
      if (CACHE_ENABLED) {
        return redis.batch(ops).then(() => res);
      }

      return res;
    });
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
