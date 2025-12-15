import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { saveTicketOffline } from '../utils/storage';
import { scheduleWakeUpAlert } from '../utils/notifications';

export default function TicketScreen({ route }) {
  const { bus } = route.params || {};
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    // Simulator booking
    const newTicket = {
      ticket_id: "HRB-" + Date.now(),
      bus_id: bus?.bus_id || "DEMO",
      valid_from: new Date().toISOString(),
      signature: "MOCK_SIG_ECDSA_BASE64"
    };
    setTicket(newTicket);
    saveTicketOffline(newTicket);
  }, []);

  const handleWakeUpTest = () => {
    scheduleWakeUpAlert("Ambala Cantt", "Amit");
  };

  if (!ticket) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Ticket</Text>
      <View style={styles.qrContainer}>
        <QRCode value={JSON.stringify(ticket)} size={200} />
      </View>
      <Text>ID: {ticket.ticket_id}</Text>
      <Text>Bus: {ticket.bus_id}</Text>
      <Text style={{color:'green', fontWeight:'bold'}}>PAID - {ticket.signature.substring(0,10)}...</Text>
      
      <View style={{marginTop: 30}}>
        <Button title="Test Wake Up Alert" onPress={handleWakeUpTest} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  qrContainer: { marginBottom: 20, padding: 10, backgroundColor: 'white' }
});
