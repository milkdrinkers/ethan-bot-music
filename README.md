# ethan-bot-music

## Developing

> Make sure to read the contribution guide before submitting any PR's!

To install all dependencies:
```bash
bun install
```

To run:
```bash
bun run start
```

To build:
```bash
bun build ./src/index.bot.ts ./src/shard.bot.ts --outdir build --target bun --sourcemap --splitting --minify --external ffmpeg-statis --external ffmpeg-binaries --external @node-ffmpeg/node-ffmpeg-installer --external @ffmpeg-installer/ffmpeg --external ffmpeg-static --external yt-stream/src/stream/decipher.js --external unfetch
```

## Docker

> Development version
```bash
# Build docker image
docker build --pull -t ethan-music .

# Create container (Passing in environment variables from .env file)
docker run -d --env-file ./.env --name ethan ethan-music
```

> Example future production version
```bash
# Build docker image
docker build --pull -t ethan-music-prod . -f Dockerfile.prod

# Create container (Passing in environment variables from .env file)
docker run -d --env-file ./.env --name ethan-prod ethan-music-prod
```