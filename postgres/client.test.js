'use strict';

const client = require('./client'),
  pg = require('pg'),
  TransformStream = require('../services/list-transform-stream'),
  QueryStream = require('pg-query-stream'),
  { Readable } = require('stream'),
  CLIENT = {
    connect: jest.fn(),
    query: jest.fn(),
    get: jest.fn()
  };

jest.mock('pg-query-stream');

beforeEach(() => {
  client.setClient(CLIENT);
});

describe('postgres/client', () => {
  const CMPT_DATA = {
      rows: [{
        data: {
          foo: true
        }
      }]
    },
    URI_DATA = {
      rows: [{
        data: {
          _value: 'foo.com/_uris/bar'
        }
      }]
    };

  describe('connect', () => {
    test('the client connect method is called', () => {
      client.connect();
      expect(CLIENT.connect.mock.calls.length).toBe(1);
    });
  });

  describe('query', () => {
    test('the client query method is called', () => {
      CLIENT.query.mockResolvedValue('');

      return client.query()
        .then(() => {
          expect(CLIENT.query.mock.calls.length).toBe(1);
        });
    });
  });

  describe('get', () => {
    test('returns data when queried by id', () => {
      CLIENT.query.mockResolvedValue(CMPT_DATA);

      return client.get('foo.com/_components/bar')
        .then(resp => {
          expect(CLIENT.query.mock.calls.length).toBe(1);
          expect(resp).toHaveProperty('foo', true);
        });
    });

    test('returns the _value property first if it exists', () => {
      CLIENT.query.mockResolvedValue(URI_DATA);

      return client.get('foo.com/_components/bar')
        .then(resp => {
          expect(CLIENT.query.mock.calls.length).toBe(1);
          expect(resp).toEqual('foo.com/_uris/bar');
        });
    });

    test('rejects when the value is not found', () => {
      CLIENT.query.mockResolvedValue({ rows: [] });

      return client.get('foo.com/_components/bar')
        .catch(err => {
          expect(CLIENT.query.mock.calls.length).toBe(1);
          expect(err.name).toEqual('NotFoundError');
        });
    });
  });

  describe('put', () => {
    test('it writes to the db', () => {
      CLIENT.query.mockResolvedValue('');

      return client.put('foo.com/_components/bar', { bar: true })
        .then(resp => {
          expect(CLIENT.query.mock.calls.length).toBe(1);
          expect(resp).toEqual({ bar: true });
        });
    });
  });

  describe('del', () => {
    test('it deletes from the db', () => {
      CLIENT.query.mockResolvedValue('');

      return client.del('foo.com/_components/bar')
        .then(resp => {
          expect(CLIENT.query.mock.calls.length).toBe(1);
        });
    });
  });

  describe('batch', () => {
    test('it deletes from the db', () => {
      const ops = [{
        key: 'foo.com/_components/bar',
        value: '{"foo": true}'
      }, {
        key: 'foo.com/_components/foo',
        value: '{"bar": true}'
      }];


      CLIENT.query.mockResolvedValue('');

      return client.batch(ops)
        .then(resp => {
          expect(CLIENT.query.mock.calls.length).toBe(1);
        });
    });
  });

  describe('createReadStream', () => {
    test('returns a Transform stream with results', () => {
      var ReadableStream = new Readable({ objectMode: true});

      CLIENT.query.mockReturnValue(ReadableStream);
      ReadableStream.push({ id: 'foo.com/_components/bar/instances/foobar', data: { baz: true }});
      ReadableStream.push(null);

      expect(client.createReadStream({ prefix: 'foo.com/_pages', keys: true })).toBeInstanceOf(TransformStream);
      expect(QueryStream.mock.calls.length).toBe(1);
      expect(CLIENT.query.mock.calls.length).toBe(1);
    });
  });
});
