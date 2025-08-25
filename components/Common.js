import React from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { BackArrowIcon } from './Icons';

export const Metric = React.memo(({ label, value, unit }) => (
    <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={styles.metricValue}>{value}{unit ? ` ${unit}` : ""}</Text>
    </View>
));

export const FloatingBack = React.memo(({ onPress }) => (
    <Pressable 
        onPress={onPress} 
        hitSlop={20} 
        android_ripple={{ color: "#ddd" }} 
        style={({ pressed }) => [
            styles.fabBack, 
            pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] }
        ]} 
        accessibilityLabel="Back" 
        accessibilityRole="button"
    >
        <BackArrowIcon />
    </Pressable>
));

export const TopBar = React.memo(({ title }) => (
    <View style={styles.topbar}>
        <Text style={styles.topTitle}>{title}</Text>
    </View>
));

export const LoadingScreen = () => (
    <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
    </View>
);

export const Card = React.memo(({ children, style }) => (
    <View style={[styles.card, style]}>
        {children}
    </View>
));

const styles = StyleSheet.create({
    metricRow: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginVertical: 6, 
        paddingVertical: 6, 
        borderBottomWidth: 1, 
        borderColor: '#f0f0f0' 
    },
    metricLabel: { color: "#555", fontSize: 14, fontWeight: '500' },
    metricValue: { fontSize: 14, color: "#000", flex: 1, textAlign: 'right', marginLeft: 16 },
    fabBack: { 
        position: "absolute", 
        right: 20, 
        bottom: 20, 
        width: 56, 
        height: 56, 
        borderRadius: 8, 
        backgroundColor: "#fff", 
        borderWidth: 1.5, 
        borderColor: "#000", 
        alignItems: "center", 
        justifyContent: "center", 
        elevation: 4, 
        shadowColor: "#000", 
        shadowOpacity: 0.1, 
        shadowOffset: { width: 0, height: 2 }, 
        shadowRadius: 3 
    },
    topbar: { 
        paddingVertical: 16, 
        alignItems: "center", 
        borderBottomWidth: 1, 
        borderColor: '#eee' 
    },
    topTitle: { fontSize: 22, fontWeight: "800", color: "#000" },
    loadingContainer: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    card: { 
        backgroundColor: "#fff", 
        borderRadius: 8, 
        padding: 16, 
        marginVertical: 8, 
        borderWidth: 1, 
        borderColor: "#eee", 
        width: '100%' 
    },
});
