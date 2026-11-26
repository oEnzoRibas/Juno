FROM node:24-bookworm-slim@sha256:873f586f3794f52281bd039bf02c048a0be08fde619338f9941bad1eb6b34530 AS workspace
ENV NEXT_TELEMETRY_DISABLED=1 TURBO_TELEMETRY_DISABLED=1
WORKDIR /workspace
RUN npm install --global pnpm@11.25.0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
RUN --mount=type=cache,target=/pnpm/store pnpm install --frozen-lockfile --store-dir /pnpm/store
COPY . .
ARG JUNO_BUILD_REVISION
ARG JUNO_BUILD_TREE
ARG JUNO_BUILD_CREATED
ARG JUNO_BUILD_STATE=unavailable
ARG JUNO_BUILD_PRS={}
RUN node scripts/build/stamp-image.mjs
RUN pnpm build

FROM workspace AS runtime
LABEL org.opencontainers.image.source="https://github.com/oEnzoRibas/Juno" \
      org.opencontainers.image.revision="${JUNO_BUILD_REVISION}" \
      org.opencontainers.image.created="${JUNO_BUILD_CREATED}" \
      io.juno.source.tree="${JUNO_BUILD_TREE}" \
      io.juno.source.state="${JUNO_BUILD_STATE}" \
      io.juno.source.pull-requests="${JUNO_BUILD_PRS}"
ENV NODE_ENV=production
RUN chown -R node:node /workspace/apps/web/src /workspace/apps/web/.next && chown node:node /workspace/apps/web
USER node
