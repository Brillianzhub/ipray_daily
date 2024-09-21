import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Pressable } from 'react-native';

const CategoriesListing = ({ categories, isLoading, error, setSelectedCategory }) => {
    if (isLoading) {
        return (
            <View className="w-full">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="w-full">
                <Text>Something went wrong: {error.message}</Text>
            </View>
        );
    }

    if (!categories || categories.length === 0) {
        return (
            <View className="w-full">
                <Text >No categories available.</Text>
            </View>
        );
    }

    const getCategoryInitials = (title) => {
        const firstLetter = title.charAt(0).toUpperCase();
        const restLetters = title.slice(1, 3).toUpperCase();
        return firstLetter + restLetters;
    };

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Text style={styles.iconText}>
                    {getCategoryInitials(categories.title)}
                </Text>
            </View>
            <Pressable
                style={styles.buttonContainer}
                onPress={() => setSelectedCategory(categories.title)}
                android_ripple={{ color: '#dddddd' }}
            >
                <Text style={styles.categoryTitle}>
                    {categories.title}
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

export default CategoriesListing;
