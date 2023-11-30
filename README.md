# turbo-parakeet

## Prerequisites

- node@20
- npm@10

## Quickstart

```sh
# install dependencies
npm i
# will create an sqlite database file at ./prisma/dev.db
npm run db:sync
# setup env file
cp .env.example .env
# start server
npm run dev
```

Swagger at: <http://localhost:3000/api>

## Test

```sh
# setting log level to silence logs while running tests
LOG_LEVEL=silent npm test
```
