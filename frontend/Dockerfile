FROM node:14.18.1-alpine
RUN npm install -g npm@7.24.2

RUN npm install -g @angular/cli

RUN mkdir -p /var/www/frontend
WORKDIR /var/www/frontend

ADD . /var/www/frontend
RUN npm install

CMD npm run build && npm start
