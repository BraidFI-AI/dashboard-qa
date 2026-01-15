# Use the Amazon Linux 2023 base image
FROM public.ecr.aws/amazonlinux/amazonlinux:2023

# Install Node.js 18, yarn, and necessary utilities
RUN curl -sL https://rpm.nodesource.com/setup_22.x | bash - \
    && yum install -y nodejs \
    && npm install -g yarn \
    && yum install -y shadow-utils

# Create a new user and group
RUN groupadd -r nodejs && useradd -m -r -g nodejs nodejs

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json file to the working directory
COPY package.json ./

# Install all the npm modules.
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Change ownership of the application files
RUN chown -R nodejs:nodejs /app

# Switch to the new user for security
USER nodejs

# Build the application
RUN yarn build

# Expose port 3000 to be accessible outside the container
EXPOSE 3000

# Command to run the application
CMD ["yarn", "start"]
