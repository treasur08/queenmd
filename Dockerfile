FROM node:20-buster

# Install dependencies with retry mechanism
RUN apt-get update --fix-missing || (sleep 2 && apt-get update --fix-missing) && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    ffmpeg \
    imagemagick \
    libwebp-dev \
    webp && \
    apt-get upgrade -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 8000

# Start the bot - make sure this points to your actual entry point file
CMD ["node", "queen.js"]
