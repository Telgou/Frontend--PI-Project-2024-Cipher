# Use the official Node.js image as the base image
FROM node:18.18

# Set the working directory
WORKDIR /src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application
COPY . .

# Build the React app
RUN npm run build

# Expose port 80
EXPOSE 3000

# Serve the built React app
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
