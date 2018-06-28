'use strict';

const { notFoundError, logGenericError, setLog } = require('./errors'),
  logger = jest.fn();

describe('services/errors', () => {
  describe('notFoundError', () => {
    const result = notFoundError('somekey');

    expect(result).toBeInstanceOf(Error);
    expect(result.name).toEqual('NotFoundError');
    expect(result.key).toEqual('somekey');
  });

  describe('logGenericError', () => {
    const error = new Error('Some error');

    test('logs an error message', () => {
      setLog(logger);
      logGenericError(__filename)(error);

      expect(logger.mock.calls.length).toBe(1);
      expect(logger).toHaveBeenCalledWith('error', 'Some error', { file: __filename });
    });
  });
});
