import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const BookItem = ({ item, onPress }) => {
    return (
        <TouchableOpacity onPress={() => onPress(item)} style={styles.itemContainer}>
            <View key={item.id} style={styles.item}>
                <Text style={styles.text}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        margin: 3,
        maxWidth: '48%', // Two columns
    },
    item: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 0,
        borderWidth: 1,
        borderColor: 'rgb(255 237 213)',
        borderRadius: 10,
        height: 50,
    },
    text: {
        fontSize: 16,
    },
});

export default BookItem;
