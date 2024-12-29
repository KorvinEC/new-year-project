FROM node:18.19.1-alpine AS builder

WORKDIR /app

RUN npm install -g typescript

COPY ./package.json ./package-lock.json ./

ENV NODE_ENV production

RUN npm ci

COPY . .

RUN npm run build

# Bundle static assets with nginx
FROM nginx:stable-alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
