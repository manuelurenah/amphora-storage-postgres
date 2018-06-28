'use strict';

const Transform = require('./list-transform-stream');

describe('services/list-transform-stream', () => {
  test('write function pushes object with data and id if data is defined', () => {
    var stream = Transform(),
      push = jest.fn();

    stream.push = push;
    stream.write({ id: 'foo.com/_components/bar/instances/baz', data: { foobarbaz: true }});
    expect(push.mock.calls.length).toBe(1);
    expect(push).toBeCalledWith(JSON.stringify({foobarbaz: true, _ref: 'foo.com/_components/bar/instances/baz'}));
  });

  test('write function pushes only a string if no data is defined', () => {
    var stream = Transform(),
      push = jest.fn();

    stream.push = push;
    stream.write({ id: 'foo.com/_components/bar/instances/baz' });
    expect(push.mock.calls.length).toBe(1);
    expect(push).toBeCalledWith('foo.com/_components/bar/instances/baz');
  });
});
