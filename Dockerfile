FROM node:10.22
LABEL maintainer Ridwan Taiwo <donriddo@gmail.com>

RUN mkdir -p server
WORKDIR /server

COPY package.json yarn.lock /server/

ADD . /server
RUN yarn

EXPOSE 12345
RUN yarn build

CMD ["node", "lib/server.js"]
