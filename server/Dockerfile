FROM node:9.4.0-alpine
RUN apk update && apk add bash
WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080
CMD npm run start
# CMD /wait-for-it.sh db:3306 -- npm run start -- when using your own local db 
 