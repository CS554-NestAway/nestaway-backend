

FROM node:18.20.2-alpine3.18


WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

CMD ["node", "app.js"]

EXPOSE 8080


