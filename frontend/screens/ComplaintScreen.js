import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, useTheme } from 'react-native-paper';
import Layout from '../components/Layout';
import { supabase } from '../utils/supabase';
import { useAuth } from '../utils/AuthContext';

export default function ComplaintScreen({ navigation }) {
    const { user } = useAuth();
    const [type, setType] = useState('DELAY');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const theme = useTheme();

    const handleSubmit = async () => {
        if (!description) {
            Alert.alert('Error', 'Please describe your issue.');
            return;
        }
        setLoading(true);
        const { error } = await supabase
            .from('complaints')
            .insert([{
                user_id: user.id,
                type,
                description,
                status: 'OPEN'
            }]);

        setLoading(false);
        if (error) {
            Alert.alert('Error', error.message);
        } else {
            Alert.alert('Submitted', 'Your complaint ID has been registered. We will look into it.', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        }
    };

    return (
        <Layout>
            <View style={styles.header}>
                <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: theme.colors.error }}>Report an Issue</Text>
            </View>

            <Text variant="titleMedium" style={styles.label}>Complaint Type</Text>
            <SegmentedButtons
                value={type}
                onValueChange={setType}
                buttons={[
                    { value: 'DELAY', label: 'Delay' },
                    { value: 'STAFF', label: 'Staff' },
                    { value: 'OTHER', label: 'Other' },
                ]}
                style={styles.segment}
            />

            <TextInput
                label="Describe your issue"
                value={description}
                onChangeText={setDescription}
                mode="outlined"
                multiline
                numberOfLines={6}
                style={styles.input}
            />

            <Button mode="contained" onPress={handleSubmit} loading={loading} style={styles.submit} buttonColor={theme.colors.error}>
                Submit Complaint
            </Button>

        </Layout>
    );
}

const styles = StyleSheet.create({
    header: {
        marginBottom: 20,
        marginTop: 10,
    },
    label: {
        marginBottom: 10,
        fontWeight: '600',
    },
    segment: {
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    submit: {
        marginTop: 10,
    },
});
