# Docker Setup Instructions for Pack Planet

This guide explains how to build and run the Pack Planet Next.js application using Docker.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or higher)

## Quick Start

### Production Build

The fastest way to run the application in production mode:

```bash
# Build and start all services
docker compose up -d

# View logs
docker compose logs -f app

# Stop all services
docker compose down
```

The application will be available at http://localhost:3000

### Development Mode

For development with hot reload:

```bash
# Build and start development environment
docker compose -f docker-compose.dev.yml up -d

# View logs
docker compose -f docker-compose.dev.yml logs -f app

# Stop development environment
docker compose -f docker-compose.dev.yml down
```

## Detailed Instructions

### 1. Production Deployment

#### Step 1: Configure Environment Variables

Create a `.env.docker` file (optional, docker-compose.yml has defaults):

```bash
cp .env.docker.example .env.docker
```

Edit `.env.docker` with your production settings if needed.

#### Step 2: Build the Docker Image

```bash
# Build the production image
docker compose build

# Or build without cache
docker compose build --no-cache
```

#### Step 3: Run Database Migrations

On first run, you need to apply database migrations:

```bash
# Start only the database
docker compose up -d postgres

# Wait for database to be ready (about 10 seconds)
sleep 10

# Run migrations
docker compose run --rm app sh -c "npx prisma migrate deploy"
```

Alternatively, you can run migrations inside the running container:

```bash
# Start all services
docker compose up -d

# Execute migrations in the app container
docker compose exec app npx prisma migrate deploy
```

#### Step 4: Start the Application

```bash
# Start all services
docker compose up -d

# Check if services are running
docker compose ps

# View application logs
docker compose logs -f app
```

#### Step 5: Verify the Application

Open your browser and navigate to:
- Application: http://localhost:3000
- Admin Panel: http://localhost:3000/admin

### 2. Development Workflow

#### Step 1: Start Development Environment

```bash
# Start services with hot reload
docker compose -f docker-compose.dev.yml up -d
```

This will:
- Start PostgreSQL database
- Mount your source code as volumes
- Enable Next.js hot reload
- Automatically generate Prisma Client
- Apply database migrations

#### Step 2: Watch Logs

```bash
# Follow all logs
docker compose -f docker-compose.dev.yml logs -f

# Follow only app logs
docker compose -f docker-compose.dev.yml logs -f app
```

#### Step 3: Run Prisma Commands

```bash
# Generate Prisma Client
docker compose -f docker-compose.dev.yml exec app pnpm prisma generate

# Create a new migration
docker compose -f docker-compose.dev.yml exec app pnpm prisma migrate dev --name your_migration_name

# Open Prisma Studio
docker compose -f docker-compose.dev.yml exec app pnpm prisma studio
```

Note: Prisma Studio will run inside the container. You may need to port forward if it's not accessible.

#### Step 4: Install New Dependencies

```bash
# Add a new dependency
docker compose -f docker-compose.dev.yml exec app pnpm add package-name

# Add a dev dependency
docker compose -f docker-compose.dev.yml exec app pnpm add -D package-name

# Rebuild container after dependency changes
docker compose -f docker-compose.dev.yml up -d --build
```

### 3. Database Management

#### Access PostgreSQL Database

```bash
# Using psql inside the container
docker compose exec postgres psql -U postgres -d packplanet

# Or from your host (if you have psql installed)
psql postgresql://postgres:postgres@localhost:5432/packplanet
```

#### Backup Database

```bash
# Create a backup
docker compose exec postgres pg_dump -U postgres packplanet > backup.sql

# Restore from backup
docker compose exec -T postgres psql -U postgres packplanet < backup.sql
```

#### Reset Database

```bash
# Stop the app
docker compose down

# Remove the database volume
docker volume rm packplanet_postgres_data

# Start fresh
docker compose up -d
docker compose exec app npx prisma migrate deploy
```

### 4. Common Docker Commands

#### View Running Containers

```bash
docker compose ps
```

#### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f app
docker compose logs -f postgres
```

#### Restart Services

```bash
# Restart all services
docker compose restart

