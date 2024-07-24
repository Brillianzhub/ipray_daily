// FormField.js
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const PrayerFormField = ({ title, value, onChangeText, keyboardType, otherStyles }) => {
    return (
        <View style={[styles.container, otherStyles]}>
            <Text style={styles.label}>{title}</Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
});

export default PrayerFormField;
