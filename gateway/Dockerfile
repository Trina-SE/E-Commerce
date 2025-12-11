# syntax=docker/dockerfile:1
FROM node:18-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

COPY gateway/package*.json ./
RUN npm ci --omit=dev

COPY gateway/src ./src

EXPOSE 5000
CMD ["node", "src/index.js"]
