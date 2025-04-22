#!/bin/bash

npm install --production=false

echo "Building client..."
cd client
npm run build:client
cd ..

echo "Building API..."
npm run build:api

echo "Build completed successfully!"