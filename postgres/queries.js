'use strict';

const { findTable, wrapJSONStringInObject } = require('../services/utils');

/**
 * Return a query to create a table if it does not exist
 *
 * @param {String} name
 * @returns {String}
 */
module.exports.CREATE_TABLE = name => `CREATE TABLE IF NOT EXISTS ${name} ( id TEXT PRIMARY KEY NOT NULL, data JSONB );`;

/**
 * Return a query to create a schema
 *
 * @param {String} name
 * @returns {String}
 */
module.exports.CREATE_SCHEMA = name => `CREATE SCHEMA IF NOT EXISTS ${name}`;

/**
 * Return a select query for an individual item based on
 * the id value
 *
 * @param {String} id
 * @returns {String}
 */
module.exports.GET = (id) => `SELECT id, data FROM ${findTable(id)} WHERE id = '${id}'`;

/**
 * Return a DELETE query that is matching on id only
 *
 * @param {String} id
 * @returns {String}
 */
module.exports.DEL = (id) => `DELETE FROM ${findTable(id)} WHERE id = '${id}'`;

/**
 * Returns a PUT query. The values are handled higher
 * up in the chain using the pg client, the main purpose
 * of this function is to handle the table selection and
 * consistent formatting
 *
 * @param {String} id
 * @returns {String}
 */
module.exports.PUT = (id) => `INSERT INTO ${findTable(id)}(id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2::jsonb`;

/**
 * Return a query string formatted to work for batch writes
 * of data from Amphora. Handles string escaping of the JSON
 * data and formatting for lists/uris. The `value` argument
 * must be a string of JSON
 *
 * @param {String} id
 * @param {String} value A string of JSON (!important)
 * @returns {String}
 */
module.exports.BATCH = (id, value) => {
  var escapedString = wrapJSONStringInObject(id, value.replace(/'/g, "''")); // Escape single quotes

  return `INSERT INTO ${findTable(id)}(id, data) VALUES ('${id}', '${escapedString}') ON CONFLICT (id) DO UPDATE SET data = '${escapedString}'::jsonb`;
};

/**
 * Construct a select query for the query stream that queries
 * a table for all rows whose id matches a given prefix.
 *
 * @param {String} options.prefix
 * @param {Boolean} options.values
 * @param {Boolean} options.keys
 * @returns {String}
 */
module.exports.READ_STREAM = ({ prefix, values, keys }) => {
  var selects = [];

  if (keys) selects.push('id');
  if (values) selects.push('data');

  if (!selects.length) throw new Error('Read Stream query requires either keys or values to be true');

  return `SELECT ${selects.join(',')} FROM ${findTable(prefix)} WHERE id LIKE '${prefix}%'`;
};
