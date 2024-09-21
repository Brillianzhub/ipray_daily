import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';

const ColorButton = ({ color, onPress, label }) => (
    <TouchableOpacity
        style={[styles.colorButton, { backgroundColor: color }]}
        onPress={onPress}
    >
        {label && <Text style={styles.colorButtonText}>{label}</Text>}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    colorButton: {
        width: 40,
        height: 40,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    colorButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ColorButton;
