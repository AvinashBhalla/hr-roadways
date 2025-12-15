import React, { useState, useEffect } from 'react';
import { View, FlatList, Alert, Text, Switch } from 'react-native';
import BusCard from '../components/BusCard';
import mockData from '../data/mockData.json';
import * as Location from 'expo-location';

export default function BusListScreen({ navigation }) {
  const [buses, setBuses] = useState(mockData.buses);
  const [userLoc, setUserLoc] = useState(null);
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        setUserLoc(location.coords);
        checkMismatch(location.coords);
      }
    })();
  }, []);

  // Mismatch Alert Logic (User far from pickup)
  const checkMismatch = (coords) => {
    // Mock pickup loc (Karnal Stand)
    const pickup = { lat: 29.6857, lng: 76.9905 };
    const dist = getDist(coords.latitude, coords.longitude, pickup.lat, pickup.lng);
    
    // > 300m
    if (dist > 300) {
      Alert.alert(
        "Location Mismatch",
        "You are far from pickup point! Catch next bus?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Show Alternates", onPress: () => console.log("Fetch alternates...") }
        ]
      );
    }
  };

  const getDist = (lat1, lon1, lat2, lon2) => {
    // simplified distance check
    return Math.sqrt(Math.pow(lat2-lat1, 2) + Math.pow(lon2-lon1, 2)) * 111000;
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
     <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:10}}>
       <Text>Share Loc for Tracking?</Text>
       <Switch value={consent} onValueChange={setConsent} />
     </View>
      <FlatList
        data={buses}
        keyExtractor={item => item.bus_id}
        renderItem={({ item }) => (
          <BusCard 
            bus={item} 
            isDerived={item.is_derived_demo} // Flag to test UI
            onPress={() => navigation.navigate('Ticket', { bus: item })}
          />
        )}
      />
    </View>
  );
}
