#!/bin/bash

################################################################################
# VPS Cleanup Script
# Safe cleanup script for production VPS environments
# Usage: ./vps-cleanup.sh [--dry-run] [--aggressive]
################################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Parse arguments
DRY_RUN=false
AGGRESSIVE=false

for arg in "$@"; do
  case $arg in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --aggressive)
      AGGRESSIVE=true
      shift
      ;;
    --help)
      echo "Usage: $0 [--dry-run] [--aggressive]"
      echo "  --dry-run     Show what would be cleaned without actually cleaning"
      echo "  --aggressive  More thorough cleanup (includes stopped containers)"
      exit 0
      ;;
  esac
done

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}VPS Cleanup Script${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

if [ "$DRY_RUN" = true ]; then
  echo -e "${YELLOW}DRY RUN MODE - No changes will be made${NC}"
  echo ""
fi

# Function to print section headers
print_section() {
  echo -e "\n${YELLOW}>>> $1${NC}"
}

# Function to execute or print command
run_cmd() {
  if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}[DRY RUN]${NC} $1"
  else
    echo -e "${GREEN}[RUNNING]${NC} $1"
    eval "$1"
  fi
}

# Show initial disk usage
print_section "Initial Disk Usage"
df -h / | grep -v Filesystem

# Record initial available space
INITIAL_AVAILABLE=$(df / | awk 'NR==2 {print $4}')

################################################################################
# 1. DOCKER CLEANUP
################################################################################

if command -v docker &> /dev/null; then
  print_section "Docker Cleanup"

  # Show Docker disk usage
  echo "Current Docker disk usage:"
  docker system df
  echo ""

  # Remove dangling images
  echo "Removing dangling images..."
  run_cmd "docker image prune -f"

  # Remove unused build cache
  echo "Removing build cache..."
  run_cmd "docker builder prune -f"

  # Remove unused volumes
  echo "Removing unused volumes..."
  run_cmd "docker volume prune -f"

  # Remove unused networks
  echo "Removing unused networks..."
  run_cmd "docker network prune -f"

  if [ "$AGGRESSIVE" = true ]; then
    echo -e "${YELLOW}Aggressive mode: Removing stopped containers and unused images${NC}"
    run_cmd "docker container prune -f"
    run_cmd "docker image prune -a -f"
  fi

  echo "Docker cleanup complete"
else
  echo "Docker not installed, skipping Docker cleanup"
fi

################################################################################
# 2. SYSTEM LOGS CLEANUP
################################################################################

print_section "System Logs Cleanup"

# Clean journal logs older than 7 days
if command -v journalctl &> /dev/null; then
  echo "Cleaning journalctl logs older than 7 days..."
  run_cmd "sudo journalctl --vacuum-time=7d"
fi

# Clean old log files
if [ -d "/var/log" ]; then
  echo "Removing old rotated log files..."
  run_cmd "sudo find /var/log -type f -name '*.gz' -mtime +7 -delete"
  run_cmd "sudo find /var/log -type f -name '*.old' -mtime +7 -delete"
  run_cmd "sudo find /var/log -type f -name '*.1' -mtime +7 -delete"
fi

################################################################################
# 3. PACKAGE MANAGER CACHE CLEANUP
################################################################################

print_section "Package Manager Cache Cleanup"

# APT cleanup (Debian/Ubuntu)
if command -v apt-get &> /dev/null; then
  echo "Cleaning apt cache..."
  run_cmd "sudo apt-get clean"
  run_cmd "sudo apt-get autoclean"
  run_cmd "sudo apt-get autoremove -y"
fi

# YUM/DNF cleanup (RHEL/CentOS/Fedora)
if command -v yum &> /dev/null; then
  echo "Cleaning yum cache..."
  run_cmd "sudo yum clean all"
fi

if command -v dnf &> /dev/null; then
  echo "Cleaning dnf cache..."
  run_cmd "sudo dnf clean all"
fi

################################################################################
# 4. TEMPORARY FILES CLEANUP
################################################################################

print_section "Temporary Files Cleanup"

# Clean /tmp (files older than 7 days)
echo "Cleaning old temporary files..."
run_cmd "sudo find /tmp -type f -atime +7 -delete"
run_cmd "sudo find /tmp -type d -empty -delete"

# Clean /var/tmp (files older than 30 days)
run_cmd "sudo find /var/tmp -type f -atime +30 -delete"
run_cmd "sudo find /var/tmp -type d -empty -delete"

################################################################################
# 5. NODE/NPM CLEANUP (if applicable)
################################################################################

if command -v npm &> /dev/null; then
  print_section "Node/NPM Cleanup"
  echo "Cleaning npm cache..."
  run_cmd "npm cache clean --force"
fi

if command -v pnpm &> /dev/null; then
  print_section "PNPM Cleanup"
  echo "Cleaning pnpm store..."
  run_cmd "pnpm store prune"
fi

################################################################################
# 6. OLD KERNELS CLEANUP (Ubuntu/Debian)
################################################################################

if command -v apt-get &> /dev/null && [ "$AGGRESSIVE" = true ]; then
  print_section "Old Kernels Cleanup"
  CURRENT_KERNEL=$(uname -r)
  echo "Current kernel: $CURRENT_KERNEL"
  echo "Removing old kernels (keeping current)..."
  run_cmd "sudo apt-get autoremove --purge -y"
fi

################################################################################
# 7. FIND LARGEST FILES AND DIRECTORIES
################################################################################

print_section "Largest Files and Directories"

echo "Top 10 largest files in home directory:"
if [ "$DRY_RUN" = true ] || [ -d "$HOME" ]; then
  find "$HOME" -type f -exec du -h {} + 2>/dev/null | sort -rh | head -n 10 || true
fi

echo ""
echo "Top 10 largest directories in /var:"
if [ -d "/var" ]; then
  sudo du -h /var --max-depth=2 2>/dev/null | sort -rh | head -n 10 || true
fi

################################################################################
# 8. SUMMARY
################################################################################

print_section "Cleanup Summary"

# Show final disk usage
echo "Final Disk Usage:"
df -h / | grep -v Filesystem

# Calculate freed space
FINAL_AVAILABLE=$(df / | awk 'NR==2 {print $4}')
FREED=$((FINAL_AVAILABLE - INITIAL_AVAILABLE))

if [ $FREED -gt 0 ]; then
  # Convert to MB or GB
  if [ $FREED -gt 1048576 ]; then
    FREED_GB=$((FREED / 1048576))
    echo -e "${GREEN}✅ Freed approximately ${FREED_GB}GB of disk space${NC}"
  else
    FREED_MB=$((FREED / 1024))
    echo -e "${GREEN}✅ Freed approximately ${FREED_MB}MB of disk space${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  No significant space was freed${NC}"
fi

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Cleanup Complete!${NC}"
echo -e "${GREEN}================================${NC}"

# Show recommendations if disk is still low
AVAILABLE_PERCENT=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$AVAILABLE_PERCENT" -gt 85 ]; then
  echo -e "${RED}⚠️  WARNING: Disk usage is still above 85%${NC}"
  echo "Consider:"
  echo "  1. Running with --aggressive flag"
  echo "  2. Reviewing and removing old Docker images"
  echo "  3. Checking application logs for growth"
  echo "  4. Reviewing database sizes"
fi
