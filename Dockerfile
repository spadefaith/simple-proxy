FROM node:19.0.0-alpine3.16 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN mkdir /usr/app
WORKDIR /usr/app

COPY package*.json pnpm-lock.yaml nodemon.json ./

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# FROM base AS build
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# RUN pnpm run build

FROM base
COPY --from=prod-deps /usr/app/node_modules /usr/app/node_modules
# COPY --from=build /app/dist /app/dist

COPY . .

EXPOSE 8003
CMD [ "pnpm", "start" ]