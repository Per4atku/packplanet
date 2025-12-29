# Disk Cleanup Guide

This guide provides commands to clean up disk space on your development machine.

## Table of Contents

- [Docker Cleanup](#docker-cleanup)
- [Node.js / pnpm Cleanup](#nodejs--pnpm-cleanup)
- [Next.js Build Cleanup](#nextjs-build-cleanup)
- [Git Cleanup](#git-cleanup)
- [macOS System Cleanup](#macos-system-cleanup)
- [Complete Cleanup Script](#complete-cleanup-script)

---

## Docker Cleanup

### Remove Stopped Containers
```bash
docker container prune
```

### Remove Unused Images
```bash
# Remove dangling images (untagged)
docker image prune

# Remove all unused images (not just dangling)
docker image prune -a
```

### Remove Unused Volumes
```bash
docker volume prune
```

### Remove Unused Networks
```bash
docker network prune
```

### Remove Build Cache
```bash
docker builder prune
```

### Complete Docker Cleanup (All Unused Resources)
```bash
# Remove all unused containers, networks, images, and build cache
docker system prune -a --volumes

# Add -f flag to skip confirmation
docker system prune -a --volumes -f
```

### Check Docker Disk Usage
```bash
docker system df
```

---

## Node.js / pnpm Cleanup

### Clean pnpm Store (Global Cache)
```bash
# Remove unreferenced packages from the store
pnpm store prune

# Verify store integrity
pnpm store status
```

### Remove node_modules
```bash
# Remove node_modules from current project
rm -rf node_modules

# Reinstall dependencies
pnpm install
```

### Clear pnpm Cache
```bash
# Get cache directory location
pnpm store path

# Clear all cached packages
pnpm store prune
```

---

## Next.js Build Cleanup

### Remove Next.js Build Artifacts
```bash
# Remove .next directory
rm -rf .next

# Remove standalone build output
rm -rf .next/standalone

# Rebuild
pnpm build
```

### Remove Next.js Cache
```bash
# Remove Next.js cache
rm -rf .next/cache
```

### Remove TypeScript Build Info
```bash
rm -rf .tsbuildinfo
```

---

## Git Cleanup

### Remove Untracked Files
```bash
# Show what would be deleted (dry run)
git clean -n

# Remove untracked files
git clean -f

# Remove untracked files and directories
git clean -fd

# Remove untracked and ignored files
git clean -fdx
```

### Garbage Collection and Optimization
```bash
# Run git garbage collection
git gc

# Aggressive garbage collection (slower but more thorough)
git gc --aggressive --prune=now
```

### Remove Local Branches Already Merged
```bash
# List merged branches
git branch --merged

# Delete merged branches (excluding main/master)
git branch --merged | grep -v "\*\|main\|master" | xargs -n 1 git branch -d
```

---

## macOS System Cleanup

### Clear Homebrew Cache
```bash
# Clean up old versions of installed packages
brew cleanup

# Remove all cached downloads
brew cleanup -s

# See what would be cleaned up
brew cleanup -n
```

### Clear System Cache
```bash
# Clear user cache (be careful!)
rm -rf ~/Library/Caches/*

# Clear system logs
sudo rm -rf /private/var/log/*
```

### Clear Trash
```bash
# Empty trash from command line
rm -rf ~/.Trash/*
```

### Check Disk Usage
```bash
# Check overall disk usage
df -h

# Check size of current directory and subdirectories
du -sh *

# Check size of directory tree
du -h -d 1 | sort -h

# Find large files (over 100MB)
find . -type f -size +100M -exec ls -lh {} \;
```

---

## Prisma Cleanup

### Remove Generated Prisma Client
```bash
rm -rf src/generated/prisma
```

### Regenerate Prisma Client
```bash
pnpm prisma generate
```

---

## VPS Cleanup Script

### Setup on VPS

1. **Upload the script to your VPS:**
```bash
# From your local machine
scp vps-cleanup.sh user@your-vps-ip:/home/user/
```

2. **Make it executable:**
```bash
ssh user@your-vps-ip
chmod +x vps-cleanup.sh
```

3. **Run the script:**
```bash
# Dry run first to see what will be cleaned
./vps-cleanup.sh --dry-run

# Normal cleanup
./vps-cleanup.sh

# Aggressive cleanup (removes stopped containers and unused images)
sudo ./vps-cleanup.sh --aggressive
```

### Features

- ✅ Safe for production environments
- ✅ Docker cleanup (images, volumes, networks, build cache)
- ✅ System logs cleanup (journalctl, rotated logs)
- ✅ Package manager cache (apt/yum/dnf)
- ✅ Temporary files cleanup
- ✅ Shows disk usage before/after
- ✅ Calculates freed space
- ✅ Dry run mode available
- ✅ Aggressive mode for deeper cleanup

### Automated Cleanup with Cron

Schedule weekly cleanup:

```bash
# Edit crontab
crontab -e

# Add this line to run every Sunday at 2 AM
0 2 * * 0 /home/user/vps-cleanup.sh >> /var/log/cleanup.log 2>&1
```

Schedule daily lightweight cleanup:

```bash
# Add this line to run every day at 3 AM
0 3 * * * /home/user/vps-cleanup.sh >> /var/log/cleanup.log 2>&1
```

Monthly aggressive cleanup:

```bash
# First day of each month at 2 AM
0 2 1 * * /home/user/vps-cleanup.sh --aggressive >> /var/log/cleanup.log 2>&1
```

View cleanup logs:

```bash
tail -f /var/log/cleanup.log
```

---

## Complete Cleanup Script

### For This Project (Local Development)
Create a file called `cleanup.sh`:

```bash
#!/bin/bash

echo "🧹 Starting cleanup process..."

# Docker cleanup
echo "🐳 Cleaning Docker..."
docker system prune -a --volumes -f

# pnpm cleanup
echo "📦 Cleaning pnpm store..."
pnpm store prune

# Next.js cleanup
echo "⚡ Cleaning Next.js build artifacts..."
rm -rf .next
rm -rf .next/cache
rm -rf .tsbuildinfo

# Prisma cleanup
echo "🔄 Cleaning Prisma generated files..."
rm -rf src/generated/prisma

# Git cleanup
echo "🗑️  Cleaning Git..."
git gc --aggressive --prune=now

# Check remaining disk usage
echo "💾 Disk usage:"
df -h

echo "✅ Cleanup complete!"
```

Make it executable:
```bash
chmod +x cleanup.sh
```

Run it:
```bash
./cleanup.sh
```

### Quick One-Liner Cleanup
```bash
# Clean everything in one command
docker system prune -a --volumes -f && \
pnpm store prune && \
rm -rf .next node_modules src/generated/prisma && \
git gc --aggressive --prune=now && \
echo "✅ Cleanup complete!"
```

---

## Tips

1. **Before cleaning**: Always commit or stash your changes
2. **Be careful with**: `rm -rf` commands - double check the path
3. **Regular maintenance**: Run cleanup weekly or when disk space is low
4. **Monitor disk usage**: Use `df -h` to check available space
5. **Docker**: Docker typically uses the most disk space in development
6. **node_modules**: Can be safely deleted and reinstalled anytime
7. **.next**: Can be safely deleted and rebuilt with `pnpm build`

---

## Emergency Cleanup (When Disk is Almost Full)

Run these in order:

```bash
# 1. Docker (usually the biggest culprit)
docker system prune -a --volumes -f

# 2. pnpm store
pnpm store prune

# 3. Next.js builds
rm -rf .next

# 4. node_modules (if needed - requires reinstall)
rm -rf node_modules

# 5. System caches
brew cleanup -s

# 6. Empty trash
rm -rf ~/.Trash/*
```

After cleanup, reinstall dependencies if needed:
```bash
pnpm install
pnpm prisma generate
pnpm build
```
