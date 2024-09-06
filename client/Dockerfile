# frontend/Dockerfile

# Stage 1: Build the React app
FROM node:alpine as build

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package.json ./
RUN npm install

# Копируем весь код и запускаем сборку
COPY . ./
RUN npm run build

# Stage 2: Serve the React app with Nginx
FROM nginx:stable-alpine

# Копируем результат сборки в директорию, откуда Nginx будет раздавать файлы
COPY --from=build /app/build /usr/share/nginx/html

# Копируем конфигурацию Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]