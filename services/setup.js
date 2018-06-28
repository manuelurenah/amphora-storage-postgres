'use strict';

const postgres = require('../postgres'),
  redis = require('../redis');
var log = require('./log').setup({ file: __filename });

/**
 * Log the successful connection to either db
 * @param  {String} name
 * @param  {Object} resp
 */
function logConnectionSuccess(name, resp) {
  log('info', `Connected to ${name} successfully at ${resp.server}`, resp);
}

/**
 * Log any error that comes in
 * @param  {Error} err
 */
function logConnectionError(err) {
  log('error', err);
}

/**
 * Connect and create schemas/tables
 *
 * @return {Promise}
 */
function setup() {
  return postgres.setup()
    .then(resp => logConnectionSuccess('Postgres', resp))
    .then(redis.createClient)
    .then(resp => logConnectionSuccess('Redis', resp))
    .catch(logConnectionError);
}

module.exports = setup;

// For testing
module.exports.setLog = mock => log = mock;
