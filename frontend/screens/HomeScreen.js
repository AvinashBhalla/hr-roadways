import React from 'react';
import { View, Text, Button, StyleSheet, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function HomeScreen({ navigation }) {
  const { t, i18n } = useTranslation();

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('welcome')}</Text>
        <Button title={i18n.language.toUpperCase()} onPress={toggleLang} />
      </View>

      <Text style={styles.label}>{t('search_dest')}</Text>
      {/* Mock Search Input */}
      <View style={styles.searchBox}>
        <Text style={{color:'#888'}}>Karnal -> Chandigarh</Text>
      </View>

      <Button 
        title={t('find_buses')} 
        onPress={() => navigation.navigate('BusList', { from: 'Karnal', to: 'Chandigarh' })} 
      />
      
      <View style={{marginTop: 20}}>
         <Button title="Driver Mode" color="orange" onPress={() => navigation.navigate('DriverVerify')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  label: { marginBottom: 10 },
  searchBox: { padding: 15, backgroundColor: '#fff', marginBottom: 20, borderRadius: 5 }
});
