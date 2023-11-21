# build stage
FROM node:20.9.0-alpine as build-stage

WORKDIR /app

COPY package*.json ./

RUN apk add --update --no-cache \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev \
    libtool \
    autoconf \
    automake

RUN npm install

COPY . .

RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY ./deployments/nginx/sites-enabled/deploy.conf /etc/nginx/conf.d/default.conf

ENV TZ=Asia/Bangkok

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]