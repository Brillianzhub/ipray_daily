import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';

const BookItem = ({ item, onPress }) => {

    const getBookInitials = (item) => {
        const noSpacesItem = item.replace(/\s/g, '');
        const firstLetter = noSpacesItem.charAt(0).toUpperCase();
        const restLetters = noSpacesItem.slice(1, 3).toUpperCase();
        return firstLetter + restLetters;
    };


    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Text style={styles.iconText}>
                    {getBookInitials(item.book_name)}
                </Text>
            </View>
            <Pressable
                style={styles.buttonContainer}
                onPress={() => onPress(item)}
                android_ripple={{ color: '#dddddd' }}
            >
                <Text style={styles.categoryTitle}>
                    {item.book_name}
                </Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginBottom: 5
    },
    iconContainer: {
        width: 42,
        height: 42,
        padding: 0,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 6,
        borderRadius: 50,
        backgroundColor: '#f2d1a3',
    },
    iconText: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 'normal',
    },
    buttonContainer: {
        paddingVertical: 8,
        width: '50%',
    },
    categoryTitle: {
        paddingLeft: 8,
        fontSize: 18,
    },
});

export default BookItem;
