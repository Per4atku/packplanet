# Deployment Guide for Low-Memory VPS (1GB RAM)

This guide is specifically for deploying Pack Planet on VPS servers with limited resources (1GB RAM, 15GB disk).

## Problem

Building Next.js applications inside Docker containers requires significant memory (2-4GB). On a 1GB VPS, the build process will fail or take extremely long.

## Solutions

Choose one of the following approaches based on your preference:

---

## Solution 1: Build Locally, Deploy Pre-built Image ⭐ (Recommended)

Build the Docker image on your local machine (which has more resources), push it to Docker Hub, then pull it on your VPS.

### Step 1: Set Up Docker Hub Account

1. Create account at https://hub.docker.com
2. Create a repository named `packplanet`

### Step 2: Build and Push from Local Machine

```bash
# Login to Docker Hub
docker login

# Edit build-and-push.sh and set your username
nano build-and-push.sh
# Change: DOCKER_USERNAME="your-actual-username"

# Build and push
./build-and-push.sh
```

### Step 3: Deploy on VPS

```bash
# SSH into VPS
ssh user@your-vps-ip

# Clone repository (if not done already)
git clone https://github.com/your-username/packplanet.git
cd packplanet

# Create .env file
cp .env.example .env
nano .env  # Update with your secure values

# Add to .env:
echo 'DOCKER_IMAGE=your-dockerhub-username/packplanet:latest' >> .env

# Pull and run
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d

# Run migrations
docker compose -f docker-compose.prod.yml run --rm app sh -c "pnpm prisma migrate deploy"
```

### Updating the Application

**On your local machine:**
```bash
git pull
./build-and-push.sh
```

**On VPS:**
```bash
cd packplanet
git pull  # Update nginx config, etc.
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

---

## Solution 2: Add Swap Space to VPS

Add virtual memory to supplement RAM. This allows building on the VPS but will be slower.

```bash
# SSH into VPS
ssh user@your-vps-ip

# Check current swap
free -h

# Create 2GB swap file
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verify
free -h
# You should see 2GB swap

# Adjust swappiness (how aggressively system uses swap)
sudo sysctl vm.swappiness=10
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
```

Now build on VPS:
```bash
cd packplanet

# This will be slow but should work with swap
docker compose up -d --build

# Run migrations
docker compose run --rm app sh -c "pnpm prisma migrate deploy"
```

**Note:** First build will take 15-30 minutes with swap. Subsequent builds will be faster due to layer caching.

---

## Solution 3: Build on Host, Run in Docker (Lightweight)

Install Node.js on VPS, build the app directly on the host, then use a lightweight Docker container to run it.

### Prerequisites on VPS

```bash
# SSH into VPS
ssh user@your-vps-ip

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
curl -fsSL https://get.pnpm.io/install.sh | sh -
source ~/.bashrc
```

### Deploy Application

```bash
# Clone repository
git clone https://github.com/your-username/packplanet.git
cd packplanet

# Create .env file
cp .env.example .env
nano .env  # Update with your values

# Build on host (not in Docker)
./build-on-host.sh

# Now use lightweight runtime container
docker compose -f docker-compose.runtime.yml up -d --build

# Run migrations
docker compose -f docker-compose.runtime.yml run --rm app sh -c "pnpm prisma migrate deploy"
```

### Updating the Application

```bash
cd packplanet
git pull
./build-on-host.sh
docker compose -f docker-compose.runtime.yml up -d --build
```

**Advantages:**
- Fast builds (happens on host with native Node.js)
- Low memory usage during build
- Still gets Docker benefits for runtime isolation

**Disadvantages:**
- Requires Node.js/pnpm installed on VPS
- Less isolated than full Docker build

---

## Comparison Table

| Solution | Speed | Memory Usage | Complexity | Recommended For |
|----------|-------|--------------|------------|-----------------|
| **1. Pre-built Image** | Fast | Low | Medium | Most users |
| **2. Swap Space** | Slow | Medium | Low | Simple setup, infrequent updates |
| **3. Build on Host** | Fast | Low | Medium | Developers comfortable with Node.js |

---

## Resource Optimization Tips

### Reduce Docker Image Size

After building, check image size:
```bash
docker images | grep packplanet
```

### Clean Up Unused Resources

```bash
# Remove old images
docker image prune -a

# Remove unused volumes (be careful!)
docker volume prune

# Check disk usage
docker system df
```

### Monitor Memory Usage

```bash
# Install htop
sudo apt install htop

# Monitor resources
htop

# Check Docker stats
docker stats
```

### Limit Container Memory (Optional)

Add to docker-compose.yml under app service:
```yaml
app:
  deploy:
    resources:
      limits:
        memory: 512M
      reservations:
        memory: 256M
```

---

## Troubleshooting Low-Memory Issues

### Build Fails with "Killed" or "Exit Code 137"

This means out of memory. Solutions:
1. Add swap space (Solution 2)
2. Use pre-built image (Solution 1)
3. Build on host (Solution 3)

### Application Crashes After Starting

Check memory:
```bash
docker stats
free -h
```

If app uses too much memory:
- Add swap space
- Reduce Next.js memory: `NODE_OPTIONS=--max-old-space-size=512 node server.js`

### Disk Space Issues

```bash
# Check disk usage
df -h

# Clean Docker
docker system prune -a
docker volume prune

# Remove old logs
sudo truncate -s 0 /var/lib/docker/containers/*/*-json.log
```

---

## Recommended Approach for 1GB VPS

**Best practice:** Use **Solution 1 (Pre-built Image)**

1. Build locally or on CI/CD
2. Push to Docker Hub
3. Pull on VPS
4. Add 1-2GB swap as safety net

This gives you:
- ✅ Fast deployments
- ✅ Low memory usage on VPS
- ✅ Reliable builds
- ✅ Easy updates

---

**Need help?** Check the main DEPLOYMENT.md for additional troubleshooting and configuration options.
