## Multi currency ledger service
A basic yet robust multi-currency ledger service using NestJS.

## Installation for local development

```bash
docker-compose -f docker-compose.test.yaml up
cp .env.example .env
npm i
npm run migration:run
npm run start:dev
```



```
## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Prodaction build
