FROM node:16-alpine AS prod-deps

WORKDIR /usr/src/app
COPY package*.json prisma ./
RUN npm pkg delete scripts.prepare
RUN npm ci --omit=dev


FROM node:16-alpine AS builder

WORKDIR /usr/src/app
COPY package*.json prisma ./
RUN npm ci
COPY . .
RUN npm run build


FROM node:16-alpine AS runner

WORKDIR /usr/src/app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 --ingroup nodejs nodejs
COPY --from=prod-deps --chown=nodejs:nodejs /usr/src/app/package*.json ./
COPY --from=prod-deps --chown=nodejs:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/dist ./dist
USER nodejs

CMD [ "npm", "start" ]
