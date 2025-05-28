# Используем официальный Node.js образ
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем все зависимости включая dev-зависимости
RUN npm install

# Устанавливаем TypeScript глобально (на всякий случай)
RUN npm install -g typescript

# Копируем весь остальной код
COPY . .

# Собираем TypeScript → dist/
RUN npm run build

# Указываем порт (если у тебя 3000 — можно поменять на 8080)
EXPOSE 8080

# Запускаем приложение
CMD ["node", "dist/main"]
