const mongoose = require('mongoose');

// --- Schemas ---

const BusSchema = new mongoose.Schema({
  bus_id: { type: String, required: true, unique: true },
  route_id: String,
  departure_time: String,
  current_lat: Number,
  current_lng: Number,
  speed_kmph: Number,
  status: { type: String, enum: ['ON_ROUTE', 'DELAYED', 'OFFLINE'] },
  seats_available: Number,
  total_seats: Number,
  last_availability_ts: Date,
  // Derived location support
  derived_location: {
    lat: Number,
    lng: Number,
    confidence: Number,
    source: { type: String, enum: ['tracker', 'passenger_aggregate'] },
    samples_count: Number,
    derived_at: Date
  }
});

const TicketSchema = new mongoose.Schema({
  ticket_id: { type: String, required: true, unique: true },
  user_id: String,
  bus_id: String,
  pickup_id: String,
  drop_id: String,
  date: String, // YYYY-MM-DD
  valid_from: Date,
  valid_until: Date,
  payment_status: { type: String, enum: ['PAID', 'PENDING', 'FAILED'] },
  fare: Number,
  signature: String, // ECDSA signature
  is_offline_generated: { type: Boolean, default: false },
  synced_at: Date
});

const GPSAlertSchema = new mongoose.Schema({
  bus_id: String,
  timestamp: { type: Date, default: Date.now },
  type: { type: String, enum: ['TRACKER_MISMATCH', 'TRACKER_SILENT'] },
  severity: String,
  details: Object
});

// For derived location log
const DerivedLocationLogSchema = new mongoose.Schema({
  bus_id: String,
  timestamp: Date,
  reported_lat: Number,
  reported_lng: Number,
  user_id: String,
  is_outlier: Boolean
});

module.exports = {
  Bus: mongoose.model('Bus', BusSchema),
  Ticket: mongoose.model('Ticket', TicketSchema),
  GPSAlert: mongoose.model('GPSAlert', GPSAlertSchema),
  DerivedLocationLog: mongoose.model('DerivedLocationLog', DerivedLocationLogSchema)
};
