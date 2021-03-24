# Builder image
FROM registry.sicredi.in/services-nodejs:13x

# Image metadata
LABEL description     = "Provide a docker image to Demo Node BFF."
LABEL path            = "registry.sicredi.in/credit-pricing-bo-bff:13x"
LABEL version         = "$VERSION"

# Build arguments
ARG VERSION="latest"

# Environment variables
ENV NODE_ENV="production"

# Set default workdir
WORKDIR /opt

# Set default port
EXPOSE 8080

# Add source code
ADD dist ./dist
ADD node_modules ./node_modules

# Set default command to start
CMD ["node", "./dist/src/index.js"]