FROM oven/bun

WORKDIR /app

COPY package.json .
COPY tsconfig.json .
COPY tailwind.config.ts .
COPY bun.lockb .
COPY src ./src
COPY db.sqlite .

RUN bun install
RUN bun build:prod

ENTRYPOINT ["bun", "dist/index.js"]
