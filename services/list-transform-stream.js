'use strict';

const util = require('util'),
  { Transform } = require('stream');

/**
 * Takes the values returned from a Postgres
 * read stream and tranforms the objects into
 * what Amphora expects for lists
 *
 * @constructor
 */
function ListTransformStream() {
  if (!(this instanceof ListTransformStream)) {
    return new ListTransformStream();
  }

  Transform.call(this, {objectMode: true});
}
util.inherits(ListTransformStream, Transform);

/**
 * Processes a stream of results from Postgres by
 * either plucking just the id field or combining
 * the id and data objects and stringifying
 *
 * @param  {String} chunk.id
 * @param  {Object} chunk.data
 */
ListTransformStream.prototype.write = function ({ id, data }) {
  // If we have data then we need to slot the
  // id value in as the _ref
  if (data) data._ref = id;

  // Push either the object or just the id
  this.push(data && JSON.stringify(data) || id);
};

module.exports = ListTransformStream;
