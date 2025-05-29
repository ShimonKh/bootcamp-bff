# Используем официальный Node.js образ
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Render подаёт переменную PORT — нужно слушать её
ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/main"]
