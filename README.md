# Amphora Postgres

> A storage module for Amphora using Postgres & Redis

[![CircleCI](https://circleci.com/gh/clay/amphora-storage-postgres/tree/master.svg?style=svg)](https://circleci.com/gh/clay/amphora-storage-postgres/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/clay/amphora-storage-postgres/badge.svg?branch=master)](https://coveralls.io/github/clay/amphora-storage-postgres?branch=master)

## Installation & Usage

First install the module:

```
$ npm install -S amphora-storage-postgres
```

Then pass the module into Amphora as the value for the `storage` property.

```javascript
amphora({
  ...
  storage: require('amphora-storage-postgres')
  ...
})
```

At startup time the module will try to connect to Postgres and Redis and default in a dev environment. Make sure to see the [Environment Setup](docs/environment-setup.md) document for how to configure the clients for production.

## License

MIT
