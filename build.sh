#!/bin/bash

# Build the client
npm install
npm run build
mkdir -p dist
cp -r public/* dist/
cp -r server dist/
NODE_ENV=production

# Build the API routes
npx esbuild api/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/api

echo "Build completed successfully!"