'use strict';

const client = require('./client'),
  bluebird = require('bluebird'),
  { CREATE_TABLE, CREATE_SCHEMA } = require('./queries'),
  { DATA_STRUCTURES, POSTGRES_HOST, POSTGRES_PORT } = require('../services/constants'),
  { getComponents } = require('amphora-fs');

/**
 * Create all the tables for the different Clay data structures.
 * But we skip components because that's in it's own Schema and requires
 * slightly different treatment
 *
 * @return {Promise}
 */
function createNonComponentTables() {
  var promises = [];

  for (let i = 0; i < DATA_STRUCTURES.length; i++) {
    let STRUCTURE = DATA_STRUCTURES[i];

    if (STRUCTURE !== 'components') {
      promises.push(client.query(CREATE_TABLE(STRUCTURE)));
    }
  }

  return bluebird.all(promises);
}

/**
 * Create all tables needed
 *
 * @return {Promise}
 */
function createTables() {
  return bluebird.all(getComponents().map(component => client.query(CREATE_TABLE(`components."${component}"`))))
    .then(() => createNonComponentTables());
}

/**
 * Connect and create schemas/tables
 *
 * @return {Promise}
 */
function setup() {
  return client.connect()
    .then(() => client.query(CREATE_SCHEMA('components')))
    .then(createTables)
    .then(() => ({ server: `${POSTGRES_HOST}${POSTGRES_PORT}:${POSTGRES_PORT}` }));
}

module.exports.setup = setup;
