FROM node:21.7.1

WORKDIR /home/app

COPY package*.json ./

RUN npm install && npm install -g nodemon pm2

ENV PM2_PUBLIC_KEY 7roc3ic36hgr5q4
ENV PM2_SECRET_KEY sg7izwc4k0xr59f

COPY . .

EXPOSE 3000

# CMD [ "pm2-runtime", "npm", "--", "start" ]

ENTRYPOINT [ "npx", "nodemon", "--exitcrash ", "--legacy-watch", "--delay", "2000ms", "start" ]