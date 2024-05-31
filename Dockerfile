# Stage 1: Build the application
FROM node:16-alpine as builder

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Run the application
FROM node:16-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy the build and node_modules from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# Ensure the dist directory exists
RUN mkdir -p dist

# Expose the application port
EXPOSE 3000

# Command to run the migrations and then start the application
CMD npm run migration:run && node dist/main
