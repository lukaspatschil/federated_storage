![DSG](./docs/dsg_logo.png)

# Advanced Internet Computing WS 2021 - Group 4 Topic 2

This template is intended to serve as an *example* on how you might want to structure the README when submitting your project.

**Important**: The specific subdirectories are *not* meant to be extended but to serve as an example on how to write a `Dockerfile` and a `docker-compose.yml` file. Your first task should be to replace them with your own.

## Team

- Sebastian Fürndraht (11741163)
- Simon Hofbauer (11701818)
- Heribert Kremser (01529056)
- Lukas Spatschil (11810356)
- Lukas Wieser (11809647)

## Overview

TODO

## Architecture

![Architecture](./docs/architecture.png)

(This is subject to change in the future!)

## Components

### Frontend app

TODO

### Middleware

TODO

#### Gateway service

TODO

#### ShortPictureDto service

TODO

#### Logger service

The logger service provides a centralized logging for all applications.
It listens on the RabbitMQ `logging-queue` for incoming log messages. When it receives them it logs them to the console and also writes the entry to a dedicated file which is changed every 12 hours and is named after the creation time and date.

The logger extends the Nest.js logger and therefore implements all of its log levels.
The client connects via the AmqpLoggerModule to the queue and can be used in all clients via dependency injection.

#### RabbitMQ

RabbitMq is a messaging broker which is used to communicate between the different services.
In our special case it is only used to queue log messages which are then forwarded to the logger service and written to the log file.

### Storage

#### Dropbox service

TODO

#### MongoDB service

TODO

#### MinIO service

TODO

## How to run

### Development

#### Installing dependencies

In order to develop on the application make sure you have `npm 7` or higher installed.
Then run `npm install` in the main directory. This will automatically install all node modules.

When installing a new dependency use the command `npm install dependency -w service`.

#### Docker

In order to start all services run `docker-compose up` in order to start the application in development mode.

To stop the containers run `docker-compose stop` or delete them by running `docker-compose down`.

When installing a new dependency you will need to rebuild the docker container with `docker-compose build container-name`.

#### Generating code

With `npm run generate` all generate scripts will be executed.

##### protoc

With `npm run generate:protoc` you can generate TS declarations of the proto files. In order to do so you will need protoc installed on your system.

##### types

With `npm run generate:types` you copy all the interfaces and types in backend/service-types to every service

### Production

TODO

## How to debug

TODO
