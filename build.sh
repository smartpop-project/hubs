#!/bin/bash
set -ex
cd "$(dirname "$0")"

docker build --no-cache -t client .
