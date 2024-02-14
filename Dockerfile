FROM node:16.16 AS build

WORKDIR /app/client

COPY ./package.json .
COPY ./package-lock.json .

RUN npm ci

COPY ./ ./

RUN npm run build

FROM nginx:stable-alpine
WORKDIR /app/client
COPY --from=build /app/client/dist /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;", "-c", "/etc/nginx/nginx.conf"]
