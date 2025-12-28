#!/bin/bash
set -e

# Configuration
DOCKER_USERNAME="${DOCKER_USERNAME:-artcchi}"
IMAGE_NAME="packplanet"
VERSION="${1:-latest}"

echo "🔨 Building Docker image..."
docker build -t $DOCKER_USERNAME/$IMAGE_NAME:$VERSION .

echo "📤 Pushing to Docker Hub..."
docker push $DOCKER_USERNAME/$IMAGE_NAME:$VERSION

if [ "$VERSION" != "latest" ]; then
    echo "🏷️  Tagging as latest..."
    docker tag $DOCKER_USERNAME/$IMAGE_NAME:$VERSION $DOCKER_USERNAME/$IMAGE_NAME:latest
    docker push $DOCKER_USERNAME/$IMAGE_NAME:latest
fi

echo "✅ Done! Image: $DOCKER_USERNAME/$IMAGE_NAME:$VERSION"
echo ""
echo "To deploy on VPS, run:"
echo "  export DOCKER_IMAGE=$DOCKER_USERNAME/$IMAGE_NAME:$VERSION"
echo "  docker compose -f docker-compose.prod.yml pull"
echo "  docker compose -f docker-compose.prod.yml up -d"
