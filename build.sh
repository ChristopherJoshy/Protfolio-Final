#!/bin/bash

npm install --production=false

echo "Building client..."
npm run build:client

echo "Building API..."
tsc --project tsconfig.json

echo "Build completed successfully!"