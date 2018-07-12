'use strict';

const client = require('./client'),
  bluebird = require('bluebird'),
  { DATA_STRUCTURES, POSTGRES_HOST, POSTGRES_PORT } = require('../services/constants'),
  { getComponents, getLayouts } = require('amphora-fs');

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

    if (STRUCTURE !== 'components' && STRUCTURE !== 'pages' && STRUCTURE !== 'layouts') {
      promises.push(client.createTable(STRUCTURE));
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
  return bluebird.all(getComponents().map(component => client.createTable(`components."${component}"`)))
    .then(() => bluebird.all(getLayouts().map(layout => client.createTableWithMeta(`layouts."${layout}"`))))
    .then(() => client.createTableWithMeta('pages'))
    .then(() => createNonComponentTables());

}

/**
 * Connect and create schemas/tables
 *
 * @return {Promise}
 */
function setup() {
  return client.connect()
    .then(() => client.createSchema('components'))
    .then(() => client.createSchema('layouts'))
    .then(createTables)
    .then(() => ({ server: `${POSTGRES_HOST}${POSTGRES_PORT}:${POSTGRES_PORT}` }));
}

module.exports.setup = setup;
