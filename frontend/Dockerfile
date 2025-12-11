# syntax=docker/dockerfile:1

ARG NODE_VERSION=18
FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

COPY frontend/ ./
RUN npm run build

FROM nginx:1.25-alpine AS runtime
COPY infra/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
