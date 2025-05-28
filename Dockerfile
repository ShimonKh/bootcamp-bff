# Используем официальный Node.js образ
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем все зависимости (включая dev для tsc)
RUN npm install

# Копируем исходники проекта
COPY . .

# Собираем TypeScript → dist/
RUN npm run build

# Приложение будет слушать этот порт
EXPOSE 3000

# Запускаем приложение
CMD ["node", "dist/main"]
