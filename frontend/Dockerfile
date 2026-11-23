FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run test:ci && npm run build

FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

ENV API_URL=http://api:8080
ENV NGINX_ENVSUBST_FILTER=API_URL

COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 8080
