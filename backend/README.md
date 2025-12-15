# HR Roadways Backend

Node.js + Express backend for the bus booking system.

## Setup
1. `npm install`
2. `npm start` (Runs on port 3000)

## Features implemented
- **ECDSA Signed Tickets**: Uses `elliptic` curve P-256.
- **Derived Location**: Aggregates passenger GPS when tracker fails.
- **Offline Sync**: Endpoint `/api/bulk-sync` to accept queued requests.

## API
See `openapi.yaml` for full spec.
