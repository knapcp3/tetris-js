#!/bin/bash -e

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker build -f ./docker/Dockerfile.prod -t tetris-js-prod .
docker images
# TODO: versions
docker tag tetris-js-prod $DOCKER_REPO:1.0.0
docker tag tetris-js-prod $DOCKER_REPO:latest
docker push $DOCKER_REPO:1.0.0
docker push $DOCKER_REPO:latest