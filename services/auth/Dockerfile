# syntax=docker/dockerfile:1
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY services/auth/package*.json ./
RUN npm ci --omit=dev

COPY services/auth/src ./src

EXPOSE 5001
CMD ["node", "src/index.js"]
