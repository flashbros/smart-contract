FROM node:18-alpine

# Install Dependencies
WORKDIR /app
COPY package.json package-lock.json*  ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Copy all the files
WORKDIR /app
COPY . .

# Production image, copy all the files and run next
EXPOSE 8545
ENV HOSTNAME "0.0.0.0"
ENTRYPOINT ["/bin/sh", "/app/entrypoint.sh"]