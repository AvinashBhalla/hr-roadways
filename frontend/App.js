import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider, useAuth } from './utils/AuthContext';
import { theme } from './utils/theme';

import HomeScreen from './screens/HomeScreen';
import BusListScreen from './screens/BusListScreen';
import TicketScreen from './screens/TicketScreen';
import DriverVerifyScreen from './screens/DriverVerifyScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import SuperAdminDashboard from './screens/SuperAdminDashboard';
import SeatSelectionScreen from './screens/SeatSelectionScreen';
import PaymentScreen from './screens/PaymentScreen';
import ComplaintScreen from './screens/ComplaintScreen';

import 'intl-pluralrules';
import './assets/locales/i18n';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { user, role, loading } = useAuth();

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // AUTH STACK
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          // APP STACK
          <>
            {role === 'superadmin' ? (
              <Stack.Screen name="SuperAdmin" component={SuperAdminDashboard} />
            ) : (
              <Stack.Screen name="Home" component={HomeScreen} />
            )}

            {/* Common Routes */}
            <Stack.Screen name="BusList" component={BusListScreen} />
            <Stack.Screen name="SeatSelection" component={SeatSelectionScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="Ticket" component={TicketScreen} />
            <Stack.Screen name="DriverVerify" component={DriverVerifyScreen} />
            <Stack.Screen name="Complaint" component={ComplaintScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </PaperProvider>
  );
}
