'use strict';

const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB, CONNECTION_POOL_MIN, CONNECTION_POOL_MAX } = require('./services/constants');

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: POSTGRES_HOST,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DB,
      port: POSTGRES_PORT,
    },
    pool: { min: CONNECTION_POOL_MIN, max: CONNECTION_POOL_MAX }
  },
  production: {
    client: 'pg',
    connection: {
      host: POSTGRES_HOST,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DB,
      port: POSTGRES_PORT,
    },
    pool: { min: CONNECTION_POOL_MIN, max: CONNECTION_POOL_MAX },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  SCHEMAS: [
    'public',
    'components',
    'layouts',
  ],
  // Replacing dashes with underscores since postgres triggers
  // doesn't allow dashes in trigger names.
  onUpdateTrigger: (table, schema) => `
    CREATE TRIGGER ${table.replace(/-/g, '_')}_updated_at
    BEFORE UPDATE ON ${schema}."${table}"
    FOR EACH ROW
    EXECUTE PROCEDURE on_update_timestamp();
  `,
  // Replacing dashes with underscores since postgres triggers
  // doesn't allow dashes in trigger names.
  dropUpdateTrigger: (table, schema) => `
    DROP TRIGGER IF EXISTS ${table.replace(/-/g, '_')}_updated_at
    ON ${schema}."${table}";
  `,
};
