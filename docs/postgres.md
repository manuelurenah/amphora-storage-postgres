# Postgres

The main data store for your Clay instance, the data is stored as follows:

## Schemas

The module only uses two schemas, the default public schema and a `components` schema which is generated at startup if it does not exist. The `components` schema will hold all of the component data in your clay instance, with each component having a dedicated table.

## Tables

Every table has only two columns: `id` and `data`.

  - `id`: the unique identifier of the component instance. Type `TEXT`
  - `data`: the component/page/list/uri/user JSON object. Type `JSONB`

Clay is fundamentally based on JSON documents and so we leverage the JSONB data type to maintain that architecture but allow for more complex querying of Clay data. For a nice walkthrough on how to query JSONB data [check out this article](https://hackernoon.com/how-to-query-jsonb-beginner-sheet-cheat-4da3aa5082a3).
