import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  TICKET: 'hr_ticket',
  SCAN_QUEUE: 'hr_scan_queue',
  CONSENT: 'hr_loc_consent'
};

// --- PASSENGER ---

export const saveTicketOffline = async (ticket) => {
  try {
    const data = { ...ticket, offline_cached: true, cached_at: new Date().toISOString() };
    await AsyncStorage.setItem(KEYS.TICKET, JSON.stringify(data));
  } catch (e) { console.error('Save ticket failed', e); }
};

export const getOfflineTicket = async () => {
  try {
    const json = await AsyncStorage.getItem(KEYS.TICKET);
    return json ? JSON.parse(json) : null;
  } catch (e) { return null; }
};

// --- DRIVER ---

export const queueScan = async (ticketData) => {
  try {
    const existing = await getScanQueue();
    const newQueue = [...existing, { data: ticketData, scanned_at: new Date().toISOString() }];
    await AsyncStorage.setItem(KEYS.SCAN_QUEUE, JSON.stringify(newQueue));
  } catch (e) { console.error('Queue scan failed', e); }
};

export const getScanQueue = async () => {
  try {
    const json = await AsyncStorage.getItem(KEYS.SCAN_QUEUE);
    return json ? JSON.parse(json) : [];
  } catch (e) { return []; }
};

export const clearScanQueue = async () => {
  await AsyncStorage.removeItem(KEYS.SCAN_QUEUE);
};
