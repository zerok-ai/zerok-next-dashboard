FROM --platform=linux/amd64 node:18-alpine
WORKDIR /app

COPY ./public ./public
COPY ./package.json ./package.json
COPY ./.next/standalone ./
COPY ./.next/static ./.next/static

CMD ["node","server.js"]
EXPOSE 3000

