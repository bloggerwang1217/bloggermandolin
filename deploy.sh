#!/bin/bash
echo "Building the site..."
yarn build

echo "Deploying the site..."
sudo cp -r build/* /var/www/bloggermandolin.com/
sudo systemctl reload nginx

echo "Deployment complete!"
