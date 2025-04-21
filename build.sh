#!/bin/bash

# Build the client
npm run build

# Build the API routes
npx esbuild api/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/api

echo "Build completed successfully!"