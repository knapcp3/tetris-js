#!/bin/bash -e

echo "Install awscli"
pyenv global 3.7.1
pip install -U pip
pip install --user awscli
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
echo "Docker build"
docker build -f ./docker/Dockerfile.prod -t tetris-js-prod .
echo "Docker images"
docker images
# TODO: versions
echo "Docker tag"
docker tag tetris-js-prod $DOCKER_REPO:1.0.0
docker tag tetris-js-prod $DOCKER_REPO:latest
echo "Docker push"
docker push $DOCKER_REPO:1.0.0
docker push $DOCKER_REPO:latest
echo "AWS update service"
aws configure set region $AWS_REGION
aws configure set aws_access_key_id $AWS_ACCESS_KEY
aws configure set aws_secret_access_key $AWS_SECRET_KEY
aws ecs update-service --cluster arn:aws:ecs:eu-central-1:408298911564:cluster/default --service tetris-js-ec2-service --force-new-deployment