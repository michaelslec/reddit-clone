#!/bin/bash

echo -n "What version? "
read VER

NEW_BUILD="michaelslec/reddit-clone:${VER}"

docker build -t $NEW_BUILD server
docker push $NEW_BUILD

ssh reddit-clone "docker pull ${NEW_BUILD} && docker tag ${NEW_BUILD} dokku/reddit-clone:${VER} && dokku deploy reddit-clone ${VER}"
