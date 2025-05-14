# Base layer
FROM node:20-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm && corepack install -g pnpm@latest-9
COPY pnpm-lock.yaml ./
RUN pnpm fetch --prod
COPY package.json ./

# Production dependencies
FROM base AS prod-deps
WORKDIR /app
RUN pnpm install --offline --frozen-lockfile --prod

# Build
FROM base AS build
WORKDIR /app
COPY . ./
RUN pnpm install --frozen-lockfile 
RUN pnpm build

# Runtime layer
FROM alpine:3.21.3
WORKDIR /usr/src/app

RUN apk add --no-cache libstdc++ dumb-init
RUN addgroup -g 1000 node && adduser -u 1000 -G node -s /bin/sh -D node
RUN chown node:node ./

COPY --from=base /usr/local/bin/node /usr/local/bin/
COPY --from=base /usr/local/bin/docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]

USER node

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/dist ./dist

CMD ["dumb-init", "node", "dist/main.js"]
