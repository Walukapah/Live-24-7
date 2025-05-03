FROM node:16 as builder

WORKDIR /app
COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client/ ./
RUN npm run build

FROM node:16

WORKDIR /app
COPY server/package.json server/package-lock.json ./
RUN npm install
COPY server/ ./
COPY --from=builder /app/build ./client/build

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

EXPOSE 5000
CMD ["node", "index.js"]
