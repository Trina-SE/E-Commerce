# syntax=docker/dockerfile:1
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY services/products/package*.json ./
RUN npm ci --omit=dev

COPY services/products/src ./src

EXPOSE 5002
CMD ["node", "src/index.js"]
