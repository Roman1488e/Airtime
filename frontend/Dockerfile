FROM node:20-alpine AS base

# Xotira limitini oshirish
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Qolgan qismlar...
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production image
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=base /app/next.config.ts ./
COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json

# Xotira limitini oshirish
ENV NODE_OPTIONS="--max-old-space-size=4096"

CMD ["npm", "start"]
