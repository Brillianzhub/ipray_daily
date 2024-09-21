import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

const ChapterItem = ({ item, onPress }) => {
    return (
        <Pressable
            style={styles.container}
            onPress={onPress}
            android_ripple={{ color: '#dddddd' }}
        >
            <Text style={styles.chapterTitle}>{item.chapter_number}</Text>
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
    chapterTitle: {
        fontSize: 16,
    },
});

export default ChapterItem;
