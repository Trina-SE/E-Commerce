# syntax=docker/dockerfile:1
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY services/complaints/package*.json ./
RUN npm ci --omit=dev

COPY services/complaints/src ./src

EXPOSE 5006
CMD ["node", "src/index.js"]
