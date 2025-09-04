# Fase 1: Construcción
FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --production=false
COPY . .

RUN npm run build

# Fase 2: Imagen Final
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "dist/main.js"]