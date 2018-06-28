'use strict';

const bluebird = require('bluebird'),
  { Client } = require('pg'),
  QueryStream = require('pg-query-stream'),
  { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB } = require('../services/constants'),
  { CREATE_TABLE, CREATE_SCHEMA, PUT, GET, DEL, BATCH, READ_STREAM } = require('./queries'),
  { notFoundError } = require('../services/errors'),
  { parseOrNot, wrapInObject } = require('../services/utils'),
  { getComponents } = require('amphora-fs'),
  TransformStream = require('../services/list-transform-stream');
var client = new Client({
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  password: POSTGRES_PASSWORD,
  port: POSTGRES_PORT,
});

/**
 * Connect to the DB
 *
 * @return {Promise}
 */
function connect() {
  return client.connect();
}

/**
 * Execute a query using the client
 * scoped to the module
 *
 * @param  {String} query
 * @return {Promise}
 */
function query(query) {
  return client.query(query);
}

/**
 * Retrieve a single entry from the DB
 *
 * @param  {String} key
 * @return {Promise}
 */
function get(key) {
  return client.query(GET(key))
    .then(resp => {
      let data = resp.rows[0] && resp.rows[0].data;

      // We return the `._value` property if available because that's a list/uri
      return data ? data._value || data : bluebird.reject(notFoundError(key));
    });
}

/**
 * Insert a row into the DB
 *
 * @param  {String} key
 * @param  {Object} value
 * @return {Promise}
 */
function put(key, value) {
  let obj = parseOrNot(value);

  return client.query(PUT(key), [key, wrapInObject(key, obj)])
    .then(() => obj);
}

/**
 * Insert a row into the DB
 *
 * @param  {String} key
 * @param  {Object} value
 * @return {Promise}
 */
function del(key) {
  return client.query(DEL(key));
}

/**
 * [batch description]
 * @param  {[type]} ops [description]
 * @return {[type]}     [description]
 */
function batch(ops) {
  var commands = [];

  for (let i = 0; i < ops.length; i++) {
    let { key, value } = ops[i];

    commands.push(BATCH(key, value));
  }

  return client.query(commands.join('; '));
}

/**
 * Return a readable stream of query results
 * from the db
 *
 * @param  {Object} options
 * @return {Stream}
 */
function createReadStream(options) {
  const queryStream = new QueryStream(READ_STREAM(options)),
    transform = TransformStream(options);

  client.query(queryStream).pipe(transform);

  return transform;
}

module.exports.connect = connect;
module.exports.query = query;
module.exports.put = put;
module.exports.get = get;
module.exports.del = del;
module.exports.batch = batch;
module.exports.createReadStream = createReadStream;

// For testing
module.exports.setClient = mock => client = mock;
