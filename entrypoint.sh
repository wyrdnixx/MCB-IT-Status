#!/bin/ash

apk update
apk add nodejs
apk add yarn
apk add git
apk add vim

git clone https://github.com/wyrdnixx/MCB-IT-Status ./app
cd ./app/
git pull

cd ./client/
yarn install
yarn build
cd ../api
yarn install
yarn run start