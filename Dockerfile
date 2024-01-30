FROM node:21

WORKDIR /usr/src/app

RUN npm install
RUN npm run build

COPY . .

EXPOSE 8080

CMD ["PORT=8080", "node", "./dist/index.js"]
