#Choose a base image
FROM node:6.9.4

# Create a new folder for our application
RUN mkdir -p /app

# Set the working dir when our container executes
WORKDIR /app

# Copy our package.json file
ADD package.json /app

# Install our packages
RUN npm install

# Copy the rest of our application
COPY . /app

#Expose our application port
EXPOSE 8000

# Set start command
CMD ["npm", "start"]
