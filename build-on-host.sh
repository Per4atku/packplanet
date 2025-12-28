#!/bin/bash
set -e

echo "🔧 Building Next.js app on host (not in Docker)..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install --frozen-lockfile
fi

# Generate Prisma Client
echo "🗄️  Generating Prisma Client..."
pnpm prisma generate

# Build Next.js
echo "🏗️  Building Next.js application..."
pnpm build

echo "✅ Build complete!"
echo ""
echo "Now build the lightweight Docker image:"
echo "  docker build -f Dockerfile.runtime -t packplanet-app ."
echo ""
echo "Or use docker-compose.runtime.yml:"
echo "  docker compose -f docker-compose.runtime.yml up -d --build"
