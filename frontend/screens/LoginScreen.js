import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { Text, TextInput, Button, Surface, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../utils/AuthContext';
import Layout from '../components/Layout';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1A237E', '#311B92', '#000000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="bus-double-decker" size={80} color={theme.colors.secondary} />
            <Text variant="displaySmall" style={[styles.title, { color: theme.colors.onPrimary }]}>HR Roadways</Text>
            <Text variant="titleMedium" style={{ color: theme.colors.secondary }}>Premium Travel Experience</Text>
          </View>

          <Surface style={styles.card} elevation={0}>
            <Text variant="headlineSmall" style={[styles.cardTitle, { color: theme.colors.primary }]}>Welcome Back</Text>

            <TextInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              outlineColor="transparent"
              activeOutlineColor={theme.colors.primary}
              left={<TextInput.Icon icon="email-outline" color={theme.colors.primary} />}
              autoCapitalize="none"
              textColor="#333"
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              outlineColor="transparent"
              activeOutlineColor={theme.colors.primary}
              secureTextEntry
              left={<TextInput.Icon icon="lock-outline" color={theme.colors.primary} />}
              textColor="#333"
            />

            <Button
              mode="contained"
              onPress={() => signIn(email, password)}
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              Sign In
            </Button>

            <View style={styles.footer}>
              <Text variant="bodyMedium" style={{ color: '#666' }}>New Passenger? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </Surface>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  card: {
    padding: 30,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Glassmorphism simplified
    marginHorizontal: 10,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 25,
    fontWeight: '700',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#F5F7FA',
  },
  button: {
    marginTop: 20,
    borderRadius: 12,
    elevation: 4,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
});
