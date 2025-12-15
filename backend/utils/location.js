/**
 * Derived Location Logic (Tracker Failure Fallback)
 */

// In-memory buffer for recent passenger pings: { bus_id: [ { lat, lng, userId, ts } ] }
const passengerLocationBuffer = {}; 

const CONFIDENCE_THRESHOLD = 0.6;
const DEVIATION_THRESHOLD_METERS = 500;
const SAMPLE_WINDOW_SEC = 90;

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371e3; 
  const p1 = lat1 * Math.PI/180;
  const p2 = lat2 * Math.PI/180;
  const dP = p2 - p1;
  const dL = (lon2 - lon1) * Math.PI/180;
  const a = Math.sin(dP/2) * Math.sin(dP/2) +
            Math.cos(p1) * Math.cos(p2) *
            Math.sin(dL/2) * Math.sin(dL/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // in meters
}

/**
 * Ingest a passenger location ping.
 * Only call this for onboard users who consented.
 */
function ingestPassengerLocation(busId, userId, lat, lng) {
  if (!passengerLocationBuffer[busId]) {
    passengerLocationBuffer[busId] = [];
  }
  const now = Date.now();
  passengerLocationBuffer[busId].push({ lat, lng, userId, ts: now });
  
  // Prune old
  passengerLocationBuffer[busId] = passengerLocationBuffer[busId].filter(
    p => (now - p.ts) < (SAMPLE_WINDOW_SEC * 1000)
  );
}

/**
 * Calculate derived location for a bus.
 * Rules:
 * - Window T=90s
 * - Filter outliers
 * - Compute median
 * - Check confidence
 */
function computeDerivedLocation(busId) {
  const samples = passengerLocationBuffer[busId] || [];
  if (samples.length < 3) return null; // Need min samples

  // 1. Simple outlier filtering (z-score like or just median distance)
  // For simplicity: Calculate centroid, remove points far from centroid, re-calculate
  
  let sumLat = 0, sumLng = 0;
  samples.forEach(s => { sumLat += s.lat; sumLng += s.lng; });
  const avgLat = sumLat / samples.length;
  const avgLng = sumLng / samples.length;

  const validSamples = samples.filter(s => {
    const dist = haversine(avgLat, avgLng, s.lat, s.lng);
    return dist < 1000; // Filter > 1km outliers from raw centroid
  });

  if (validSamples.length === 0) return null;

  // 2. Compute Median of valid samples
  validSamples.sort((a,b) => a.lat - b.lat);
  const medianLat = validSamples[Math.floor(validSamples.length/2)].lat;
  
  validSamples.sort((a,b) => a.lng - b.lng);
  const medianLng = validSamples[Math.floor(validSamples.length/2)].lng;

  // 3. Confidence Score
  // More samples = higher confidence, capped at 1.0 (e.g. 10 samples = 1.0)
  const confidence = Math.min(validSamples.length / 10, 0.95);

  return {
    lat: medianLat,
    lng: medianLng,
    confidence,
    source: 'passenger_aggregate',
    samples_count: validSamples.length,
    derived_at: new Date()
  };
}

module.exports = { ingestPassengerLocation, computeDerivedLocation, haversine };
