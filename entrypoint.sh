#!/bin/sh

# Change to the correct directory
cd /app;

# Start hardhat node as a background process
npm run 'Start Node' &

# Wait for hardhat node to initialize and then deploy contracts
npx wait-on http://127.0.0.1:8545 && npm run 'Deploy Contracts'

# The hardhat node process never completes
# Waiting prevents the container from pausing
wait $!