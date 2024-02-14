FROM node:16.16 AS build

WORKDIR /app/hubs
COPY ./package.json .
COPY ./package-lock.json .
RUN npm ci


WORKDIR /app/hubs/admin
COPY ./admin/package.json .
COPY ./admin/package-lock.json .
RUN npm ci --legacy-peer-deps

COPY .. ..

RUN npm run build

FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/hubs/admin/dist /usr/share/nginx/html

EXPOSE 8989
CMD ["nginx", "-g", "daemon off;", "-c", "/etc/nginx/nginx.conf"]
