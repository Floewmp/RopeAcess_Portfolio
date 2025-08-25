import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';

const Button = React.memo(({ 
    label, 
    onPress, 
    kind = "primary", 
    full = false, 
    disabled = false, 
    loading = false,
    style,
    textStyle 
}) => (
    <Pressable
        onPress={onPress} 
        disabled={disabled || loading} 
        hitSlop={20} 
        android_ripple={{ color: "#111" }}
        style={({ pressed }) => [ 
            styles.btn, 
            full && styles.btnFull, 
            kind === "primary" ? styles.btnPrimary : 
            kind === "danger" ? styles.btnDanger : styles.btnSecondary, 
            (disabled || loading) && { opacity: 0.5 }, 
            pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] }, 
            style
        ]}
        accessibilityRole="button"
        accessibilityLabel={label}
    >
        {loading ? (
            <ActivityIndicator color={kind === "secondary" ? "#000" : "#fff"} />
        ) : (
            <Text style={[
                kind === "secondary" ? styles.btnTextDark : styles.btnText,
                textStyle
            ]}>
                {label}
            </Text>
        )}
    </Pressable>
));

const styles = StyleSheet.create({
    btn: { 
        paddingVertical: 16, 
        paddingHorizontal: 20, 
        borderRadius: 8, 
        alignItems: "center", 
        justifyContent: 'center', 
        borderWidth: 1.5, 
        borderColor: "#000", 
        minHeight: 52 
    },
    btnFull: { width: "100%" },
    btnPrimary: { backgroundColor: "#000" },
    btnSecondary: { backgroundColor: "#fff" },
    btnDanger: { backgroundColor: "#e11d48", borderColor: "#e11d48" },
    btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
    btnTextDark: { color: "#000", fontWeight: "700", fontSize: 16 },
});

export default Button;
