// UserForm.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const UserForm = ({ onSubmit }) => {
    const [slideDuration, setSlideDuration] = useState('120');
    const [numTexts, setNumTexts] = useState('5');

    const handleSubmit = () => {
        const duration = parseInt(slideDuration, 10);
        const number = parseInt(numTexts, 10);

        if (!isNaN(duration) && !isNaN(number)) {
            onSubmit(duration, number);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Enter slide duration (seconds):</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={slideDuration}
                onChangeText={setSlideDuration}
            />
            <Text style={styles.label}>Enter number of texts:</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={numTexts}
                onChangeText={setNumTexts}
            />
            <Button title="Start" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});

export default UserForm;
