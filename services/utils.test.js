'use strict';

const { parseOrNot, wrapInObject, wrapJSONStringInObject } = require('./utils');

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

  // TODO: MODIFY FOR findSchemaAndTable when testing is a priority
  // describe.each([
  //   ['site.com/_components/cmpt/instances/foo', 'components."cmpt"'],
  //   ['site.com/_pages/foo', 'pages'],
  //   ['site.com/_lists/foo', 'lists'],
  //   ['site.com/_uris/foo', 'uris'],
  //   ['site.com/_fake/foo', undefined]
  // ])
  // ('findTable', (key, collection) => {
  //   test(`returns ${collection}`, () => {
  //     expect(findTable(key)).toBe(collection);
  //   });
  // });

  describe.each([
    ['components', 'site.com/_components/cmpt/instances/foo', testObj, testObj],
    ['pages', 'site.com/_pages/foo', testObj, testObj],
    ['lists', 'site.com/_lists/foo', testObj, { _value: testObj }],
    ['uris', 'site.com/_uris/foo', testObj, { _value: testObj }]
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
    ['uris', 'site.com/_uris/foo', stringifiedTestObj, `{"_value":"${stringifiedTestObj}"}`]
  ])
  ('wrapJSONStringInObject', (type, key, value, result) => {
    test(`wraps ${type} correctly`, () => {
      expect(wrapJSONStringInObject(key, value)).toEqual(result);
    });
  });
});
