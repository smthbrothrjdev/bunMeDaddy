FROM oven/bun

WORKDIR /app

COPY package.json .
COPY tsconfig.json .
COPY bun.lockb .
COPY src ./src

RUN bun install
RUN bun build:prod

ENTRYPOINT ["bun", "dist/index.js"]
