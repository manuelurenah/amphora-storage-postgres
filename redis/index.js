'use strict';

const bluebird = require('bluebird'),
  redis = bluebird.promisifyAll(require('redis')),
  { REDIS_URL, REDIS_HASH } = require('../services/constants'),
  { isPublished, isUri, isUser } = require('clayutils'),
  { notFoundError, logGenericError } = require('../services/errors');


/**
 * Connect to Redis and store the client
 *
 * @return {Promise}
 */
function createClient() {
  return new bluebird(resolve => {
    module.exports.client = redis.createClient(REDIS_URL);
    module.exports.client.on('error', logGenericError(__filename));

    resolve({ server: REDIS_URL });
  });
}

/**
 * Determine if we should write to cache
 *
 * @param  {String} key
 * @return {String}
 */
function shouldProcess(key) {
  return isPublished(key) || isUri(key) || isUser(key);
}

/**
 * Write a single value to a hash
 *
 * @param  {String} key
 * @param  {String} value
 * @return {Promise}
 */
function put(key, value) {
  if (!shouldProcess(key)) return bluebird.resolve();

  return module.exports.client.hsetAsync(REDIS_HASH, key, value);
}

/**
 * Read a single value from a hash
 *
 * @param  {String} key
 * @return {Promise}
 */
function get(key) {
  return module.exports.client.hgetAsync(REDIS_HASH, key)
    .then(data => data || bluebird.reject(notFoundError(key)));
}

/**
 * [batch description]
 * @param  {[type]} ops
 * @return {[type]}
 */
function batch(ops) {
  var batch = [];

  if (!ops.length) {
    return bluebird.resolve();
  }

  for (let i = 0; i < ops.length; i++) {
    let { key, value } = ops[i];

    if (shouldProcess(key)) {
      batch.push(key);
      batch.push(value);
    }
  }

  if (!batch.length) {
    return bluebird.resolve();
  }

  return module.exports.client.hmsetAsync(REDIS_HASH, batch);
}

/**
 * [del description]
 * @param  {[type]} key
 * @return {[type]}
 */
function del(key) {
  if (!shouldProcess(key)) return bluebird.resolve();

  return module.exports.client.hdelAsync(REDIS_HASH, key);
}

module.exports.client = null;
module.exports.createClient = createClient;
module.exports.get = get;
module.exports.put = put;
module.exports.batch = batch;
module.exports.del = del;

// For testing
module.exports.stubClient = mock => module.exports.client = mock;
