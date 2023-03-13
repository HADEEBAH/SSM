# build stage
FROM node:16.17-alpine3.16 as build-stage
WORKDIR /app
COPY ./package*.json ./
RUN yarn install --production --frozen-lockfile
COPY ./ ./
RUN yarn build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./deployment/nginx /etc/nginx/
EXPOSE 8081
CMD ["nginx", "-g", "daemon off;"]