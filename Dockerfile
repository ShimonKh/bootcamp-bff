# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy source files
COPY . .

# Build the NestJS app
RUN npm run build

# Expose the app port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
