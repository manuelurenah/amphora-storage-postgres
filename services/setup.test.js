'use strict';

const setup = require('./setup'),
  postgres = require('../postgres'),
  redis = require('../redis'),
  logger = jest.fn();

jest.mock('../redis');
jest.mock('../postgres');
setup.setLog(logger);

describe('services/setup', () => {
  test('it tries to connect to Postgres and Redis', () => {
    postgres.setup.mockResolvedValue({ server: 'localhost:5432' });
    redis.createClient.mockResolvedValue({ server: 'localhost:6379' });

    return setup(true)
      .then(() => {
        expect(redis.createClient.mock.calls.length).toBe(1);
        expect(postgres.setup.mock.calls.length).toBe(1);
        expect(logger).toHaveBeenCalledTimes(2);
      });
  });

  test('it logs when it cannot connect to Postgres', () => {
    postgres.setup.mockResolvedValue(Promise.reject(new Error()));

    return setup(true)
      .catch(() => {
        expect(redis.createClient.mock.calls.length).toBe(1);
        expect(postgres.setup.mock.calls.length).toBe(1);
        expect(logger).toHaveBeenCalledTimes(2);
      });
  });

  test('it logs when it cannot connect to Redis', () => {
    postgres.setup.mockResolvedValue({ server: 'localhost:5432' });
    redis.createClient.mockResolvedValue(Promise.reject(new Error()));

    return setup()
      .catch(() => {
        expect(redis.createClient.mock.calls.length).toBe(1);
        expect(postgres.setup.mock.calls.length).toBe(1);
        expect(logger).toHaveBeenNthCalledWith(2, 'error');
      });
  });
});
