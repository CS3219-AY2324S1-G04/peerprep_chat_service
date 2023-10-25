FROM node:hydrogen

RUN apt-get update
RUN apt-get install unzip -y

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm install

COPY . .

EXPOSE 4000

CMD [ "npm", "start", "dev"]
