# Amphora Postgres

> A storage module for Amphora using Postgres & Redis

## Installation & Usage

First install the module:

```
$ npm install -S amphora-postgres-redis
```

Then pass the module into Amphora as the value for the `storage` property.

```javascript
amphora({
  ...
  storage: require('amphora-postgres-redis')
  ...
})
```

At startup time the module will try to connect to Postgres and Redis and default in a dev environment. Make sure to see the [Environment Setup](docs/environment-setup.md) document for how to configure the clients for production.

## License

MIT
