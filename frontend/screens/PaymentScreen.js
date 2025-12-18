import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Text, Button, Surface, RadioButton, useTheme, Card } from 'react-native-paper';
import Layout from '../components/Layout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../utils/supabase';
import { useAuth } from '../utils/AuthContext';

export default function PaymentScreen({ route, navigation }) {
    const { bus, seat, amount } = route.params;
    const { user } = useAuth();
    const [method, setMethod] = useState('UPI');
    const [loading, setLoading] = useState(false);
    const theme = useTheme();

    const handlePayment = async () => {
        setLoading(true);
        // 1. Create Mock Payment Record
        const paymentData = {
            user_id: user.id,
            amount: amount,
            method: method,
            status: 'COMPLETED', // Mock success
            transaction_id: 'TXN_' + Date.now(),
        };

        const { data: payment, error: payError } = await supabase
            .from('payments')
            .insert([paymentData])
            .select()
            .single();

        if (payError) {
            setLoading(false);
            Alert.alert('Payment Failed', payError.message);
            return;
        }

        // 2. Create Ticket
        const ticketId = 'HR-' + Math.floor(100000 + Math.random() * 900000);
        const qrData = JSON.stringify({
            tid: ticketId,
            uid: user.id,
            bid: bus?.id,
            seat: seat,
            valid: true
        });

        const ticketData = {
            ticket_id: ticketId,
            user_id: user.id,
            bus_id: bus?.id, // Can be null if using mock bus
            seat_number: seat,
            fare: amount,
            status: 'VALID',
            payment_id: payment.id,
            qr_code_data: qrData,
            valid_from: new Date(),
        };

        const { data: ticket, error: ticketError } = await supabase
            .from('tickets')
            .insert([ticketData])
            .select()
            .single();

        setLoading(false);

        if (ticketError) {
            Alert.alert('Booking Failed', ticketError.message);
        } else {
            Alert.alert('Success', 'Ticket Booked Successfully!', [
                { text: 'View Ticket', onPress: () => navigation.replace('Ticket', { ticket }) }
            ]);
        }
    };

    const PaymentMethod = ({ value, label, icon }) => (
        <TouchableOpacity onPress={() => setMethod(value)} style={[styles.methodCard, method === value && { borderColor: theme.colors.primary, borderWidth: 2, backgroundColor: '#E3F2FD' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name={icon} size={28} color={theme.colors.primary} style={{ marginRight: 15 }} />
                <Text variant="titleMedium">{label}</Text>
            </View>
            <RadioButton value={value} status={method === value ? 'checked' : 'unchecked'} />
        </TouchableOpacity>
    );

    return (
        <Layout>
            <View style={styles.header}>
                <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: theme.colors.primary }}>Payment</Text>
            </View>

            <Card style={styles.summaryCard} mode="contained">
                <Card.Title title="Booking Summary" left={(props) => <MaterialCommunityIcons {...props} name="receipt" />} />
                <Card.Content>
                    <View style={styles.row}>
                        <Text>Bus Number</Text>
                        <Text style={{ fontWeight: 'bold' }}>{bus?.bus_number || 'HR-68-1234'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text>Seat Number</Text>
                        <Text style={{ fontWeight: 'bold' }}>{seat}</Text>
                    </View>
                    <View style={[styles.row, { marginTop: 10, borderTopWidth: 1, borderTopColor: '#fff', paddingTop: 10 }]}>
                        <Text variant="titleMedium" style={{ color: '#fff' }}>Total Amount</Text>
                        <Text variant="headlineSmall" style={{ color: '#fff', fontWeight: 'bold' }}>₹ {amount}</Text>
                    </View>
                </Card.Content>
            </Card>

            <Text variant="titleMedium" style={styles.sectionTitle}>Select Payment Method</Text>

            <PaymentMethod value="UPI" label="UPI / GPay / PhonePe" icon="cellphone-nfc" />
            <PaymentMethod value="CARD" label="Credit / Debit Card" icon="credit-card" />
            <PaymentMethod value="NETBANKING" label="Net Banking" icon="bank" />
            <PaymentMethod value="CASH" label="Pay on Bus" icon="cash" />

            <Button
                mode="contained"
                onPress={handlePayment}
                loading={loading}
                style={styles.payButton}
                contentStyle={{ paddingVertical: 5 }}
                labelStyle={{ fontSize: 18 }}
            >
                Pay ₹ {amount}
            </Button>

        </Layout>
    );
}

const styles = StyleSheet.create({
    header: {
        marginBottom: 20,
        marginTop: 10,
    },
    summaryCard: {
        backgroundColor: '#3F51B5',
        marginBottom: 30,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    sectionTitle: {
        fontWeight: '700',
        marginBottom: 15,
    },
    methodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 12,
        elevation: 1,
    },
    payButton: {
        marginTop: 30,
        borderRadius: 12,
    },
});
