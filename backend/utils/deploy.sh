#!/bin/bash
set -e

echo "🚀 Starting Clear eVisa deployment..."

# === Backend restart ===
echo "🔄 Restarting backend service..."
sudo systemctl restart clearevisa.service
sudo systemctl status clearevisa.service --no-pager

# === Frontend build ===
echo "🛠️ Building frontend..."
cd "$(dirname "$0")/frontend"
npm install --legacy-peer-deps
npm run build

# === Deploy frontend build to Nginx ===
echo "📂 Deploying frontend build..."
sudo rm -rf /var/www/html/*
sudo cp -r build/* /var/www/clearevisa/

# === Reload Nginx ===
echo "🌐 Reloading Nginx..."
sudo nginx -t
sudo systemctl reload nginx

echo "✅ Deployment complete!"