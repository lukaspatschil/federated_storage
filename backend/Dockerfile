FROM node:16.13.2-alpine AS build
ARG BUILD_CONTEXT

WORKDIR /usr/src/app/${BUILD_CONTEXT}

RUN npm install -g npm@7.24.2

COPY package*.json .
COPY ./backend/${BUILD_CONTEXT}/package.json backend/${BUILD_CONTEXT}/

# Add local packages
COPY ./backend/proto/ backend/proto/

RUN npm install

COPY ./backend/${BUILD_CONTEXT} backend/${BUILD_CONTEXT}
RUN npm run build:${BUILD_CONTEXT}

FROM node:14.18.1-alpine as development
ARG BUILD_CONTEXT
ENV BUILD_CONTEXT ${BUILD_CONTEXT}

RUN npm install -g npm@7.24.2

WORKDIR /base
COPY package*.json .
COPY ./backend/${BUILD_CONTEXT}/package.json backend/${BUILD_CONTEXT}/

# Add local packages
COPY ./backend/proto/ backend/proto/

RUN npm install

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

COPY ./backend/${BUILD_CONTEXT} backend/${BUILD_CONTEXT}
RUN npm run build:${BUILD_CONTEXT}

CMD /wait && npm run start:dev:${BUILD_CONTEXT}

FROM node:14.18.1-alpine as production
ARG BUILD_CONTEXT
ENV BUILD_CONTEXT ${BUILD_CONTEXT}

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

COPY --from=build /usr/src/app/${BUILD_CONTEXT}/backend/${BUILD_CONTEXT}/package.json /usr/${BUILD_CONTEXT}/
RUN npm install /usr/${BUILD_CONTEXT}/ --only=production

COPY --from=build /usr/src/app/${BUILD_CONTEXT}/backend/${BUILD_CONTEXT}/dist/ /usr/${BUILD_CONTEXT}/dist/
COPY --from=build /usr/src/app/${BUILD_CONTEXT}/backend/proto /usr/proto

CMD /wait && node /usr/${BUILD_CONTEXT}/dist/main.js