# Restart specific service
docker compose restart app
```

#### Stop and Remove Containers

```bash
# Stop services
docker compose stop

# Stop and remove containers
docker compose down

# Stop and remove containers + volumes
docker compose down -v
```

#### Execute Commands in Container

```bash
# Open shell in app container
docker compose exec app sh

# Run a specific command
docker compose exec app pnpm build
docker compose exec app pnpm prisma studio
```

### 5. Troubleshooting

#### Container Won't Start

```bash
# Check logs for errors
docker compose logs app

# Rebuild without cache
docker compose build --no-cache
docker compose up -d
```

#### Database Connection Issues

```bash
# Check if database is running
docker compose ps postgres

# Check database logs
docker compose logs postgres

# Verify DATABASE_URL is correct
docker compose exec app env | grep DATABASE_URL
```

#### Prisma Client Not Generated

```bash
# Manually generate Prisma Client
docker compose exec app pnpm prisma generate

# Rebuild the container
docker compose up -d --build
```

#### Port Already in Use

If port 3000 or 5432 is already in use, modify `docker-compose.yml`:

```yaml
services:
  app:
    ports:
      - "3001:3000"  # Changed from 3000:3000

  postgres:
    ports:
      - "5433:5432"  # Changed from 5432:5432
```

Don't forget to update DATABASE_URL if you change the postgres port.

#### Hot Reload Not Working in Development

```bash
# Ensure volumes are properly mounted
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml up -d

# Check mounted volumes
docker compose -f docker-compose.dev.yml exec app ls -la /app/src
```

#### Clear Build Cache

```bash
# Remove all unused images and build cache
docker system prune -a

# Rebuild from scratch
docker compose build --no-cache
```

### 6. Production Deployment Checklist

Before deploying to production:

- [ ] Update `.env.docker` with production credentials
- [ ] Change PostgreSQL password in `docker-compose.yml`
- [ ] Set up proper volume backups for `postgres_data`
- [ ] Configure reverse proxy (nginx/traefik) for SSL
- [ ] Set up monitoring and logging
- [ ] Review security settings
- [ ] Test database migrations
- [ ] Set up automated backups
- [ ] Configure upload persistence (`public/uploads` volume)

### 7. Advanced Configuration

#### Using External Database

To use an external PostgreSQL database instead of the Docker container:

1. Remove the `postgres` service from `docker-compose.yml`
2. Update the `DATABASE_URL` in the environment variables
3. Remove the `depends_on` section from the app service

```yaml
services:
  app:
    # ... other config
    environment:
      - DATABASE_URL=postgresql://user:password@external-host:5432/database
```

#### Custom Build Arguments

Add build arguments to `Dockerfile`:

```dockerfile
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine AS deps
```

Then pass them in docker-compose.yml:

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NODE_VERSION: 20
```

#### Multi-Environment Setup

Create separate compose files for different environments:

```bash
# Staging
docker compose -f docker-compose.yml -f docker-compose.staging.yml up -d

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Architecture Overview

### Multi-Stage Docker Build

The production Dockerfile uses a multi-stage build:

1. **deps**: Installs dependencies using pnpm
2. **builder**: Generates Prisma Client and builds Next.js app
3. **runner**: Minimal production image with only necessary files

This approach results in:
- Smaller final image size (~200MB vs 1GB+)
- Faster deployment
- Better security (fewer dependencies in production)
- Separated build and runtime environments

### Services

- **postgres**: PostgreSQL 16 database with persistent volume
- **app**: Next.js application with Prisma ORM

### Volumes

- `postgres_data`: Persists database data across container restarts
- Optional: Mount `./public/uploads` for persistent file uploads

### Network

Services communicate via Docker's internal network. The app connects to postgres using the service name as hostname.

## Next Steps

- Set up CI/CD pipeline for automated builds
- Configure container orchestration (Kubernetes, Docker Swarm)
- Implement health checks and monitoring
- Set up log aggregation
- Configure automated backups
- Add Redis for caching (if needed)

## Support

For issues or questions:
- Check Docker logs: `docker compose logs`
- Review application logs in the container
- Consult Next.js and Prisma documentation
- Open an issue in the project repository
