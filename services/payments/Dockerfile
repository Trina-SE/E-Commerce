# syntax=docker/dockerfile:1
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY services/payments/package*.json ./
RUN npm install --omit=dev

COPY services/payments/src ./src

EXPOSE 5004
CMD ["node", "src/index.js"]
