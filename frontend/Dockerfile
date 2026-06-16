# install deps first
FROM node:22-bookworm-slim AS deps
WORKDIR /usr/src/app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package*.json ./
# npm ci instead of install (faster and cleaner in containers)
RUN npm ci

# build stage - compile the app
FROM node:22-bookworm-slim AS builder
WORKDIR /usr/src/app
ENV NEXT_TELEMETRY_DISABLED=1
# reuse deps from first stage
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
# build it
RUN npm run build

# final runtime image - only what we need
FROM node:22-bookworm-slim AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

RUN echo "BUILD URL=$NEXT_PUBLIC_API_BASE_URL"

# run as non-root user
RUN useradd --system --uid 1001 nextjs
# copy only the built stuff, no source code
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/.next/standalone ./
COPY --from=builder /usr/src/app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
# run the next server
CMD ["node", "server.js"]
