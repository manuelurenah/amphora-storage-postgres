# Environment Setup

To define where Postgres and Redis clients will connect to you can define the following environment variables:

- [`CLAY_STORAGE_POSTGRES_USER`](#claystoragepostgresuser)
- [`CLAY_STORAGE_POSTGRES_PASSWORD`](#claystoragepostgrespassword)
- [`CLAY_STORAGE_POSTGRES_HOST`](#claystoragepostgreshost)
- [`CLAY_STORAGE_POSTGRES_PORT`](#claystoragepostgresport)
- [`CLAY_STORAGE_POSTGRES_DB`](#claystoragepostgresdb)
- [`CLAY_STORAGE_CACHE_ENABLED`](#claystoragecacheenabled)
- [`CLAY_STORAGE_REDIS_HASH`](#claystorageredishash)
- [`CLAY_STORAGE_REDIS_HOST`](#claystorageredishost)

---
## Postgres

The following values are all used in the configuration of how to connect to your Postgres instance. These values default to a local setup but should be updated for production environments.

### `CLAY_STORAGE_POSTGRES_USER`

**Default:** `postgres` _(String)_

### `CLAY_STORAGE_POSTGRES_PASSWORD`

**Default:** `example` _(String)_

The password to use when connecting to Postgres

### `CLAY_STORAGE_POSTGRES_HOST`

**Default:** `localhost` _(String)_

The host where your Postgres instance resides.

### `CLAY_STORAGE_POSTGRES_PORT`

**Default:** `5432` _(Number)_

The port where your Postgres instance resides on its host.

### `CLAY_STORAGE_POSTGRES_DB`

**Default:** `clay` _(String)_

The database within Postgres to connect to.

---

## Redis

The following values pertain to the configuration of the Redis cashing layer within the module. If not configured, all values will be read from Postgres directly.

### `CLAY_STORAGE_CACHE_ENABLED`

**Default:** `false` _(Boolean)_

If set to `true` the module will leverage Redis as a cache for published data, uris, and user data to enable faster rendering of reader facing pages.

### `CLAY_STORAGE_REDIS_HASH`

**Default:** `clay` _(String)_

The hash within Redis that values will be stored in.

### `CLAY_STORAGE_REDIS_HOST`

**Default:** `redis://localhost:6379` _(String)_

The Redis host to connect to. Should be [Redis Protocol](https://redis.io/topics/protocol) and include the port.
