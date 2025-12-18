import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Surface, Button, ActivityIndicator, useTheme } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import Layout from '../components/Layout';
import { supabase } from '../utils/supabase';
import { useAuth } from '../utils/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TicketScreen({ route, navigation }) {
  // Can be passed via params (new booking) or fetch from DB
  const { ticket: paramTicket } = route.params || {};
  const { user } = useAuth();
  const [ticket, setTicket] = useState(paramTicket || null);
  const [loading, setLoading] = useState(!paramTicket);

  const theme = useTheme();

  useEffect(() => {
    if (!ticket) {
      fetchLastTicket();
    }
  }, []);

  const fetchLastTicket = async () => {
    // Fetch most recent valid ticket for user
    const { data, error } = await supabase
      .from('tickets')
      .select('*, buses(*, routes(*))')
      .eq('user_id', user.id)
      .eq('status', 'VALID')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) console.log(error);
    setTicket(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <Layout>
        <ActivityIndicator style={{ marginTop: 50 }} />
      </Layout>
    );
  }

  if (!ticket) {
    return (
      <Layout>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="ticket-outline" size={80} color="#ddd" />
          <Text variant="titleMedium" style={{ marginTop: 20, color: '#999' }}>No active tickets found.</Text>
          <Button mode="contained" onPress={() => navigation.navigate('BusList')} style={{ marginTop: 20 }}>
            Book a Request
          </Button>
        </View>
      </Layout>
    );
  }

  const bus = ticket.buses || {};
  const routeName = bus.routes?.name || 'Unknown Route';

  return (
    <Layout>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: theme.colors.primary }}>Your Ticket</Text>
      </View>

      <Card style={styles.ticketCard} mode="elevated">
        <View style={styles.ticketTop}>
          <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.primary }}>{routeName}</Text>
          <Text variant="labelLarge" style={{ color: '#666' }}>Bus: {bus.bus_number}</Text>
        </View>

        <View style={styles.dashedLine} />

        <View style={styles.ticketRow}>
          <View>
            <Text variant="labelMedium" style={{ color: '#999' }}>DATE</Text>
            <Text variant="titleMedium">{new Date(ticket.created_at).toLocaleDateString()}</Text>
          </View>
          <View>
            <Text variant="labelMedium" style={{ color: '#999', textAlign: 'right' }}>SEAT</Text>
            <Text variant="titleLarge" style={{ fontWeight: 'bold', textAlign: 'right', color: theme.colors.tertiary }}>{ticket.seat_number}</Text>
          </View>
        </View>

        <View style={styles.qrContainer}>
          <QRCode value={ticket.qr_code_data || ticket.ticket_id} size={150} />
          <Text variant="labelSmall" style={{ marginTop: 10, color: '#666' }}>Scan to Verify</Text>
          <Text variant="labelSmall" style={{ color: '#666' }}>{ticket.ticket_id}</Text>
        </View>

        <View style={styles.statusBadge}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>{ticket.status}</Text>
        </View>
      </Card>

      <Button mode="outlined" style={{ marginTop: 20, borderColor: theme.colors.primary }} onPress={() => navigation.navigate('Home')}>
        Back to Home
      </Button>

    </Layout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
  },
  ticketTop: {
    alignItems: 'center',
    marginBottom: 15,
  },
  dashedLine: {
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'dashed',
    borderRadius: 1,
    marginVertical: 15,
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  qrContainer: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
  },
  statusBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 10,
  }
});
