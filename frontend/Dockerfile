FROM node:16.13.2-alpine AS build
WORKDIR /usr/src/app/frontend

RUN npm install -g npm@7.24.2

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build:prod

FROM nginx:1.17.1-alpine AS production
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/frontend/dist/frontend /usr/share/nginx/html
