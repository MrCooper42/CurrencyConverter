FROM node:20-alpine

WORKDIR /app

COPY package* .

RUN npm ci

COPY . .

RUN npm run prisma:generate
EXPOSE 8080

CMD [ "npm", "run", "start:dev" ]