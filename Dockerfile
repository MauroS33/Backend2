# Fase 1: Construcción de la aplicación
FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --production=false
COPY . .

RUN npm run build

# Fase 2: Imagen final
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "dist/app.js"]