FROM node:16.16 AS build

WORKDIR /app/hubs/admin

COPY ../package.json ..
COPY ../package-lock.json ..
COPY ./package.json .
COPY ./package-lock.json .

RUN npm ci --prefix /app/hubs
RUN npm ci --legacy-peer-deps

COPY ./ ./

RUN npm run build

FROM nginx:stable-alpine
WORKDIR /app/hubs/admin
COPY --from=build /app/hubs/admin/dist /usr/share/nginx/html

EXPOSE 8989
CMD ["nginx", "-g", "daemon off;", "-c", "/etc/nginx/nginx.conf"]
