FROM node:alpine as build

COPY package.json package.json
RUN npm install
COPY . .
run npm build

FROM nginx:stable-alpine

COPY --from=build /dist /usr/shared/nginx/html
COPY --from=build nginx.conf /etc/nginx/conf.d/default.conf
EXPOSER 3000
CMD ['nginx','-g','daemon off;']