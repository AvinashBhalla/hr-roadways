import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function Layout({ children, style, disablePadding }) {
    return (
        <LinearGradient
            colors={['#E3F2FD', '#FAFAFA', '#FFFFFF']} // Subtle modern gradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <StatusBar style="dark" />
            <SafeAreaView style={[styles.safeArea, style]}>
                <View style={[styles.content, !disablePadding && styles.padding]}>
                    {children}
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    padding: {
        paddingHorizontal: 20,
        paddingTop: 10,
    }
});
