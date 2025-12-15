import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

// In real app, import { RNCamera } from 'react-native-camera';

export default function DriverVerifyScreen() {
  const [scanned, setScanned] = React.useState(false);
  
  const handleBarCodeRead = (e) => {
    // e.data is ticket JSON
    // 1. Verify Signature Locally (using pub key if available)
    // 2. Or Queue for Sync
    setScanned(true);
    alert(`Scanned: ${e.data.substring(0, 20)}...`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Fast Scan</Text>
      <View style={styles.cameraBox}>
        <Text>Camera View Mock</Text>
        <Text>(Tap below to sim scan)</Text>
      </View>
      
      <Button 
        title="Simulate Scan Valid Ticket" 
        onPress={() => handleBarCodeRead({ data: '{"ticket_id":"123", "signature":"abc"}' })} 
      />
      
      <View style={{marginTop:20}}>
         <Text>Mode: OFFLINE QUEUE</Text>
         <Button title="Sync Queued (5)" onPress={() => console.log('Syncing...')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 20, marginBottom: 20 },
  cameraBox: { width: 300, height: 300, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }
});
