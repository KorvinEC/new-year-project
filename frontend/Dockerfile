FROM node:18.19.1-alpine AS builder

WORKDIR /app

COPY ./package.json ./package-lock.json ./

RUN npm install

COPY . .

ENV NODE_ENV=production

RUN npm run build

# Bundle static assets with nginx
FROM nginx:stable-alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
