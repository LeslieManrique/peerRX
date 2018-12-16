FROM node:9.4.0-alpine
RUN apk update && apk add bash
WORKDIR /usr/app

COPY package*.json ./
RUN npm install
#RUN npm install -qy

COPY . .

EXPOSE 8080
CMD /wait-for-it.sh db:3306 -- npm run start
