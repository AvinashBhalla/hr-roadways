import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from './supabase';
import { Alert } from 'react-native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchRole(session.user.id);
      else setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchRole(session.user.id);
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching role:', error);
      }

      setRole(data?.role || 'user');
    } catch (e) {
      console.error(e);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    console.log('Attempting login for:', email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Login Error:', error);
      Alert.alert('Login Failed', error.message || 'Check your internet connection');
    } else {
      console.log('Login Success:', data);
    }
    setLoading(false);
  };

  const signUp = async (email, password) => {
    setLoading(true);
    console.log('Attempting signup for:', email);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error('Signup Error:', error);
      Alert.alert('Registration Failed', error.message);
    } else {
      console.log('Signup Success:', data);
      Alert.alert('Success', 'Account created! Please check your email for verification.');
    }
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
