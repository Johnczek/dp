FROM node:12.16.1-alpine AS build

RUN mkdir /app
RUN apk update && apk add --no-cache git

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install

COPY ./src ./src
COPY *.json ./
COPY *.js ./
COPY .git ./.git

RUN npm run build

FROM nginx:1.19.4-alpine AS dp-fe_nginx
COPY --from=build /usr/src/app/dist/dp /usr/share/nginx/html
COPY docker/nginx-default.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
ENTRYPOINT nginx -g 'daemon off;'
