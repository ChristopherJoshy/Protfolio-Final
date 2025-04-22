#!/bin/bash

echo "Installing dependencies..."
npm install --production=false

echo "Installing Tailwind CSS plugins..."
npm install tailwindcss-animate @tailwindcss/typography --no-save

echo "Checking installed packages..."
npm list tailwindcss-animate @tailwindcss/typography

echo "Building client..."
npm run build:client

echo "Build completed successfully!"