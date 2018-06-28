'use strict';

const { setup } = require('./index'),
  client = require('./client'),
  { getComponents } = require('amphora-fs');

jest.mock('./client');
jest.mock('amphora-fs');

describe('postgres/index', () => {
  test('calls connect and then sets up the db', () => {
    client.connect.mockResolvedValue('');
    getComponents.mockReturnValue(['foo', 'bar', 'baz']);

    return setup().then(resp => {
      expect(client.connect.mock.calls.length).toBe(1);
      expect(client.query.mock.calls.length).toBe(9);
      expect(resp).toHaveProperty('server');
    });
  });
});
