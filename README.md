# Haryana Roadways Bus Booking System

Full stack implementation of HR Roadways booking system.

## Folder Structure
- `backend/`: Node.js Express API + Redis Mock + ECDSA components.
- `frontend/`: React Native Expo App (Passenger + Driver flows).
- `mcp-server/`: Model Context Protocol server exposing tools.

## Quick Start

### 1. Backend
```bash
cd backend
npm install
npm start
```
Runs on `http://localhost:3000`.

### 2. Frontend
```bash
cd frontend
npm install
npx expo start
```
Scan QR with Expo Go app or run in simulator.

### 3. MCP Server
```bash
cd mcp-server
node server.js
```

## Features Demo
1. **Offline Mode**: Turn on airplane mode in simulator. Frontend uses `AsyncStorage`.
2. **Wake Up Alert**: Go to "Ticket" screen -> "Test Wake Up Alert".
3. **Driver Scan**: Go to Home -> "Driver Mode".
4. **Derived Location**: In backend `server.js`, mocked bus `BUS_42` can accept `api/gps-callback`.