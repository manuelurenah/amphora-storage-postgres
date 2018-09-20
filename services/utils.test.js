'use strict';

const { parseOrNot, wrapInObject, wrapJSONStringInObject, findSchemaAndTable, decode } = require('./utils');

describe('services/utils', () => {
  const testObj = { foo: true, bar: false },
    stringifiedTestObj = JSON.stringify(testObj);

  describe('parseOrNot', () => {
    test('it parses stringified JSON objects', () => {
      expect(parseOrNot(stringifiedTestObj)).toMatchObject(testObj);
    });

    test('it does not error when trying to parse a non-JSON value', () => {
      expect(parseOrNot('foobar')).toStrictEqual('foobar');
    });
  });

  describe('decode', () => {
    test('base64 decodes an encoded string', () => {
      expect(decode('aHR0cDovL3NpdGUuY29tL3NvbWUtY29vbC11cmw=')).toStrictEqual('http://site.com/some-cool-url');
    });

    test('returns arg unchanged if not a string', () => {
      expect(decode(2)).toBe(2);
    });
  });

  describe.each([
    ['nymag.com/_components/follow/instances/facebook', 'components', 'follow'],
    ['nymag.com/_layouts/layout-column/instances/someinstance', 'layouts', 'layout-column'],
    ['nymag.com/_pages/bnltYWcuY29tL2F1dGhvci9BYnJhaGFtJTIwUmllc21hbi8', undefined, 'pages'],
    ['nymag.com/_lists/some-list/bnltYWcuY29tL2F1dGhvci9BYnJhaGFtJTIwUmllc21hbi8', undefined, 'lists'],
    ['nymag.com/_users/bnltYWcuY29tL2F1dGhvci9BYnJhaGFtJTIwUmllc21hbi8', undefined, 'users'],
  ])
  ('findSchemaAndTable', (key, expectedSchema, expectedTable) => {
    test(`gets schema and table from a ${expectedTable} key`, () => {
      const { schema, table } = findSchemaAndTable(key);

      expect(schema).toBe(expectedSchema);
      expect(table).toBe(expectedTable);
    });
  });

  describe.each([
    ['components', 'site.com/_components/cmpt/instances/foo', testObj, testObj],
    ['pages', 'site.com/_pages/foo', testObj, testObj],
    ['lists', 'site.com/_lists/foo', testObj, { _value: testObj }],
    ['uris', 'site.com/_uris/foo', testObj, testObj]
  ])
  ('wrapInObject', (type, key, value, result) => {
    test(`wraps ${type} correctly`, () => {
      expect(wrapInObject(key, value)).toStrictEqual(result);
    });
  });

  describe.each([
    ['components', 'site.com/_components/cmpt/instances/foo', stringifiedTestObj, stringifiedTestObj],
    ['pages', 'site.com/_pages/foo', stringifiedTestObj, stringifiedTestObj],
    ['lists', 'site.com/_lists/foo', stringifiedTestObj, `{"_value":"${stringifiedTestObj}"}`],
    ['uris', 'site.com/_uris/foo', stringifiedTestObj, stringifiedTestObj]
  ])
  ('wrapJSONStringInObject', (type, key, value, result) => {
    test(`wraps ${type} correctly`, () => {
      expect(wrapJSONStringInObject(key, value)).toEqual(result);
    });
  });
});
