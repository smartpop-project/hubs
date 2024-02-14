#!/bin/sh
set -e
cd "$(dirname "$0")"
. ./.env

docker rm -f client hubs-ex-vscode

docker run --log-opt max-size=10m --log-opt max-file=3 -d --restart=always --name client \
-v $SSL_CERT_FILE:/etc/nginx/certs/cert.pem \
-v $SSL_KEY_FILE:/etc/nginx/certs/key.pem \
-v $(pwd)/nginx.conf:/etc/nginx/nginx.conf \
-p 8080:8080 \
client

docker logs client

# Domain for short links
# export SHORTLINK_DOMAIN="$HUBS_HOST"
# export ASSET_BUNDLE_SERVER="https://$HUBS_HOST"
# 이거 설정하면 POSTGREST_SERVER로 바로 붙는다. 하지마라
# export POSTGREST_SERVER="https://$HUBS_HOST:3000"
# 그렇다고 이거 삭제하면 기본값(hubs.local)으로 접속한다. 삭제도 하지마라
