import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, Card, Button, Avatar, useTheme, IconButton } from 'react-native-paper';
import Layout from '../components/Layout';
import { useAuth } from '../utils/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const theme = useTheme();

  const ActionCard = ({ title, icon, onPress, color }) => (
    <TouchableOpacity onPress={onPress} style={[styles.actionCard, { backgroundColor: theme.colors.surface }]}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <MaterialCommunityIcons name={icon} size={32} color={color} />
      </View>
      <Text variant="titleMedium" style={styles.actionTitle}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <Layout>
      <View style={styles.header}>
        <View>
          <Text variant="titleMedium" style={{ color: '#666' }}>Welcome Back,</Text>
          <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>Passenger</Text>
        </View>
        <TouchableOpacity onPress={signOut}>
          <Avatar.Icon size={40} icon="logout" style={{ backgroundColor: theme.colors.surfaceVariant }} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>

        {/* Banner */}
        <Card style={styles.bannerCard} mode="contained">
          <Card.Content>
            <Text variant="titleLarge" style={{ color: '#fff', fontWeight: 'bold' }}>Plan Your Journey</Text>
            <Text variant="bodyMedium" style={{ color: '#E0E0E0', marginTop: 5 }}>Safe, Comfortable, and On Time.</Text>
            <Button mode="contained" buttonColor="#fff" textColor={theme.colors.primary} style={styles.bannerButton} onPress={() => navigation.navigate('BusList')}>
              Book Now
            </Button>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Text variant="titleLarge" style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.grid}>
          <ActionCard title="Book Bus" icon="bus" color={theme.colors.primary} onPress={() => navigation.navigate('BusList')} />
          <ActionCard title="My Tickets" icon="ticket-confirmation" color={theme.colors.tertiary} onPress={() => navigation.navigate('Ticket')} />
          <ActionCard title="Track Bus" icon="map-marker-radius" color={theme.colors.secondary} onPress={() => { }} />
          <ActionCard title="Support" icon="headset" color="#4CAF50" onPress={() => navigation.navigate('Complaint')} />
        </View>

        {/* Recent Activity or Promos */}
        <Text variant="titleLarge" style={styles.sectionTitle}>Offers For You</Text>
        <Card style={styles.offerCard}>
          <Card.Cover source={{ uri: 'https://picsum.photos/700' }} style={{ height: 150 }} />
          <Card.Content style={{ paddingVertical: 10 }}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Get 20% Off on First Ride</Text>
            <Text variant="bodySmall">Use Code: HRROADWAYS20</Text>
          </Card.Content>
        </Card>

      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  bannerCard: {
    backgroundColor: '#1A237E', // Deep Blue
    borderRadius: 20,
    marginBottom: 25,
  },
  bannerButton: {
    marginTop: 15,
    alignSelf: 'flex-start',
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 15,
    color: '#333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionCard: {
    width: '48%',
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
  },
  actionTitle: {
    fontWeight: '600',
  },
  offerCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
  },
});
