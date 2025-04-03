# Build stage
FROM node:16-alpine AS build
WORKDIR /app

# Install yarn globally if not included in the base image
RUN apk add --no-cache yarn

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy project files and build
COPY . .
RUN yarn build

# Production stage
FROM nginx:alpine
# Copy built files from the build stage
COPY --from=build /app/dist/your-angular-app /usr/share/nginx/html
# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]