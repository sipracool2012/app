#!/bin/bash
set -e

echo "🚀 Starting Clear eVisa deployment..."

# Restart backend (FastAPI systemd service)
echo "🔄 Restarting backend..."
sudo systemctl restart clearevisa.service
sudo systemctl status clearevisa.service --no-pager

# Build frontend (React)
echo "🛠️ Building frontend..."
cd frontend
npm install --legacy-peer-deps
npm run build

# Copy build to Nginx web root
echo "📂 Deploying frontend build..."
sudo cp -r build/* /var/www/clearevisa/

# Reload Nginx
echo "🌐 Reloading Nginx..."
sudo nginx -t
sudo systemctl reload nginx

echo "✅ Deployment complete!"