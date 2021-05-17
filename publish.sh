# build 
rm -rf dist node_modules
npm install
npm run build

# only include prod
rm -rf node_modules
npm install --prod

# build docker image
docker build . --tag zeeshanabid0/baldursgate3.wiki:latest

# publish docker image
docker push zeeshanabid0/baldursgate3.wiki:latest