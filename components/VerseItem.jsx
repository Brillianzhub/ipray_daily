// components/VerseItem.js
import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const VerseItem = ({ verse, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <Text style={styles.verseText}>{verse.verse}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        margin: 5,
        borderWidth: 1,
        borderColor: 'rgb(255 237 213)',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
    },
    verseText: {
        fontSize: 16,
    },
});

export default VerseItem;
