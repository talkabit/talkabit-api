FROM node:8.16.2-alpine

WORKDIR /app

COPY . ./

COPY .env.prod .env

RUN npm install --production

EXPOSE 3000

CMD npm start