'use strict';

const { DATA_STRUCTURES } = require('./constants'),
  { getComponentName, getLayoutName } = require('clayutils'),
  { isList, isUri } = require('clayutils');

function getListName(uri) {
  const result = /_lists\/(.+?)[\/\.]/.exec(uri) || /_lists\/(.*)/.exec(uri);

  return result && result[1];
}

/**
 * Try to parse the stringified object.
 * Return the value if it does not parse.
 *
 * @param  {Object|String} value
 * @return {Object|String}
 */
function parseOrNot(value) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

function findSchemaAndTable(key) {
  var table, schema;

  for (let i = 0; i < DATA_STRUCTURES.length; i++) {
    let DATA_TYPE = DATA_STRUCTURES[i];

    if (key.indexOf(`/_${DATA_TYPE}`) > -1) {
      if (DATA_TYPE === 'components' || DATA_TYPE === 'layouts' || DATA_TYPE === 'lists') {
        schema = DATA_TYPE;
        table = getComponentName(key) || getLayoutName(key) || getListName(key);
      } else {
        table = DATA_TYPE;
      }

      // Exit fast if we get the match
      break;
    }
  }

  return { schema, table };
}

/**
 * If dealing with a uri or list, wrap the value in
 * an object at the _value property
 *
 * @param  {String} key
 * @param  {String|Object} _value
 * @return {Object}
 */
function wrapInObject(key, _value) {
  if (!isUri(key)) return _value;

  console.log('\n\n\n\n', _value, '\n\n\n');
  return { _value };
}

/**
 *
 * @param {*} key
 * @return {Boolean}
 */
function isListOrUri(key) {
  return isList(key) || isUri(key);
}

/**
 * When dealing with a JSON string as a value,
 * either wrap the value in a string object or
 * return the value
 *
 * @param  {String} key
 * @param  {String} _value
 * @return {String}
 */
function wrapJSONStringInObject(key, _value) {
  if (isListOrUri(key)) {
    if (isList(key)) {
      console.log('\n\n\n\n', _value, '\n\n\n');
      return `{"_value":"${_value}"}`;
    } else {
      return _value;
    }
  }

  return _value;
}

module.exports.findSchemaAndTable = findSchemaAndTable;
module.exports.parseOrNot = parseOrNot;
module.exports.wrapInObject = wrapInObject;
module.exports.wrapJSONStringInObject = wrapJSONStringInObject;

// Exposed for testing
module.exports.getListName = getListName;
