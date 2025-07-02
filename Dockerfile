# Use the official Node.js image as a base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy the pnpm files (pnpm-lock.yaml and package.json)
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install project dependencies using pnpm
RUN pnpm install

# Copy the rest of the application files
COPY . .

# Build the TypeScript application
RUN pnpm build

# Expose the port that the app will run on
EXPOSE 8080

# Command to run the application
CMD ["pnpm", "start"]  # Runs your start command from package.json
