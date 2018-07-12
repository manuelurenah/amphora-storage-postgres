'use strict';

// Postgres
module.exports.POSTGRES_USER     = process.env.CLAY_STORAGE_POSTGRES_USER     || 'postgres';
module.exports.POSTGRES_PASSWORD = process.env.CLAY_STORAGE_POSTGRES_PASSWORD || 'example';
module.exports.POSTGRES_HOST     = process.env.CLAY_STORAGE_POSTGRES_HOST     || 'localhost';
module.exports.POSTGRES_PORT     = process.env.CLAY_STORAGE_POSTGRES_PORT     || 5432;
module.exports.POSTGRES_DB       = process.env.CLAY_STORAGE_POSTGRES_DB       || 'clay';

// Redis
module.exports.CACHE_ENABLED     = process.env.CLAY_STORAGE_CACHE_ENABLED     || false;
module.exports.REDIS_HASH        = process.env.CLAY_STORAGE_REDIS_HASH        || 'clay';
module.exports.REDIS_URL         = process.env.CLAY_STORAGE_REDIS_HOST        || 'redis://localhost:6379';

// Application code
module.exports.DATA_STRUCTURES   = ['components', 'layouts', 'pages', 'uris', 'lists', 'users'];
