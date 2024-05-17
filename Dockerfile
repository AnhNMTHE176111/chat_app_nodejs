FROM node:21.7.1

WORKDIR /home/app

COPY package*.json ./

RUN npm install && npm install -g nodemon typescript

COPY . .

EXPOSE 3000

ENTRYPOINT [ "npx", "nodemon", "--exitcrash ", "--legacy-watch", "--delay", "2000ms", "start" ]