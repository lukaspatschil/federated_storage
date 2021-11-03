FROM node:14.18.1-alpine
RUN npm install -g npm@7.24.2

RUN mkdir -p /var/www/mongodb-service
WORKDIR /var/www/mongodb-service

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

ADD . /var/www/mongodb-service
RUN npm install

CMD /wait && npm run build && npm run start:dev