#!/bin/bash

npm install

echo "Building client..."
npm run build:client

echo "Building API..."
tsc --project tsconfig.json

echo "Build completed successfully!"