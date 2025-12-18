const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const supabase = require('./utils/supabaseClient');
const { signTicket, verifyTicket, publicKey } = require('./utils/crypto');
// const { ingestPassengerLocation, computeDerivedLocation } = require('./utils/location'); // Temporarily commenting out location utils if they need DB integration, or keep as is.

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- MIDDLEWARE: Auth & RBAC ---

/**
 * Middleware to verify Supabase JWT token and attach user to request.
 */
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid token' });

  // Fetch role from public.profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  req.user = user;
  req.userRole = profile?.role || 'user'; // Default to user
  next();
};

/**
 * Middleware to restrict access to specific roles.
 * @param {string[]} roles - Array of allowed roles (e.g., ['admin', 'driver'])
 */
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
    }
    next();
  };
};

// --- ROUTES ---

// 1. PUBLIC ROUTES

app.get('/api/buses', async (req, res) => {
  const { from, to } = req.query;
  // TODO: Add filtering logic based on route/stations
  // Join with routes to get route name
  const { data, error } = await supabase
    .from('buses')
    .select('*, routes(*)') 
    .eq('status', 'ON_ROUTE'); 
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 2. PROTECTED ROUTES (Authenticated Users)

app.post('/api/book', authMiddleware, async (req, res) => {
  const { bus_id, seat_number } = req.body;
  const user_id = req.user.id;

  // Check availability (Mock logic replaced with real specific logic would be better, but keeping simple)
  // Check if seat is free?
  
  // Create ticket
  const ticketId = 'HRB-' + Date.now();
  const ticketData = {
    user_id,
    bus_id,
    seat_number,
    status: 'VALID',
    ticket_id: ticketId 
  };

  const { data, error } = await supabase
    .from('tickets')
    .insert([ticketData])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  // Sign ticket for verification
  // We need to shape the data for signature exactly as verified
  const signature = signTicket({ ...ticketData, ticket_id: data.id, valid_from: new Date().toISOString() }); // Simplified signature data

  res.json({ ticket: data, signature });
});

app.get('/api/my-tickets', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('tickets')
    .select('*, buses(*, routes(*))')
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 3. DRIVER ROUTES

app.post('/api/verify', authMiddleware, checkRole(['driver', 'superadmin']), (req, res) => {
  const { ticketData, signature } = req.body;
  // Local verification using crypto utils
  const isValid = verifyTicket(ticketData, signature);
  res.json({ valid: isValid, timestamp: new Date() });
});

// 4. SUPERADMIN ROUTES

app.get('/api/admin/users', authMiddleware, checkRole(['superadmin']), async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put('/api/admin/users/:id/role', authMiddleware, checkRole(['superadmin']), async (req, res) => {
  const { role } = req.body;
  const { id } = req.params;

  if (!['user', 'driver', 'superadmin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/admin/buses', authMiddleware, checkRole(['superadmin']), async (req, res) => {
  const { bus_number, route_id } = req.body;
  const { data, error } = await supabase
    .from('buses')
    .insert([{ bus_number, route_id }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`HR Roadways Backend running on port ${PORT}`);
});
