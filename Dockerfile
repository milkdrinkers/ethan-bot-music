FROM oven/bun:debian

# Copy required files
COPY bun.lockb . 
COPY tsconfig.json . 
COPY package.json . 
COPY bunfig.toml . 
COPY src ./src 
COPY locales ./locales 

# Install FFmpeg
RUN apt update \
    && apt install -y --no-install-recommends ffmpeg

# Install dependencies
RUN bun install --frozen-lockfile

# run the app
USER bun
ENTRYPOINT [ "bun", "run", "start" ]