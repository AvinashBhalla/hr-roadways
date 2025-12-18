import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, FAB, Dialog, Portal, TextInput, DataTable, Surface, SegmentedButtons, useTheme, Card, Avatar } from 'react-native-paper';
import { supabase } from '../utils/supabase';
import Layout from '../components/Layout';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('users'); // users, buses, drivers, stops
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  // Dialog State
  const [visible, setVisible] = useState(false);
  const [dialogData, setDialogData] = useState({});

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    let query;
    if (activeTab === 'users') query = supabase.from('profiles').select('*');
    if (activeTab === 'buses') query = supabase.from('buses').select('*, routes(*)'); // Join details
    if (activeTab === 'driver_details') query = supabase.from('driver_details').select('*');
    if (activeTab === 'bus_stops') query = supabase.from('bus_stops').select('*');

    const { data, error } = await query;
    if (error) console.error(error);
    else setItems(data || []);
    setLoading(false);
  };

  const showDialog = (item = {}) => setVisible(true);
  const hideDialog = () => setVisible(false);

  // Render Functions
  const renderContent = () => {
    return (
      <Card style={styles.card} mode="elevated">
        <ScrollView horizontal>
          <DataTable style={{ minWidth: 350 }}>
            <DataTable.Header>
              {activeTab === 'users' && <DataTable.Title>Email</DataTable.Title>}
              {activeTab === 'users' && <DataTable.Title>Role</DataTable.Title>}

              {activeTab === 'buses' && <DataTable.Title>Bus No.</DataTable.Title>}
              {activeTab === 'buses' && <DataTable.Title>Status</DataTable.Title>}

              {activeTab === 'bus_stops' && <DataTable.Title>Name</DataTable.Title>}
              {activeTab === 'bus_stops' && <DataTable.Title>City</DataTable.Title>}

              <DataTable.Title numeric>Actions</DataTable.Title>
            </DataTable.Header>

            {items.map((item) => (
              <DataTable.Row key={item.id || item.user_id}>
                {activeTab === 'users' && <DataTable.Cell>{item.email}</DataTable.Cell>}
                {activeTab === 'users' && <DataTable.Cell>{item.role}</DataTable.Cell>}

                {activeTab === 'buses' && <DataTable.Cell>{item.bus_number}</DataTable.Cell>}
                {activeTab === 'buses' && <DataTable.Cell>{item.status}</DataTable.Cell>}

                {activeTab === 'bus_stops' && <DataTable.Cell>{item.name}</DataTable.Cell>}
                {activeTab === 'bus_stops' && <DataTable.Cell>{item.city}</DataTable.Cell>}

                <DataTable.Cell numeric>
                  <MaterialCommunityIcons name="dots-horizontal" size={20} color="#666" />
                </DataTable.Cell>
              </DataTable.Row>
            ))}

            {/* Empty State */}
            {items.length === 0 && !loading && (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text>No records found.</Text>
              </View>
            )}

          </DataTable>
        </ScrollView>
      </Card>
    );
  };

  return (
    <Layout>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>Admin Console</Text>
      </View>

      <SegmentedButtons
        value={activeTab}
        onValueChange={setActiveTab}
        buttons={[
          { value: 'users', label: 'Users', icon: 'account-group' },
          { value: 'buses', label: 'Buses', icon: 'bus' },
          { value: 'bus_stops', label: 'Stops', icon: 'map-marker' },
        ]}
        style={styles.tabs}
        density="small"
      />

      <ScrollView contentContainerStyle={styles.content}>
        {renderContent()}
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.tertiary }]}
        color="#fff"
        onPress={() => showDialog()}
      />

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog} style={{ backgroundColor: '#fff' }}>
          <Dialog.Title>Add New {activeTab}</Dialog.Title>
          <Dialog.Content>
            <TextInput label="Name/ID" mode="outlined" style={{ backgroundColor: '#fff' }} />
            <TextInput label="Details" mode="outlined" style={{ marginTop: 10, backgroundColor: '#fff' }} />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={hideDialog} mode="contained">Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Layout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
    marginTop: 10,
  },
  tabs: {
    marginBottom: 20,
  },
  content: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 20,
  },
});
