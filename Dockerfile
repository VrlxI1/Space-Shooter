# Dockerfile for Railway - Project Root
FROM node:20-slim

WORKDIR /app

# Copy the backend files specifically
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ .

# Ensure reset.json and leaderboard.json exist
RUN touch reset.json leaderboard.json

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
