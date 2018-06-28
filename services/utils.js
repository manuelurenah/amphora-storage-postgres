'use strict';

const { DATA_STRUCTURES } = require('./constants'),
  { getComponentName } = require('clayutils'),
  { isList, isUri } = require('clayutils');

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

/**
 * Find which table the key belongs to. If it's a component
 * then we need to provide a <SCHEMA>.<TABLE> definition so
 * that the data gets to the proper place
 *
 * @param  {String} key [description]
 * @return {String}     [description]
 */
function findTable(key) {
  var table;

  for (var i = 0; i < DATA_STRUCTURES.length; i++) {
    let DATA_TYPE = DATA_STRUCTURES[i];

    if (key.indexOf(`/_${DATA_TYPE}`) > -1) {
      if (DATA_TYPE === 'components') {
        table = `${DATA_TYPE}."${getComponentName(key)}"`;
      } else {
        table = DATA_TYPE;
      }

      // Exit fast if we get the match
      break;
    }
  }

  return table;
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
  if (!isList(key) && !isUri(key)) return _value;

  return { _value };
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
  if (!isList(key) && !isUri(key)) return _value;

  return `{"_value":"${_value}"}`;
}

module.exports.parseOrNot = parseOrNot;
module.exports.findTable = findTable;
module.exports.wrapInObject = wrapInObject;
module.exports.wrapJSONStringInObject = wrapJSONStringInObject;
