'use strict';

const clayLog = require('clay-log'),
  pkg = require('../package.json');
var amphoraStorageLogInstance;

function init() {
  if (amphoraStorageLogInstance) {
    return;
  }

  // Initialize the logger
  clayLog.init({
    name: 'amphora-storage-postgres',
    meta: {
      version: pkg.version
    }
  });

  // Store the log instance
  amphoraStorageLogInstance = clayLog.getLogger();
}

function setup(meta) {
  return clayLog.meta(meta, amphoraStorageLogInstance);
}

// Initialize immediately on require of file
init();

module.exports.setup = setup;

// For testing
module.exports.init = init;
module.exports.setLogger = mock => amphoraStorageLogInstance = mock;
