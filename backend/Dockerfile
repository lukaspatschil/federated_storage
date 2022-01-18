FROM node:14.18.1-alpine as development
ARG BUILD_CONTEXT
ENV BUILD_CONTEXT ${BUILD_CONTEXT}

RUN npm install -g npm@7.24.2

WORKDIR /base
COPY package*.json .
COPY ./backend/$BUILD_CONTEXT/package.json backend/$BUILD_CONTEXT/

# Add local packages
COPY ./backend/proto/ backend/proto/

RUN npm install

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

COPY ./backend/$BUILD_CONTEXT backend/$BUILD_CONTEXT
RUN npm run build:$BUILD_CONTEXT

CMD /wait && npm run start:dev:${BUILD_CONTEXT}

FROM node:14.18.1-alpine as production
ARG BUILD_CONTEXT
ENV BUILD_CONTEXT ${BUILD_CONTEXT}

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN npm install -g npm@7.24.2

WORKDIR /base
COPY package*.json .
COPY ./backend/$BUILD_CONTEXT/package.json backend/$BUILD_CONTEXT/

# Add local packages
COPY ./backend/proto/ backend/proto/

RUN npm install --only=production

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

COPY ./backend/$BUILD_CONTEXT backend/$BUILD_CONTEXT
RUN npm run build:$BUILD_CONTEXT

CMD /wait && npm run start:prod:${BUILD_CONTEXT}