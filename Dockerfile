FROM node:21.7.1

WORKDIR /home/app

COPY package*.json ./

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install nodemon -g; \
        fi

RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --omit=dev; \
        fi

COPY . .

CMD ["npm run dev"]