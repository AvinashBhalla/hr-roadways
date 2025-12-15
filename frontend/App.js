import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import BusListScreen from './screens/BusListScreen';
import TicketScreen from './screens/TicketScreen';
import DriverVerifyScreen from './screens/DriverVerifyScreen';
import 'intl-pluralrules';
import './assets/locales/i18n'; // Init i18n
import { View, Text } from 'react-native';

// Simplified i18n init for skeleton if import fails
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './assets/locales/en.json';
import hi from './assets/locales/hi.json';

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    resources: { en: { translation: en }, hi: { translation: hi } },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="BusList" component={BusListScreen} />
        <Stack.Screen name="Ticket" component={TicketScreen} />
        <Stack.Screen name="DriverVerify" component={DriverVerifyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
