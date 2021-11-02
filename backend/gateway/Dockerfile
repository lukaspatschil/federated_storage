FROM node:14.18.1-alpine
RUN npm install -g npm@6.14.7

RUN mkdir -p /var/www/gateway
WORKDIR /var/www/gateway

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

ADD . /var/www/gateway
RUN npm install

CMD /wait && npm run build && npm run start:dev