FROM node:alpine

WORKDIR /app

COPY package.json ./
RUN npm i

EXPOSE 5173

COPY . .
CMD ["npm", "run", "dev"]