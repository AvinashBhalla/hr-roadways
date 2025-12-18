require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initDb() {
  try {
    await client.connect();
    console.log('Connected to Supabase Postgres');

    // --- CLEANUP ---
    await client.query('DROP TABLE IF EXISTS public.gps_alerts CASCADE');
    await client.query('DROP TABLE IF EXISTS public.scan_audits CASCADE');
    await client.query('DROP TABLE IF EXISTS public.complaints CASCADE');
    await client.query('DROP TABLE IF EXISTS public.payments CASCADE');
    await client.query('DROP TABLE IF EXISTS public.tickets CASCADE');
    await client.query('DROP TABLE IF EXISTS public.driver_details CASCADE');
    await client.query('DROP TABLE IF EXISTS public.buses CASCADE');
    await client.query('DROP TABLE IF EXISTS public.route_stops CASCADE');
    await client.query('DROP TABLE IF EXISTS public.routes CASCADE');
    await client.query('DROP TABLE IF EXISTS public.bus_stops CASCADE');
    await client.query('DROP TABLE IF EXISTS public.profiles CASCADE');
    console.log('Cleaned up old tables');

    // --- 1. PROFILES (Users) ---
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
        email TEXT,
        role TEXT DEFAULT 'user' CHECK (role IN ('user', 'driver', 'superadmin')),
        phone TEXT, -- NEW: PRD 1.2
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
    `);

    // Enable RLS for profiles
    await client.query(`ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;`);
    await client.query(`
      DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
      CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
    `);

    // --- 2. BUS STOPS ---
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.bus_stops (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        city TEXT,
        lat DOUBLE PRECISION NOT NULL,
        lng DOUBLE PRECISION NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_bus_stops_city ON public.bus_stops(city);
    `);

    // --- 3. ROUTES ---
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.routes (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        origin_id UUID REFERENCES public.bus_stops(id),
        destination_id UUID REFERENCES public.bus_stops(id),
        distance_km DOUBLE PRECISION,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // --- 4. ROUTE STOPS ---
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.route_stops (
        route_id UUID REFERENCES public.routes(id) ON DELETE CASCADE,
        stop_id UUID REFERENCES public.bus_stops(id) ON DELETE CASCADE,
        stop_order INTEGER NOT NULL,
        PRIMARY KEY (route_id, stop_id)
      );
      CREATE INDEX IF NOT EXISTS idx_route_stops_route_id ON public.route_stops(route_id);
    `);

    // --- 5. BUSES ---
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.buses (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        bus_number TEXT UNIQUE NOT NULL,
        route_id UUID REFERENCES public.routes(id),
        status TEXT DEFAULT 'IDLE' CHECK (status IN ('IDLE', 'ON_ROUTE', 'MAINTENANCE', 'DELAYED')),
        seats_available INTEGER DEFAULT 40,
        total_seats INTEGER DEFAULT 40,
        seat_layout JSONB DEFAULT '{"rows": 10, "cols": 4, "aisle": 2}', -- NEW: Seat Config
        current_lat DOUBLE PRECISION,
        current_lng DOUBLE PRECISION,
        last_updated TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_buses_route_id ON public.buses(route_id);
      CREATE INDEX IF NOT EXISTS idx_buses_status ON public.buses(status);
    `);

    // --- 6. DRIVER DETAILS ---
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.driver_details (
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
        name TEXT,
        license_number TEXT UNIQUE,
        contact_number TEXT,
        assigned_bus_id UUID REFERENCES public.buses(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_driver_details_bus_id ON public.driver_details(assigned_bus_id);
    `);

    // --- 7. TICKETS ---
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.tickets (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        ticket_id TEXT UNIQUE NOT NULL,
        user_id UUID REFERENCES auth.users(id),
        bus_id UUID REFERENCES public.buses(id),
        seat_number INTEGER,
        fare DECIMAL(10, 2),
        status TEXT DEFAULT 'VALID' CHECK (status IN ('VALID', 'USED', 'CANCELLED', 'EXPIRED')),
        valid_from TIMESTAMPTZ,
        valid_until TIMESTAMPTZ,
        qr_code_data TEXT, -- NEW
        payment_id UUID, -- NEW
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON public.tickets(user_id);
      CREATE INDEX IF NOT EXISTS idx_tickets_bus_id ON public.tickets(bus_id);
      CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
    `);

    // --- 8. PAYMENTS (NEW) ---
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.payments (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id),
        amount DECIMAL(10, 2),
        method TEXT CHECK (method IN ('UPI', 'CARD', 'CASH', 'NETBANKING')),
        status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
        transaction_id TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // --- 9. COMPLAINTS (NEW) ---
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.complaints (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id),
        type TEXT,
        description TEXT,
        media_url TEXT,
        status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'RESOLVED', 'CLOSED')),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // --- 10. SCAN AUDITS (NEW) ---
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.scan_audits (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        ticket_id UUID REFERENCES public.tickets(id),
        driver_id UUID REFERENCES auth.users(id),
        scan_result TEXT,
        scan_location_lat DOUBLE PRECISION,
        scan_location_lng DOUBLE PRECISION,
        scanned_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // --- 11. GPS ALERTS (NEW) ---
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.gps_alerts (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        bus_id UUID REFERENCES public.buses(id),
        alert_type TEXT,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // --- TRIGGERS ---
    await client.query(`
      CREATE OR REPLACE FUNCTION public.handle_new_user() 
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO public.profiles (id, email, role)
        VALUES (new.id, new.email, 'user')
        ON CONFLICT (id) DO NOTHING;
        RETURN new;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
    `);

    // --- SEED DATA ---
    console.log('Seeding data...');

    // Stops
    const stopsRes = await client.query(`
      INSERT INTO public.bus_stops (name, city, lat, lng) VALUES
      ('ISBT Delhi', 'Delhi', 28.6692, 77.2295),
      ('Karnal Bus Stand', 'Karnal', 29.6857, 76.9905),
      ('Ambala Cantt', 'Ambala', 30.3340, 76.7797),
      ('ISBT Chandigarh', 'Chandigarh', 30.7333, 76.7794)
      RETURNING *;
    `);
    const valStops = stopsRes.rows;

    // Route: Delhi -> Chandigarh
    const routeRes = await client.query(`
      INSERT INTO public.routes (name, origin_id, destination_id, distance_km) VALUES
      ('Delhi - Chandigarh Express', '${valStops[0].id}', '${valStops[3].id}', 250)
      RETURNING *;
    `);
    const routeId = routeRes.rows[0].id;

    // Route Stops
    await client.query(`
      INSERT INTO public.route_stops (route_id, stop_id, stop_order) VALUES
      ('${routeId}', '${valStops[0].id}', 1),
      ('${routeId}', '${valStops[1].id}', 2),
      ('${routeId}', '${valStops[2].id}', 3),
      ('${routeId}', '${valStops[3].id}', 4);
    `);

    // Bus
    await client.query(`
      INSERT INTO public.buses (bus_number, route_id, status, seats_available, total_seats, seat_layout, current_lat, current_lng) VALUES
      ('HR-68-1234', '${routeId}', 'ON_ROUTE', 40, 50, '{"rows": 10, "cols": 4, "gap": 2}', 28.7041, 77.1025);
    `);

    console.log('Database schema initialization completed with PRD v1.2 tables.');

  } catch (err) {
    console.error('Error initializing DB:', err);
  } finally {
    await client.end();
  }
}

initDb();
