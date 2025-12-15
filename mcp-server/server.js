const http = require('http');

// Helper to call Backend
async function callBackend(path, method, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api' + path,
      method: method,
      headers: { 'Content-Type': 'application/json' }
    };
    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// Tool Handlers
const handlers = {
  find_buses: async (args) => {
    return await callBackend(`/buses?from=${args.from}&to=${args.to}`, 'GET');
  },
  book_ticket: async (args) => {
    // defaults for demo
    const payload = { ...args, fare: 100, date: '2025-11-07' }; 
    return await callBackend('/book', 'POST', payload);
  },
  get_ticket_status: async (args) => {
    // This endpoint wasn't explicitly scaffolded in backend server.js (mocking response here)
    return { status: "VALID", ticket_id: args.ticket_id };
  },
  verify_ticket: async (args) => {
    // The args usually come as object strings in some MCP impls, need ensuring json
    let ticketData;
    try { ticketData = JSON.parse(args.ticket_data); } catch(e) { ticketData = args.ticket_data; }
    
    return await callBackend('/verify', 'POST', { ticketData, signature: args.signature });
  }
};

// Simple stdio MCP loop (Pseudo-implementation for scaffold)
// In a real MCP SDK usage, this would reuse the MCPServer class.
const fs = require('fs');

console.error("HR Roadways MCP Server running...");

// Mock loop for reading stdin lines (JSON-RPC)
process.stdin.on('data', async (data) => {
  const msg = data.toString().trim();
  // Parse JSON-RPC request... (omitted for brevity in scaffold, assumed 1:1 map)
  console.error("Received:", msg);
});

// Export handlers for testing
module.exports = handlers;
