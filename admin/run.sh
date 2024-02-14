#!/bin/sh
set -e
cd "$(dirname "$0")"
. ./.env

docker rm -f admin hubs-ex-vscode

docker run --log-opt max-size=10m --log-opt max-file=3 -d --restart=always --name admin \
-v $SSL_CERT_FILE:/etc/nginx/certs/cert.pem \
-v $SSL_KEY_FILE:/etc/nginx/certs/key.pem \
-v $(pwd)/nginx.conf.admin:/etc/nginx/nginx.conf \
-p 8989:8989 \
admin

docker logs admin

# 이거 설정하면 POSTGREST_SERVER로 바로 붙는다. 하지마라
# export POSTGREST_SERVER="https://$HUBS_HOST:3000"
# 그렇다고 이거 삭제하면 기본값(hubs.local)으로 접속한다. 삭제도 하지마라

# 이건 안 하는거다.
# export UPLOADS_HOST="$HUBS_HOST:4000"
# CONFIGURABLE_SERVICES: 'janus-gateway,reticulum,hubs,spoke'
