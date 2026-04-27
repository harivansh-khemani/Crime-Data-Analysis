# Use Node.js as the base image
FROM node:20-slim

# Install Python and Java (required for Spark)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    default-jre \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

# Copy ML dependencies
COPY ml-models/requirements.txt ./ml-models/
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip3 install --no-cache-dir -r ml-models/requirements.txt

# Copy the rest of the application
COPY backend/ ./backend/
COPY ml-models/ ./ml-models/
COPY datasets/ ./datasets/

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose the port
EXPOSE 5000

# Start the application from the backend directory
WORKDIR /app/backend
CMD ["node", "server.js"]
