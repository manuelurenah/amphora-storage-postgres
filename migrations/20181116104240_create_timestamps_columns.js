'use strict';

const { SCHEMAS, onUpdateTrigger, dropUpdateTrigger } = require('../knexfile');

exports.up = function (knex, Promise) {
  function createTimestampsColumns() {
    return Promise.all(SCHEMAS.map(schema => {
      return knex('pg_catalog.pg_tables')
        .select('tablename')
        .where({ schemaname: schema })
        .then(results => results.map(item => item.tablename))
        .then(tableNames => {
          return Promise.all(tableNames.map(tableName => {
            return knex.schema.withSchema(schema).alterTable(tableName, table => table.timestamps(true, true))
              .then(() => knex.raw(onUpdateTrigger(tableName, schema)));
          }));
        });
    }));
  }

  return createTimestampsColumns();
};

exports.down = function (knex, Promise) {
  function removeTimestampsColumns() {
    return Promise.all(SCHEMAS.map(schema => {
      return knex('pg_catalog.pg_tables')
        .select('tablename')
        .where({ schemaname: schema })
        .then(results => results.map(item => item.tablename))
        .then(tableNames => {
          return Promise.all(tableNames.map(tableName => {
            return knex.schema.withSchema(schema).alterTable(tableName, table => table.dropTimestamps())
              .then(() => knex.raw(dropUpdateTrigger(tableName, schema)));
          }));
        });
    }));
  }

  return removeTimestampsColumns();
};
