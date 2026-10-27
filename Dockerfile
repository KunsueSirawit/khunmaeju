# Production image (Next.js standalone output). Built by `docker compose up --build`.
FROM node:24-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci

FROM base AS builder
WORKDIR /app
ARG NEXT_PUBLIC_SERVER_URL=http://localhost:3000
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# The build does not touch the database; a dummy secret keeps Payload's config happy.
RUN PAYLOAD_SECRET=build-only DATABASE_URL=postgres://build:build@localhost:5432/build npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
RUN mkdir -p .next media && chown nextjs:nodejs .next media

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
# Payload applies pending migrations (src/migrations) on start-up.
CMD ["node", "server.js"]
