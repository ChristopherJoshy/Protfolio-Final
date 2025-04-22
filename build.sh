#!/bin/bash

echo "Installing dependencies..."
npm install --production=false

echo "Building client..."
npm run build:client

echo "Build completed successfully!"