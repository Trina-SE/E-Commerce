# syntax=docker/dockerfile:1
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY services/users/package*.json ./
RUN npm install --omit=dev

COPY services/users/src ./src

EXPOSE 5005
CMD ["node", "src/index.js"]
