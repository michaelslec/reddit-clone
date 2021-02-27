#!/bin/bash

NO_DEPLOY=0

usage() {
  cat << EOF
  Usage: $(basename "$0") [-b] [version]
  Deploy this project to Digital Ocean

  -h,  Display this message
  -b,  Just build. Do not send this container to DigitalOcean droplet.

EOF
  exit $1
}

build() {
  docker build -t $NEW_BUILD server
}

deploy() {
  docker push $NEW_BUILD
  ssh reddit-clone "docker pull ${NEW_BUILD} && docker tag ${NEW_BUILD} \
    dokku/reddit-clone:${VER} && dokku deploy reddit-clone ${VER}"
}


while [ $# -gt 0 ]; do
  case $1 in
    -h) usage 0;;
    -b) NO_DEPLOY=1;;
     *) VER=$1
  esac
  shift
done

[ -z $VER ] && read -p "What version? " VER
NEW_BUILD="michaelslec/reddit-clone:${VER}"

build
[ $NO_DEPLOY -eq 0 ] && deploy
