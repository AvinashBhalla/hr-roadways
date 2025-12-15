const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function runTests() {
  console.log("--- STARTING HR ROADWAYS SYSTEM TEST ---");

  try {
    // 1. Find Buses
    console.log("\n1. Searching for buses (Karnal -> Chandigarh)...");
    const buses = await axios.get(`${BASE_URL}/buses?from=Karnal&to=Chandigarh`);
    console.log(`PASS: Found ${buses.data.length} buses.`);
    if (buses.data.length === 0) throw new Error("No buses found");
    
    const bus = buses.data[0];
    console.log(`   Selected Bus: ${bus.bus_id} (${bus.seats_available} seats left)`);

    // 2. Book Ticket
    console.log("\n2. Booking a ticket...");
    const bookPayload = {
      user_id: "test_user_01",
      bus_id: bus.bus_id,
      pickup_id: "P_1",
      drop_id: "P_2",
      date: "2025-11-07",
      fare: 150
    };
    const ticketRes = await axios.post(`${BASE_URL}/book`, bookPayload);
    const ticket = ticketRes.data;
    
    if (!ticket.signature) throw new Error("Ticket missing signature");
    console.log(`PASS: Ticket Booked! ID: ${ticket.ticket_id}`);
    console.log(`   Signature: ${ticket.signature.substring(0, 20)}...`);

    // 3. Verify Ticket (Driver App Flow)
    console.log("\n3. Verifying ticket signature...");
    // We send back the exact data + signature
    const verifyPayload = {
      ticketData: { 
        ticket_id: ticket.ticket_id,
        user_id: ticket.user_id,
        bus_id: ticket.bus_id,
        pickup_id: ticket.pickup_id,
        drop_id: ticket.drop_id,
        date: ticket.date
      },
      signature: ticket.signature
    };
    
    const verifyRes = await axios.post(`${BASE_URL}/verify`, verifyPayload);
    if (verifyRes.data.valid) {
      console.log(`PASS: Signature Verified!`);
    } else {
      console.error("FAIL: Signature Rejected!");
    }

    // 4. Test Derived Location Logic
    console.log("\n4. Testing Derived Location (GPS Callback)...");
    const gpsPayload = {
      bus_id: bus.bus_id,
      user_id: "test_user_02",
      lat: 29.6860, // Nearby the bus
      lng: 76.9910
    };
    await axios.post(`${BASE_URL}/gps-callback`, gpsPayload);
    console.log("PASS: GPS Callback accepted.");

    // Check if bus state updated (optional, may rely on buffering)
    const busCheck = await axios.get(`${BASE_URL}/buses/${bus.bus_id}`);
    if (busCheck.data) {
        console.log("PASS: Bus status reachable.");
    }

  } catch (error) {
    console.error("TEST FAILED:", error.message);
    if(error.response) console.error("Response:", error.response.data);
  }
}

runTests();
