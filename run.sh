#!/bin/sh
set -e
cd "$(dirname "$0")"
. ./.env

docker rm -f client hubs-vscode

# 첫 번째 파라미터가 'dev'인 경우 dev 모드로 실행
if [ "$1" = "dev" ]; then
  docker run --log-opt max-size=10m --log-opt max-file=3 -d --restart=always --name client \
  -v $(pwd)/certs:/etc/nginx/certs \
  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf \
  -v $(pwd):/app/client \
  -p 8080:8080 \
  client
else
  # 기본 실행 모드
  docker run --log-opt max-size=10m --log-opt max-file=3 -d --restart=always --name client \
  -v $(pwd)/certs:/etc/nginx/certs \
  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf \
  -v $(pwd):/app/client \
  -p 8080:8080 \
  client
fi

docker logs client

# Domain for short links
# export SHORTLINK_DOMAIN="$HUBS_HOST"
# export ASSET_BUNDLE_SERVER="https://$HUBS_HOST"
# 이거 설정하면 POSTGREST_SERVER로 바로 붙는다. 하지마라
# export POSTGREST_SERVER="https://$HUBS_HOST:3000"
# 그렇다고 이거 삭제하면 기본값(hubs.local)으로 접속한다. 삭제도 하지마라
