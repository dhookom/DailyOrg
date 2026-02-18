FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src ./src

FROM node:20-slim

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src

EXPOSE 8080

CMD ["node", "src/index.js"]
