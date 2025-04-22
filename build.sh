#!/bin/bash

# Build the client
npm install
npm run build:client
npm run build:server
mkdir -p dist/client
cp -r dist/* dist/client/
mv dist/client/index.js dist/
mv dist/client/server dist/
NODE_ENV=production

# Build the API routes
npx esbuild api/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/api

echo "Build completed successfully!"