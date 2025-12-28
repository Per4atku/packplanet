# Production Deployment Guide

This guide provides step-by-step instructions for deploying PackPlanet to a VPS with limited resources (1GB RAM, 15GB disk).

## Overview

The deployment architecture:

- **Build Location**: GitHub Actions (CI/CD)
- **Image Registry**: GitHub Container Registry (ghcr.io)
- **VPS Role**: Pull and run pre-built images only (NO building on VPS)
- **Platform**: Linux AMD64
- **Services**: Next.js app + PostgreSQL + Nginx

## Prerequisites

- Ubuntu VPS with 1GB RAM, 15GB disk
- SSH access to VPS
- GitHub account with repository access
- Domain or IP address (optional, can use IP)

---

## Part 1: Initial VPS Setup

### 1.1 Connect to VPS

```bash
ssh root@your-vps-ip
```

### 1.2 Update System

```bash
apt update && apt upgrade -y
```

### 1.3 Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Verify installation
docker --version
```

### 1.4 Install Docker Compose

Docker Compose v2 is now included with Docker, but verify:

```bash
docker compose version
```

If not available:

```bash
apt install docker-compose-plugin
```

### 1.5 Create Application Directory

```bash
mkdir -p /opt/packplanet
cd /opt/packplanet
```

---

## Part 2: Configure Environment

### 2.1 Download Required Files from Repository

You need these files on your VPS:
- `docker-compose.yml`
- `nginx/nginx.conf`

Option A: Clone the repository (if private repo is accessible):

```bash
git clone https://github.com/YOUR-USERNAME/packplanet.git /opt/packplanet
cd /opt/packplanet
```

Option B: Download specific files only:

```bash
cd /opt/packplanet

# Download docker-compose.yml
curl -O https://raw.githubusercontent.com/YOUR-USERNAME/packplanet/main/docker-compose.yml

# Create nginx directory and download config
mkdir -p nginx
curl -o nginx/nginx.conf https://raw.githubusercontent.com/YOUR-USERNAME/packplanet/main/nginx/nginx.conf
```

### 2.2 Create `.env` File

```bash
nano .env
```

Copy from `.env.example` and customize:

```env
# PostgreSQL Configuration
POSTGRES_DB=packplanet
POSTGRES_USER=packplanet_user
POSTGRES_PASSWORD=YOUR_SECURE_PASSWORD_HERE

# Database URL - CRITICAL: Use 'postgres' as hostname (Docker service name)
DATABASE_URL=postgres://packplanet_user:YOUR_SECURE_PASSWORD_HERE@postgres:5432/packplanet

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YOUR_ADMIN_PASSWORD_HERE

# GitHub Repository (format: username/repo)
GITHUB_REPOSITORY=YOUR-USERNAME/packplanet

# Node Environment
NODE_ENV=production
```

**IMPORTANT**:
- Replace `YOUR_SECURE_PASSWORD_HERE` with a strong password
- Replace `YOUR_ADMIN_PASSWORD_HERE` with admin panel password
- Replace `YOUR-USERNAME` with your GitHub username
- Use `postgres` as the database host (NOT `localhost`)

Save and exit (Ctrl+O, Enter, Ctrl+X).

### 2.3 Verify `.env` File

```bash
cat .env
```

Ensure all variables are set correctly.

---

## Part 3: GitHub Container Registry Authentication

### 3.1 Create GitHub Personal Access Token

1. Go to GitHub: Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "VPS Docker Pull"
4. Select scopes: `read:packages`
5. Generate and copy the token

### 3.2 Login to GHCR from VPS

```bash
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u YOUR-USERNAME --password-stdin
```

Replace:
- `YOUR_GITHUB_TOKEN` with the token from step 3.1
- `YOUR-USERNAME` with your GitHub username

Successful login shows: `Login Succeeded`

---

## Part 4: First Deployment

### 4.1 Pull Docker Images

```bash
cd /opt/packplanet
docker compose pull
```

This downloads the pre-built image from GHCR.

### 4.2 Start Services

```bash
docker compose up -d
```

This starts:
- PostgreSQL database
- Next.js application
- Nginx reverse proxy

### 4.3 Check Container Status

```bash
docker compose ps
```

All services should show "Up" status.

### 4.4 Run Database Migrations

```bash
docker compose exec app pnpm prisma migrate deploy
```

This applies all database migrations.

**Note for Prisma 7**: The migrations use `prisma.config.ts` which reads `DATABASE_URL` from the environment. Ensure your `.env` file is properly configured before running migrations.

### 4.5 (Optional) Seed Database

If you have a seed script:

```bash
docker compose exec app pnpm prisma db seed
```

### 4.6 Verify Deployment

```bash
# Check logs
docker compose logs app

