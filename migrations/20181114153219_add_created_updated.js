'use strict';

const SCHEMAS = [
  'public',
  'components',
  'layouts',
];

exports.up = function (knex, Promise) {
  return Promise.all(SCHEMAS.map(schema => {
    return knex('pg_catalog.pg_tables')
      .select('tablename')
      .where({ schemaname: schema })
      .then(results => results.map(item => item.tablename))
      .then(tables => {
        return Promise.all(tables.map(t => {
          return knex.schema
            .withSchema(schema)
            .table(t, table => table.timestamps(true, true));
        }));
      });
  }));
};

exports.down = function (knex, Promise) {
  return Promise.all(SCHEMAS.map(schema => {
    return knex('pg_catalog.pg_tables')
      .select('tablename')
      .where({ schemaname: schema })
      .then(results => results.map(item => item.tablename))
      .then(tables => {
        return Promise.all(tables.map(t => {
          return knex.schema
            .withSchema(schema)
            .table(t, table => table.dropTimestamps());
        }));
      });
  }));
};
