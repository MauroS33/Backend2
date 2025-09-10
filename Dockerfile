# Fase 1: Construcción
FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci # Instala dependencias de manera determinística
COPY tsconfig.json ./
COPY src ./src

# Compila el proyecto usando NestJS CLI
RUN npx nest build

# Eliminar dependencias de desarrollo
RUN npm prune --production && npm cache clean --force

# Fase 2: Imagen Final
FROM node:18-alpine

WORKDIR /app

# Copiar solo las dependencias de producción
COPY --from=builder /app/package*.json ./
RUN npm prune --production && npm cache clean --force

# Copiar el código compilado
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]