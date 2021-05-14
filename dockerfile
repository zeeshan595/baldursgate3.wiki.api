FROM node:alpine3.13
EXPOSE 3000
COPY . /app
WORKDIR /app
CMD node dist/index.js