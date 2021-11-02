FROM node:14.18.1-alpine
RUN npm install -g npm@6.14.7
RUN npm install -g @angular/cli

RUN mkdir -p /var/www/frontend
WORKDIR /var/www/frontend

ADD . /var/www/frontend
RUN npm install

CMD npm run build && npm start
