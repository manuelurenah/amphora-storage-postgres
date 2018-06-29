# Redis

Redis sits in front of reads from Postgres for the following data:

  - Published Data: any key ending in `@published` (pages and components)
  - Uris, the data structure which connects public urls to page uris for rendering
  - User data

The module will only try to connect if you've setup the proper [environment variables](docs/environment-setup.md).
