# syntax=docker/dockerfile:1
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY services/orders/package*.json ./
RUN npm ci --omit=dev

COPY services/orders/src ./src

EXPOSE 5003
CMD ["node", "src/index.js"]