# Check if app is responding
curl http://localhost:80
```

Visit your VPS IP in a browser: `http://your-vps-ip`

---

## Part 5: Continuous Deployment (Updates)

### 5.1 How It Works

1. You push code to `main` branch
2. GitHub Actions builds new Docker image
3. Image is pushed to GHCR with tags: `latest` and commit SHA
4. You pull and restart containers on VPS

### 5.2 Update Deployment

```bash
cd /opt/packplanet

# Pull latest image
docker compose pull

# Restart containers with new image
docker compose up -d

# Run migrations if schema changed
docker compose exec app pnpm prisma migrate deploy
```

### 5.3 Verify Update

```bash
# Check container is using new image
docker compose ps

# View logs
docker compose logs -f app
```

---

## Part 6: Monitoring and Maintenance

### 6.1 View Logs

```bash
# All services
docker compose logs

# Specific service
docker compose logs app
docker compose logs postgres
docker compose logs nginx

# Follow logs (real-time)
docker compose logs -f app
```

### 6.2 Check Resource Usage

```bash
# Container stats
docker stats

# Disk usage
docker system df
```

### 6.3 Check Service Health

```bash
# Container status
docker compose ps

# PostgreSQL health
docker compose exec postgres pg_isready -U packplanet_user

# Application health
curl http://localhost/health
```

### 6.4 Restart Services

```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart app
```

---

## Part 7: Troubleshooting

### 7.1 Application Won't Start

```bash
# Check logs
docker compose logs app

# Common issues:
# - DATABASE_URL incorrect → verify .env
# - Migrations not run → run prisma migrate deploy
# - Out of memory → check docker stats
```

### 7.2 Database Connection Failed

```bash
# Verify postgres is running
docker compose ps postgres

# Check DATABASE_URL in .env
# Must use 'postgres' as host, NOT 'localhost'

# Test connection
docker compose exec postgres psql -U packplanet_user -d packplanet
```

### 7.3 Nginx 502 Bad Gateway

```bash
# Check if app is running
docker compose ps app

# Check app logs
docker compose logs app

# Verify nginx can reach app
docker compose exec nginx ping app
```

### 7.4 Out of Memory

```bash
# Check memory usage
docker stats

# If containers are killed due to OOM:
# - Reduce memory limits in docker-compose.yml
# - Disable unnecessary features
# - Restart containers
docker compose restart
```

### 7.5 Pull Image Fails (Authentication)

```bash
# Re-login to GHCR
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u YOUR-USERNAME --password-stdin

# Verify repository name in .env matches GitHub
cat .env | grep GITHUB_REPOSITORY
```

---

## Part 8: Rollback

### 8.1 Rollback to Previous Version

GitHub Actions tags images with commit SHA. To rollback:

```bash
# List available images
docker images | grep packplanet

# Update docker-compose.yml to use specific tag
# Edit the app service image line:
# image: ghcr.io/YOUR-USERNAME/packplanet:main-abc1234

# Pull specific version
docker compose pull

# Restart
docker compose up -d
```

### 8.2 Rollback Database Migration

```bash
# Not recommended in production
# Better approach: Create a new migration to undo changes

# If absolutely necessary:
docker compose exec app pnpm prisma migrate resolve --rolled-back "MIGRATION_NAME"
```

---

## Part 9: Backup and Restore

### 9.1 Backup Database

```bash
# Create backup directory
mkdir -p /opt/backups

# Backup PostgreSQL
docker compose exec postgres pg_dump -U packplanet_user packplanet > /opt/backups/backup-$(date +%Y%m%d-%H%M%S).sql
```

### 9.2 Backup Uploads

