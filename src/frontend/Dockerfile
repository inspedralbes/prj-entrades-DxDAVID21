FROM oven/bun:latest

WORKDIR /app

COPY package.json ./

RUN bun install

RUN bun add -D esbuild

COPY . .

EXPOSE 3000