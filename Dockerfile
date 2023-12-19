# Dockerfile

##### DEPENDENCIES 

#EDIT: Use 20.9.0, arm64
FROM --platform=linux/arm64 node:20.9.0-alpine3.17 AS deps
RUN apk add --no-cache libc6-compat openssl1.1-compat

WORKDIR /app
#EDIT: Copy over full prisma folder (migrations, schema)
COPY prisma ./prisma

# Copy dependencies
COPY package.json package-lock.json ./

# Clean-install dependencies (avoids cache)
RUN npm ci

##### BUILDER
#EDIT: Use 20.9.0, arm64
FROM --platform=linux/arm64 node:20.9.0-alpine3.17 AS builder
#EDIT: delete arg for database_url since it's unused
ARG NEXT_PUBLIC_CLIENTVAR
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
#EDIT: Copy over full prisma folder (migrations, schema)
COPY --from=deps /app/prisma ./prisma
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN SKIP_ENV_VALIDATION=1 npm run build

##### RUNNER
#EDIT: Use 20.9.0, arm64
FROM --platform=linux/arm64 node:20.9.0-alpine3.17 AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

#EDIT: Use next.config.js not next.config.mjs
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#EDIT: Copy over full prisma folder (migrations, schema)
COPY --from=builder /app/prisma ./prisma

USER nextjs
EXPOSE 3000
ENV PORT 3000

#EDIT: Map schema.prisma to the postgres schema, then run server.
CMD npx prisma migrate deploy \
&& node server.js