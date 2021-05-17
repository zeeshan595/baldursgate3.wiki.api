# baldursgate3.wiki.api
This is a baldur's gate 3 databased constructed from extract PAK files within baldur's gate 3

## Prerequisites

* node `16.1+`
* npm `7.11+`
* docker `20.10+`
* docker-compose `1.29+`

## Building the application

1. Get required packages `npm install`
2. Build project `npm run build`
3. Run project `npm run start`

## Extracting pack files

1. Put pak files inside `assets/pak` folder
2. Get required packages `npm install`
3. Run extractor command `npm run tools:extract`

## Build docker image

* `docker build . --tag baldursgate3.wiki:latest`
