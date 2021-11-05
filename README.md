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

#### Gateway

TODO

#### Picture service

TODO

#### Logger service

TODO

#### RabbitMQ

TODO

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

### Production

TODO

## How to debug

TODO
