#!/bin/bash

echo "Starting EC2 Setup for Code-Caramel Deployment..."

# 1. Create 2GB Swap File to prevent Out-Of-Memory (OOM) crashes on 1GB RAM instances
echo "Configuring 2GB Swap File..."
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make the swap file permanent across reboots
if ! grep -q '/swapfile' /etc/fstab; then
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo "Swap file added to /etc/fstab"
else
    echo "Swap file already exists in /etc/fstab"
fi

# Verify swap
swapon --show
free -h

echo ""
echo "======================================"
echo "EC2 Setup Complete!"
echo "You can now run: docker-compose up -d"
echo "======================================"
