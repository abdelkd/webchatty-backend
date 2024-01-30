FROM node:21

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run build


EXPOSE 8080

CMD ["PORT=8080", "node", "./dist/index.js"]
