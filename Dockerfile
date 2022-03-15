# Dockerfile
FROM node:latest-alpine

# create destination directory
RUN mkdir -p /usr/src/moodisc
WORKDIR /usr/src/moodisc

# update and install dependency
RUN apk update && apk upgrade

# copy the app, note .dockerignore
COPY package.json /usr/src/moodisc
COPY . /usr/src/moodisc
RUN npm install

CMD [ "npm", "dev" ]
