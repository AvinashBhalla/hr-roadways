import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function BusCard({ bus, onPress, isDerived }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.busId}>{bus.bus_id}</Text>
        <Text style={styles.route}>{bus.route_id}</Text>
      </View>
      <View style={styles.row}>
        <Text>Dep: {bus.departure_time}</Text>
        <Text style={{color: bus.seats_available > 0 ? 'green' : 'red'}}>
          Seats: {bus.seats_available}
        </Text>
      </View>
      {isDerived && (
        <View style={styles.derivedBadge}>
          <Text style={styles.derivedText}>⚠️ Live loc derived from passengers</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { padding: 15, backgroundColor: '#fff', marginBottom: 10, borderRadius: 8, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  busId: { fontWeight: 'bold', fontSize: 16 },
  derivedBadge: { marginTop: 5, backgroundColor: '#fff3cd', padding: 4, borderRadius: 4 },
  derivedText: { fontSize: 12, color: '#856404' }
});
