FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm i -d

COPY . .

RUN npm run build

EXPOSE 5173

CMD [ "npm", "run", "dev" ]