```bash
# Uploads are in Docker volume
docker run --rm -v packplanet_uploads:/data -v /opt/backups:/backup alpine tar czf /backup/uploads-$(date +%Y%m%d-%H%M%S).tar.gz -C /data .
```

### 9.3 Restore Database

```bash
# Stop app to prevent connections
docker compose stop app

# Restore
docker compose exec -T postgres psql -U packplanet_user packplanet < /opt/backups/backup-YYYYMMDD-HHMMSS.sql

# Start app
docker compose start app
```

### 9.4 Restore Uploads

```bash
docker run --rm -v packplanet_uploads:/data -v /opt/backups:/backup alpine tar xzf /backup/uploads-YYYYMMDD-HHMMSS.tar.gz -C /data
```

---

## Part 10: Security Hardening

### 10.1 Firewall Configuration

```bash
# Install UFW (if not installed)
apt install ufw

# Allow SSH
ufw allow 22/tcp

# Allow HTTP
ufw allow 80/tcp

# Allow HTTPS (if using SSL)
ufw allow 443/tcp

# Enable firewall
ufw enable
```

### 10.2 Enable HTTPS with Let's Encrypt (Optional)

```bash
# Install certbot
apt install certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
certbot renew --dry-run
```

### 10.3 Regular Updates

```bash
# Update system packages
apt update && apt upgrade -y

# Update Docker images
cd /opt/packplanet
docker compose pull
docker compose up -d
```

---

## Part 11: Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `POSTGRES_DB` | PostgreSQL database name | `packplanet` |
| `POSTGRES_USER` | PostgreSQL username | `packplanet_user` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `secure_password_123` |
| `DATABASE_URL` | Prisma connection string | `postgres://user:pass@postgres:5432/db` |
| `ADMIN_USERNAME` | Admin panel username | `admin` |
| `ADMIN_PASSWORD` | Admin panel password | `admin_password_123` |
| `GITHUB_REPOSITORY` | GitHub repo (user/repo) | `username/packplanet` |
| `NODE_ENV` | Node environment | `production` |

**Critical Note**: In `DATABASE_URL`, the hostname MUST be `postgres` (the Docker Compose service name), NOT `localhost` or `127.0.0.1`.

---

## Part 12: Automated Deployment Script

Create a deployment script for easier updates:

```bash
nano /opt/packplanet/deploy.sh
```

Content:

```bash
#!/bin/bash
set -e

echo "🚀 Starting deployment..."

cd /opt/packplanet

echo "📥 Pulling latest images..."
docker compose pull

echo "🔄 Restarting services..."
docker compose up -d

echo "🗄️  Running migrations..."
docker compose exec app pnpm prisma migrate deploy

echo "✅ Deployment complete!"

echo "📊 Container status:"
docker compose ps
```

Make executable:

```bash
chmod +x /opt/packplanet/deploy.sh
```

Use it:

```bash
/opt/packplanet/deploy.sh
```

---

## Part 13: Monitoring Setup (Optional)

### 13.1 Install Monitoring Tools

```bash
# Install htop for system monitoring
apt install htop

# Install docker stats wrapper
docker stats --no-stream
```

### 13.2 Log Rotation

Docker handles log rotation by default, but verify:

```bash
nano /etc/docker/daemon.json
```

Add:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

Restart Docker:

```bash
systemctl restart docker
```

---

## Summary

✅ Your application is now deployed!

**Deployment Flow**:
1. Push to `main` → GitHub Actions builds image
2. SSH to VPS → `cd /opt/packplanet && ./deploy.sh`
3. Done!

**Key Files on VPS**:
- `/opt/packplanet/docker-compose.yml` - Container orchestration
- `/opt/packplanet/.env` - Environment variables (secrets)
- `/opt/packplanet/nginx/nginx.conf` - Nginx configuration
- `/opt/packplanet/deploy.sh` - Deployment script

**Important Commands**:
- Deploy updates: `./deploy.sh`
- View logs: `docker compose logs -f app`
- Restart: `docker compose restart`
- Check status: `docker compose ps`

**Support**:
- Documentation: This file
- Logs: `docker compose logs`
- GitHub Actions: Check workflow runs for build errors
