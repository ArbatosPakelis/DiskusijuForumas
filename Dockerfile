# node image
FROM node:16.18.0-slim

# Working Dir
WORKDIR /user/src/app

# Copy Package Json Files
COPY . package*.json ./

# Install Files
RUN npm install

# Copy Source Files
COPY . .

# Expose the API port
EXPOSE 5000


CMD ["node", "start"]