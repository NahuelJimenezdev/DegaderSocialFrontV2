# Stage 1: Build the React application
FROM node:18-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Definir variables de entorno para el build de Vite
ARG VITE_API_URL
ARG VITE_ENV=production
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_VAPID_KEY

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_ENV=$VITE_ENV
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID
ENV VITE_FIREBASE_VAPID_KEY=$VITE_FIREBASE_VAPID_KEY

# Inyectar variables en el Service Worker durante el build
RUN sed -i "s/__VITE_FIREBASE_API_KEY__/${VITE_FIREBASE_API_KEY}/g" public/firebase-messaging-sw.js && \
    sed -i "s/__VITE_FIREBASE_AUTH_DOMAIN__/${VITE_FIREBASE_AUTH_DOMAIN}/g" public/firebase-messaging-sw.js && \
    sed -i "s/__VITE_FIREBASE_PROJECT_ID__/${VITE_FIREBASE_PROJECT_ID}/g" public/firebase-messaging-sw.js && \
    sed -i "s/__VITE_FIREBASE_STORAGE_BUCKET__/${VITE_FIREBASE_STORAGE_BUCKET}/g" public/firebase-messaging-sw.js && \
    sed -i "s/__VITE_FIREBASE_MESSAGING_SENDER_ID__/${VITE_FIREBASE_MESSAGING_SENDER_ID}/g" public/firebase-messaging-sw.js && \
    sed -i "s/__VITE_FIREBASE_APP_ID__/${VITE_FIREBASE_APP_ID}/g" public/firebase-messaging-sw.js

RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output to the Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
