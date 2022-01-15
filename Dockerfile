FROM node:15

WORKDIR /usr

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080
CMD [ "node", "index.js" ]