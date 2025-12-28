#!/bin/bash
set -e

echo "📦 Pack Planet - Runtime Deployment Script"
echo "=========================================="
echo ""

# Step 1: Build the app on host
echo "1️⃣  Building Next.js application on host..."
if [ ! -d "node_modules" ]; then
    echo "   Installing dependencies..."
    pnpm install --frozen-lockfile
fi

echo "   Generating Prisma Client..."
pnpm prisma generate

echo "   Building Next.js..."
pnpm build

echo "   ✅ Build complete!"
echo ""

# Step 2: Prepare for Docker build
echo "2️⃣  Preparing for Docker build..."
# Temporarily use the runtime-specific dockerignore
if [ -f ".dockerignore.runtime" ]; then
    echo "   Using .dockerignore.runtime for build..."
    cp .dockerignore .dockerignore.backup 2>/dev/null || true
    cp .dockerignore.runtime .dockerignore
fi

# Step 3: Build and start Docker containers
echo "3️⃣  Building and starting Docker containers..."
docker compose -f docker-compose.runtime.yml up -d --build

# Restore original dockerignore
if [ -f ".dockerignore.backup" ]; then
    mv .dockerignore.backup .dockerignore
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "  1. Run migrations:"
echo "     docker compose -f docker-compose.runtime.yml run --rm app sh -c 'pnpm prisma migrate deploy'"
echo ""
echo "  2. Check logs:"
echo "     docker compose -f docker-compose.runtime.yml logs -f app"
echo ""
echo "  3. View status:"
echo "     docker compose -f docker-compose.runtime.yml ps"
