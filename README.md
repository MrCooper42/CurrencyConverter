# Setup
- run `npm i`
- run `npm run prisma:generate`
- setup your [env](.env.example) and remove the `.example`
  - you may need to create your own db on [prisma](https://www.prisma.io/) and set it up here
- run `npm run prisma:migrate`

## Running locally
- ensure you have your database migrated and setup
- run `npm run start:dev`

## Docker deploy
First make sure you have [docker setup properly](https://www.docker.com/get-started/) then run these commands
- run `npm run docker:build`
- run `npm run docker:start`

## Postman
There are 2 collections you can import to postman that use openapi3
You can take these and hit import in postman with openapi3
- [Currency](swagger.json)
  - This is what you will be running locally and where you can get your requests and responses
- [Coinbase](coinbase/swagger.json)
  - This is what we are using internally to get the response for the exchange-rates (currently it is limited to the one api)

## Changes to coinbase
- if you change the swagger run `npm run generateOpenapi`
  - This will re-generate the openapi specs for integrating with coinbase
- if you need to update the currencies you will need to update
  - `Currencies` here [schema.prisma](prisma/schema.prisma)
  - These were generated from the response of exchange-rates and using chatGpt to generate the enum

## Future improvements
I created a full service for each table just in case it would be needed to be expanded in the future but it is not used.
Most of the handling for auth, logging, error handling, and rate limiting is managed in middleware to reduce code reuse.
