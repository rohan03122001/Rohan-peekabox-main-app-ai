FROM node:alpine
WORKDIR /usr/src/app
COPY ./package.json ./package-lock.json ./
RUN npm ci
COPY ./src ./src
CMD ["npm", "start"]