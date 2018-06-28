'use strict';

const queries = require('./queries'),
  TEST_DATA = JSON.stringify({
    string: "JSONB mustn't have apostrophes"
  }),
  TEST_STRING = 'foo.com/someval',
  EXPECTED_DATA = JSON.stringify({
    string: "JSONB mustn''t have apostrophes"
  }),
  EXPECTED_TEST_STRING = JSON.stringify({
    _value:TEST_STRING
  });

describe('postgres/queries', () => {
  describe.each([
    ['pages'],
    ['uris'],
    ['users'],
    ['lists'],
    ['components'],
  ])
  ('CREATE_TABLE', (val) => {
    test(`returns a SQL command for creating a ${val} table`, () => {
      expect(queries.CREATE_TABLE(val)).toEqual(`CREATE TABLE IF NOT EXISTS ${val} ( id TEXT PRIMARY KEY NOT NULL, data JSONB );`);
    });
  });

  describe.each([
    ['pages'],
    ['uris'],
    ['users'],
    ['lists'],
    ['components'],
  ])
  ('CREATE_SCHEMA', (val) => {
    test(`returns a SQL command for creating a ${val} schema`, () => {
      expect(queries.CREATE_SCHEMA(val)).toEqual(`CREATE SCHEMA IF NOT EXISTS ${val}`);
    });
  });

  describe.each([
    ['foo.com/_pages/id', 'pages', 'pages'],
    ['foo.com/_components/name/instances/foo', 'component (instance)', 'components."name"'],
    ['foo.com/_components/name', 'component (default)', 'components."name"'],
    ['foo.com/_users/id', 'users', 'users'],
    ['foo.com/_lists/id', 'lists', 'lists'],
    ['foo.com/_uris/id', 'uris', 'uris'],
  ])
  ('GET', (val, type, table) => {
    test(`returns a SQL command for creating retrieving a ${type} by id`, () => {
      expect(queries.GET(val)).toEqual(`SELECT id, data FROM ${table} WHERE id = '${val}'`);
    });
  });

  describe.each([
    ['foo.com/_pages/id', 'pages', 'pages'],
    ['foo.com/_components/name/instances/foo', 'component (instance)', 'components."name"'],
    ['foo.com/_components/name', 'component (default)', 'components."name"'],
    ['foo.com/_users/id', 'users', 'users'],
    ['foo.com/_lists/id', 'lists', 'lists'],
    ['foo.com/_uris/id', 'uris', 'uris'],
  ])
  ('DEL', (val, type, table) => {
    test(`returns a SQL command for deleting a ${type} by id`, () => {
      expect(queries.DEL(val)).toEqual(`DELETE FROM ${table} WHERE id = '${val}'`);
    });
  });

  describe.each([
    ['foo.com/_pages/id', 'pages', 'pages'],
    ['foo.com/_components/name/instances/foo', 'component (instance)', 'components."name"'],
    ['foo.com/_components/name', 'component (default)', 'components."name"'],
    ['foo.com/_users/id', 'users', 'users'],
    ['foo.com/_lists/id', 'lists', 'lists'],
    ['foo.com/_uris/id', 'uris', 'uris'],
  ])
  ('PUT', (val, type, table) => {
    test(`returns a SQL command for creating a ${type} by id`, () => {
      expect(queries.PUT(val)).toEqual(`INSERT INTO ${table}(id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2::jsonb`);
    });
  });

  describe.each([
    ['foo.com/_pages/id', TEST_DATA, EXPECTED_DATA, 'pages', 'pages'],
    ['foo.com/_components/name/instances/foo', TEST_DATA, EXPECTED_DATA, 'component (instance)', 'components."name"'],
    ['foo.com/_components/name', TEST_DATA, EXPECTED_DATA, 'component (default)', 'components."name"'],
    ['foo.com/_users/id', TEST_DATA, EXPECTED_DATA, 'users', 'users'],
    ['foo.com/_lists/id', TEST_STRING, EXPECTED_TEST_STRING, 'lists', 'lists'],
    ['foo.com/_uris/id', TEST_STRING, EXPECTED_TEST_STRING, 'uris', 'uris'],
  ])
  ('BATCH', (key, value, expectedData, type, table) => {
    test('returns a SQL command for creating entries in a batch', () => {
      expect(queries.BATCH(key, value)).toEqual(`INSERT INTO ${table}(id, data) VALUES ('${key}', '${expectedData}') ON CONFLICT (id) DO UPDATE SET data = '${expectedData}'::jsonb`);
    });
  });

  describe.each([
    ['foo.com/_pages', 'pages', { keys: true }, 'id'],
    ['foo.com/_uris', 'uris', { values: true }, 'data'],
    ['foo.com/_lists', 'lists', { keys: true, values: true }, 'id,data'],
    ['foo.com/_components/foo/instances', 'components."foo"', { keys: true, values: true }, 'id,data'],

  ])
  ('READ_STREAM', (prefix, table, options, selects) => {
    test(`returns a SQL command for creating a read stream from ${table}`, () => {
      expect(queries.READ_STREAM(Object.assign({ prefix }, options )))
        .toEqual(`SELECT ${selects} FROM ${table} WHERE id LIKE '${prefix}%'`);
    });
  });

  describe('READ_STREAM', () => {
    test('throws an error if key and values is not defined', () => {
      expect(() => queries.READ_STREAM({})).toThrow();
    });
  });
});
