#!/bin/bash
set -e

# Configuration
DOCKER_USERNAME="${DOCKER_USERNAME:-artcchi}"
IMAGE_NAME="packplanet"
VERSION="${1:-latest}"

echo "🔨 Building Docker image for linux/amd64..."
docker buildx build \
  --platform linux/amd64 \
  --provenance=false \
  --sbom=false \
  -t $DOCKER_USERNAME/$IMAGE_NAME:$VERSION \
  --push \
  .

echo "✅ Done! Image: $DOCKER_USERNAME/$IMAGE_NAME:$VERSION"
echo ""
echo "To deploy on VPS, run:"
echo "  export DOCKER_IMAGE=$DOCKER_USERNAME/$IMAGE_NAME:$VERSION"
echo "  docker compose -f docker-compose.prod.yml pull"
echo "  docker compose -f docker-compose.prod.yml up -d"
