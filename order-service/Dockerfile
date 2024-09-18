FROM node:latest

WORKDIR /app

COPY package*.json /app/

RUN npm i -d

COPY . .

RUN npx prisma generate

EXPOSE 2001

CMD ["node", "server.js"]