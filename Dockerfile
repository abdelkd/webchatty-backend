FROM node:21

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run build
RUN export PORT=8080


EXPOSE 8080

CMD ["node", "./dist/index.js"]
