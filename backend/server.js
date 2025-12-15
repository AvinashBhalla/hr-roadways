const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Bus, Ticket, GPSAlert } = require('./models/schema');
const { signTicket, verifyTicket, publicKey } = require('./utils/crypto');
const { ingestPassengerLocation, computeDerivedLocation, haversine } = require('./utils/location');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- MOCK DATA STORE (In memory since DB connection might not be configured) ---
const BUSES = {
  'BUS_42': {
    bus_id: 'BUS_42',
    route_id: 'KRL-CHD-01',
    departure_time: '07:00',
    current_lat: 29.6857, // Karnal approx
    current_lng: 76.9905,
    speed_kmph: 45,
    status: 'ON_ROUTE',
    seats_available: 12,
    last_availability_ts: new Date(),
    derived_location: null
  }
};
const TICKETS = {};

// --- API ROUTES ---

/**
 * GET /api/buses
 * Search for buses.
 */
app.get('/api/buses', (req, res) => {
  const { from, to } = req.query;
  // Mock logic: return all buses
  const list = Object.values(BUSES);
  res.json(list);
});

/**
 * GET /api/buses/:id
 * Get single bus details (live location).
 */
app.get('/api/buses/:id', (req, res) => {
  const bus = BUSES[req.params.id];
  if (!bus) return res.status(404).json({ error: 'Bus not found' });
  
  // Example: Check if tracker works. If not, use derived.
  // This is a simulation switch.
  const usingDerived = bus.status === 'TRACKER_FAIL'; // Sim condition
  if (usingDerived && bus.derived_location) {
    res.json({ ...bus, current_lat: bus.derived_location.lat, current_lng: bus.derived_location.lng, _location_source: 'DERIVED' });
  } else {
    res.json(bus);
  }
});

/**
 * POST /api/book
 * Create a booking and generate signed ticket.
 */
app.post('/api/book', (req, res) => {
  const { user_id, bus_id, pickup_id, drop_id, date, fare, payment_status } = req.body;
  
  const ticket_id = 'HRB-' + Date.now();
  const bus = BUSES[bus_id];

  if (bus && bus.seats_available > 0) {
    bus.seats_available--; // Atomic decr in real DB
  } else {
    return res.status(400).json({ error: 'No seats' });
  }

  const ticketData = {
    ticket_id, user_id, bus_id, pickup_id, drop_id, date,
    valid_from: new Date(), 
    valid_until: new Date(Date.now() + 86400000),
    payment_status: payment_status || 'PAID',
    fare
  };

  // Sign
  const signature = signTicket(ticketData);
  const finalTicket = { ...ticketData, signature };
  
  TICKETS[ticket_id] = finalTicket;
  
  res.json(finalTicket);
});

/**
 * POST /api/verify
 * Verify a ticket (used by Driver App).
 */
app.post('/api/verify', (req, res) => {
  const { ticketData, signature } = req.body;
  const isValid = verifyTicket(ticketData, signature);
  res.json({ valid: isValid, timestamp: new Date() });
});

/**
 * POST /api/bulk-sync
 * Sync offline bookings or driver scans.
 */
app.post('/api/bulk-sync', (req, res) => {
  const { bookings, scans } = req.body;
  // Process offline bookings (provisionals)
  if (bookings) {
    bookings.forEach(b => {
      // Validate and save if not exists
      console.log('Syncing booking:', b.ticket_id);
    });
  }
  res.json({ status: 'synced', received: (bookings?.length || 0) + (scans?.length || 0) });
});

/**
 * GET /api/alternates
 * Find alternate buses if user is far or missed bus.
 */
app.get('/api/alternates', (req, res) => {
  const { from_id, min_seats } = req.query;
  // Mock logic: return any bus with enough seats
  const alternates = Object.values(BUSES).filter(b => b.seats_available >= (min_seats || 1));
  res.json(alternates);
});

/**
 * POST /api/gps-callback
 * Receive derived location data from passenger apps.
 */
app.post('/api/gps-callback', (req, res) => {
  const { bus_id, user_id, lat, lng } = req.body;
  // Ingest
  ingestPassengerLocation(bus_id, user_id, lat, lng);
  
  // Re-compute derived
  const derived = computeDerivedLocation(bus_id);
  if (derived && BUSES[bus_id]) {
    BUSES[bus_id].derived_location = derived;
    
    // Check fallback trigger logic (simulated)
    // If real tracker hasn't updated in X mins, allow derived to take over in UI responses
  }
  
  res.json({ ok: true });
});

/**
 * GET /public-key
 * Get Public Key for local verification if needed.
 */
app.get('/public-key', (req, res) => {
  res.json({ publicKey });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`HR Roadways Backend running on port ${PORT}`);
});
