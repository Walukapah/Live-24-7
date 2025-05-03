# Stage 1: Build the React app
FROM node:16 as builder

WORKDIR /app
COPY client/package.json .
RUN npm install
COPY client .
RUN npm run build

# Stage 2: Build the server
FROM node:16

WORKDIR /app
COPY server/package.json .
RUN npm install
COPY server .

# Copy built React app
COPY --from=builder /app/build ./public

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

EXPOSE 5000
CMD ["node", "index.js"]
