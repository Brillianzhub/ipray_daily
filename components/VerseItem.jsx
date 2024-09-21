// components/VerseItem.js
import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

const VerseItem = ({ item, onPress }) => {
    return (
        <Pressable onPress={onPress} style={styles.container} android_ripple={{ color: '#dddddd' }}>
            <Text style={styles.verseText}>{item.verse_number}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 6,
        borderWidth: 1,
        borderColor: '#fed7aa',
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
