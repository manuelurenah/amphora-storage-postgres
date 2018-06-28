'use strict';

module.exports.POSTGRES_USER = process.env.CLAY_POSTGRES_USER || 'postgres';
module.exports.POSTGRES_PASSWORD = process.env.CLAY_POSTGRES_PASSWORD || 'example';
module.exports.POSTGRES_HOST = process.env.CLAY_POSTGRES_HOST || 'localhost';
module.exports.POSTGRES_PORT = process.env.CLAY_POSTGRES_PORT || 5432;
module.exports.POSTGRES_DB = process.env.CLAY_POSTGRES_DB || 'clay';
module.exports.DATA_STRUCTURES = ['components', 'pages', 'uris', 'lists', 'users', 'schedule'];
module.exports.REDIS_HASH = process.env.CLAY_REDIS_HASH || 'clay';
module.exports.REDIS_URL = process.env.REDIS_HOST || 'redis://localhost:6379';
