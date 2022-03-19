# Dockerfile
FROM node:16.14.0-alpine

# create destination directory
RUN mkdir -p /usr/src/moodisc
WORKDIR /usr/src/moodisc

# update and install dependency
RUN apk update && apk upgrade

# copy the app, note .dockerignore
COPY package.json /usr/src/moodisc
COPY . /usr/src/moodisc
RUN npm install

# change timezone
RUN apk add --no-cache tzdata
ENV TZ=Europe/Paris
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

CMD [ "npm", "run", "dev" ]
