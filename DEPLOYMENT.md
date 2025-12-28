# Pack Planet - Production Deployment Guide

This guide provides step-by-step instructions for deploying Pack Planet to a VPS using Docker, Docker Compose, and Nginx.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial VPS Setup](#initial-vps-setup)
3. [Install Required Software](#install-required-software)
4. [Deploy the Application](#deploy-the-application)
5. [Running Database Migrations](#running-database-migrations)
6. [Starting the Application](#starting-the-application)
7. [Updating the Application](#updating-the-application)
8. [Monitoring and Logs](#monitoring-and-logs)
9. [SSL/HTTPS Configuration](#sslhttps-configuration)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- A VPS with Ubuntu 20.04+ or Debian 11+ (minimum 2GB RAM, 20GB storage)
- Root or sudo access to the server
- A domain name pointed to your server's IP address (optional but recommended)
- Git installed on the server

---

## Initial VPS Setup

### 1. Connect to Your VPS

```bash
ssh root@your-server-ip
```

### 2. Update System Packages

```bash
apt update && apt upgrade -y
```

### 3. Create a Non-Root User (Recommended)

```bash
adduser packplanet
usermod -aG sudo packplanet
su - packplanet
```

---

## Install Required Software

### 1. Install Docker

```bash
# Remove old versions (if any)
sudo apt remove docker docker-engine docker.io containerd runc

# Install prerequisites
sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add current user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker compose version
```

### 2. Install Git (if not already installed)

```bash
sudo apt install -y git
```

---

## Deploy the Application

### 1. Clone the Repository

```bash
cd /home/packplanet
git clone https://github.com/your-username/packplanet.git
cd packplanet
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
nano .env
```

Update the following values in `.env`:

```env
# ============================================
# Database Configuration
# ============================================
DATABASE_URL="postgresql://postgres:YOUR_SECURE_PASSWORD@postgres:5432/packplanet?schema=public"

# PostgreSQL Configuration (for Docker Compose)
POSTGRES_DB=packplanet
POSTGRES_USER=postgres
POSTGRES_PASSWORD=YOUR_SECURE_PASSWORD

# ============================================
# Application Configuration
# ============================================
NEXT_PUBLIC_SITE_URL="https://your-domain.com"

NODE_ENV=production

NEXT_TELEMETRY_DISABLED=1

PORT=3000
```

**Important:**
- Replace `YOUR_SECURE_PASSWORD` with a strong, randomly generated password
- Replace `your-domain.com` with your actual domain name
- Make sure the password in `DATABASE_URL` matches `POSTGRES_PASSWORD`
- The database host in `DATABASE_URL` must be `postgres` (the Docker service name), not `localhost`

### 3. Set Proper Permissions

```bash
# Ensure .env file is not world-readable
chmod 600 .env

# Create uploads directory if it doesn't exist
mkdir -p public/uploads/products public/uploads/pricelists public/uploads/partners
```

---

## Running Database Migrations

Before starting the application, you need to set up the database schema.

### Option 1: Run Migrations from Host (Recommended)

If you have Node.js and pnpm installed on the host:

```bash
# Install dependencies
pnpm install

# Generate Prisma Client
pnpm prisma generate

# Run migrations
pnpm prisma migrate deploy
```

### Option 2: Run Migrations Inside Container

If you prefer to run migrations from within Docker:

```bash
# Start only the database
docker compose up -d postgres

# Wait for database to be ready (about 10-15 seconds)
sleep 15

# Run migrations using a temporary container
docker compose run --rm app sh -c "pnpm prisma migrate deploy"
```

### Create Admin User

After migrations, you need to create an admin user to access the admin panel. You can do this by:

1. Using Prisma Studio:
```bash
pnpm prisma studio
```

2. Or by running a seed script (if you have one):
```bash
pnpm prisma db seed
```

3. Or by creating a user directly through your application's sign-up flow.

---

## Starting the Application

### 1. Build and Start All Services

```bash
# Build and start all services (app, postgres, nginx)
docker compose up -d --build

# This command will:
# - Build the Next.js application
# - Start PostgreSQL database
# - Start the Next.js app
# - Start Nginx reverse proxy
```

### 2. Verify Services Are Running

```bash
# Check running containers
docker compose ps

# You should see three containers running:
# - packplanet-db (postgres)
# - packplanet-app (Next.js)
# - packplanet-nginx (nginx)
```

### 3. Check Application Health

```bash
# Check logs to ensure no errors
docker compose logs app

# Test the application
curl http://localhost
```

The application should now be accessible at:
- **HTTP:** `http://your-server-ip` or `http://your-domain.com`
- **Admin Panel:** `http://your-domain.com/admin`

---

## Updating the Application

When you need to deploy updates:

### 1. Pull Latest Changes

```bash
cd /home/packplanet/packplanet
git pull origin main
```

### 2. Rebuild and Restart

```bash
# Stop current containers
docker compose down

# Rebuild with new changes
docker compose up -d --build
```

### 3. Run New Migrations (if any)

```bash
# Check if there are new migrations
docker compose run --rm app sh -c "pnpm prisma migrate deploy"
```

### Quick Update Script

You can create a deployment script for easier updates:

```bash
cat > deploy.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Stop containers
echo "🛑 Stopping containers..."
docker compose down

# Rebuild and start
echo "🔨 Building and starting containers..."
docker compose up -d --build

# Run migrations
echo "🗄️  Running database migrations..."
docker compose run --rm app sh -c "pnpm prisma migrate deploy"

# Show status
echo "✅ Deployment complete!"
docker compose ps

echo "📋 Application logs:"
docker compose logs --tail=50 app
EOF

chmod +x deploy.sh
```

Then deploy updates with:
```bash
./deploy.sh
```

---

## Monitoring and Logs

### View Logs

```bash
# View all logs
docker compose logs

# View logs for specific service
docker compose logs app
docker compose logs postgres
docker compose logs nginx

# Follow logs in real-time
docker compose logs -f app

# View last 100 lines
docker compose logs --tail=100 app
```

### Check Container Status

```bash
# List running containers
docker compose ps

# View resource usage
docker stats
```

### Check Disk Space

```bash
# Check disk usage
df -h

# Check Docker disk usage
docker system df
```

### Clean Up Docker Resources

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes (⚠️ be careful with this)
docker volume prune

# Full cleanup (⚠️ be very careful)
docker system prune -a --volumes
```

---

## SSL/HTTPS Configuration

### Using Let's Encrypt (Recommended)

#### 1. Install Certbot

```bash
sudo apt install -y certbot
```

#### 2. Stop Nginx Temporarily

```bash
docker compose stop nginx
```

#### 3. Obtain SSL Certificate

```bash
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com
```

#### 4. Create SSL Directory

```bash
mkdir -p nginx/ssl
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem nginx/ssl/
sudo chown -R $USER:$USER nginx/ssl/
```

#### 5. Update nginx.conf

Uncomment the HTTPS server block in `nginx/nginx.conf` and update:
- Replace `your-domain.com` with your actual domain
- Uncomment the HTTP to HTTPS redirect

#### 6. Update docker-compose.yml

Add SSL volume mount to nginx service:

```yaml
nginx:
  volumes:
    - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    - uploads:/var/www/uploads:ro
    - ./nginx/ssl:/etc/nginx/ssl:ro  # Add this line
  ports:
    - "80:80"
    - "443:443"  # Uncomment this line
```

#### 7. Restart Nginx

```bash
docker compose up -d nginx
```

#### 8. Set Up Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Add cron job for auto-renewal
sudo crontab -e

# Add this line to renew certificates twice daily:
0 0,12 * * * certbot renew --quiet --deploy-hook "cd /home/packplanet/packplanet && cp /etc/letsencrypt/live/your-domain.com/*.pem nginx/ssl/ && docker compose restart nginx"
```

---

## Troubleshooting

### Application Won't Start

**Check logs:**
```bash
docker compose logs app
```

**Common issues:**
- Database not ready: Wait a few seconds and check `docker compose logs postgres`
- Environment variables missing: Verify `.env` file exists and has correct values
- Port conflicts: Ensure port 80 is not used by another service

### Database Connection Errors

**Verify DATABASE_URL format:**
```
postgresql://postgres:password@postgres:5432/packplanet?schema=public
```

**Important:**
- Host must be `postgres` (Docker service name), NOT `localhost`
- Password must match `POSTGRES_PASSWORD` in `.env`

**Test database connection:**
```bash
docker compose exec postgres psql -U postgres -d packplanet -c "SELECT 1;"
```

### Nginx 502 Bad Gateway

**Possible causes:**
- Next.js app not running: Check `docker compose ps`
- App container restarting: Check `docker compose logs app`
- Wrong upstream: Verify `app:3000` in nginx.conf

### Prisma Migration Issues

**Reset database (⚠️ destructive - only for development):**
```bash
docker compose run --rm app sh -c "pnpm prisma migrate reset --force"
```

**Check migration status:**
```bash
docker compose run --rm app sh -c "pnpm prisma migrate status"
```

### Out of Disk Space

```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a
docker volume ls -qf dangling=true | xargs docker volume rm

# Clean up logs
sudo truncate -s 0 /var/lib/docker/containers/*/*-json.log
```

### Container Keeps Restarting

```bash
# Check logs
docker compose logs --tail=100 app

# Check if it's a dependency issue
docker compose up postgres
# Wait for it to be healthy, then:
docker compose up app
```

### Permission Issues with Uploads

```bash
# Fix permissions
docker compose exec app chown -R nextjs:nodejs /app/public/uploads
```

### How to Access PostgreSQL Directly

```bash
# Connect to database
docker compose exec postgres psql -U postgres -d packplanet

# Or from your local machine (if you expose postgres port)
# Add to docker-compose.yml under postgres service:
#   ports:
#     - "5432:5432"
# Then: psql -h your-server-ip -U postgres -d packplanet
```

---

## Performance Optimization

### Enable Nginx Caching

Add to nginx.conf http block:

```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m use_temp_path=off;
```

### Limit Logs Size

Add to docker-compose.yml:

```yaml
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### Monitor Resource Usage

```bash
# Install htop
sudo apt install htop

# Monitor in real-time
htop

# Check Docker stats
docker stats
```

---

## Backup Strategy

### Database Backups

Create a backup script:

```bash
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/packplanet/backups"
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M%S)

docker compose exec -T postgres pg_dump -U postgres packplanet | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Keep only last 7 days of backups
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: db_backup_$DATE.sql.gz"
EOF

chmod +x backup.sh
```

Set up daily backups:
```bash
crontab -e
# Add: 0 2 * * * /home/packplanet/packplanet/backup.sh
```

### Uploads Backups

```bash
# Create uploads backup
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz public/uploads/
```

---

## Security Checklist

- [ ] Change default PostgreSQL password
- [ ] Set up SSL/HTTPS
- [ ] Keep .env file permissions restrictive (600)
- [ ] Regularly update system packages
- [ ] Set up firewall (ufw)
- [ ] Don't expose PostgreSQL port publicly
- [ ] Set up automated backups
- [ ] Monitor logs regularly
- [ ] Use strong admin passwords
- [ ] Keep Docker and images updated

---

## Useful Commands Reference

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# Restart services
docker compose restart

# View logs
docker compose logs -f app

# Execute command in container
docker compose exec app sh

# Rebuild specific service
docker compose up -d --build app

# Scale services (not applicable for this setup)
docker compose up -d --scale app=2

# Check service status
docker compose ps

# Remove all containers and volumes (⚠️ destructive)
docker compose down -v
```

---

## Support

For issues and questions:
- Check application logs: `docker compose logs app`
- Check nginx logs: `docker compose logs nginx`
- Review this guide's troubleshooting section
- Check Docker daemon logs: `sudo journalctl -u docker`

---

**Last Updated:** 2025-12-28
