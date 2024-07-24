// components/ChapterItem.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ChapterItem = ({ chapter, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <Text style={styles.chapterTitle}>{chapter.number}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        margin: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
    },
    chapterTitle: {
        fontSize: 16,
    },
});

export default ChapterItem;
