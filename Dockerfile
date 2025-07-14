# Use the official Node.js image as a base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package files
COPY package.json ./

# Install all dependencies including dev dependencies for build
RUN npm install

# Install TypeScript globally for build
RUN npm install -g typescript

# Copy the source files
COPY index.ts ./
COPY interface.ts ./
COPY src/ ./src/
COPY lib/ ./lib/
COPY schema/ ./schema/
COPY type.ts ./
COPY tsconfig.json ./

# Build TypeScript code
RUN npx tsc

# Expose the port that the app will run on
EXPOSE 8080

# Command to run the application
CMD ["node", "dist/index.js"]
