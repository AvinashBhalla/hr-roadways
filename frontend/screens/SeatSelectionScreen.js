import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, Surface, useTheme, Card } from 'react-native-paper';
import Layout from '../components/Layout';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SeatSelectionScreen({ route, navigation }) {
    const { bus } = route.params || {};
    // Mock layout for demo if not in bus object
    const totalSeats = bus?.total_seats || 40;
    const cols = 4;
    const rows = Math.ceil(totalSeats / cols);

    const [selectedSeat, setSelectedSeat] = useState(null);
    const theme = useTheme();

    // Generate mock occupied seats
    const occupiedSeats = [2, 5, 8, 12, 15];

    const handleSeatPress = (seatNum) => {
        if (occupiedSeats.includes(seatNum)) return;
        setSelectedSeat(seatNum === selectedSeat ? null : seatNum);
    };

    const renderSeat = (seatNum) => {
        const isOccupied = occupiedSeats.includes(seatNum);
        const isSelected = selectedSeat === seatNum;

        let color = '#E0E0E0'; // Available
        if (isOccupied) color = theme.colors.error; // Occupied
        if (isSelected) color = theme.colors.secondary; // Selected

        return (
            <TouchableOpacity
                key={seatNum}
                onPress={() => handleSeatPress(seatNum)}
                disabled={isOccupied}
                style={[styles.seat, { backgroundColor: color, borderColor: isSelected ? theme.colors.primary : 'transparent', borderWidth: isSelected ? 2 : 0 }]}
            >
                <MaterialCommunityIcons name="seat" size={24} color={isSelected || isOccupied ? '#fff' : '#757575'} />
                <Text variant="labelSmall" style={{ color: isSelected || isOccupied ? '#fff' : '#757575' }}>{seatNum}</Text>
            </TouchableOpacity>
        );
    };

    const renderGrid = () => {
        let grid = [];
        let seatCounter = 1;
        for (let r = 0; r < rows; r++) {
            let rowCells = [];
            for (let c = 0; c < cols; c++) {
                // Add aisle
                if (c === 2) {
                    rowCells.push(<View key={`aisle-${r}`} style={styles.aisle} />);
                }
                if (seatCounter <= totalSeats) {
                    rowCells.push(renderSeat(seatCounter));
                    seatCounter++;
                }
            }
            grid.push(<View key={`row-${r}`} style={styles.row}>{rowCells}</View>);
        }
        return grid;
    };

    return (
        <Layout>
            <View style={styles.header}>
                <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: theme.colors.primary }}>Select Seat</Text>
                <Text variant="bodyMedium">Bus {bus?.bus_number || 'HR-68-1234'}</Text>
            </View>

            <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#E0E0E0' }]} />
                    <Text>Available</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: theme.colors.error }]} />
                    <Text>Booked</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: theme.colors.secondary }]} />
                    <Text>Selected</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
                <Surface style={styles.busContainer} elevation={2}>
                    <View style={styles.driverSection}>
                        <MaterialCommunityIcons name="steering" size={30} color="#9E9E9E" />
                    </View>
                    {renderGrid()}
                </Surface>
            </ScrollView>

            <Surface style={styles.footer} elevation={4}>
                <View>
                    <Text variant="titleMedium">Seat: {selectedSeat || '-'}</Text>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>₹ {selectedSeat ? '250.00' : '0.00'}</Text>
                </View>
                <Button
                    mode="contained"
                    disabled={!selectedSeat}
                    onPress={() => navigation.navigate('Payment', { bus, seat: selectedSeat, amount: 250 })}
                    contentStyle={{ paddingHorizontal: 20 }}
                >
                    Proceed
                </Button>
            </Surface>
        </Layout>
    );
}

const styles = StyleSheet.create({
    header: {
        marginBottom: 20,
        marginTop: 10,
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendColor: {
        width: 20,
        height: 20,
        borderRadius: 5,
        marginRight: 8,
    },
    gridContainer: {
        paddingBottom: 100,
        alignItems: 'center',
    },
    busContainer: {
        padding: 20,
        borderRadius: 20,
        backgroundColor: '#fff',
        width: '90%',
    },
    driverSection: {
        alignItems: 'flex-end',
        marginBottom: 20,
        paddingRight: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    aisle: {
        width: 30,
    },
    seat: {
        width: 45,
        height: 45,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
});
