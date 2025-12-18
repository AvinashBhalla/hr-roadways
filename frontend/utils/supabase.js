import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const SUPABASE_URL = 'https://whylaifzcijbbcskqdnl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoeWxhaWZ6Y2lqYmJjc2txZG5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNzYwNTYsImV4cCI6MjA4MTY1MjA1Nn0.ZNSoQjVVH4jI_0inADv4A5xgYso665ZuM-zY0Fkdo_s';

const clientOptions = {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
};

// Use AsyncStorage only on native platforms (iOS/Android)
if (Platform.OS !== 'web') {
    clientOptions.auth.storage = AsyncStorage;
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, clientOptions);
