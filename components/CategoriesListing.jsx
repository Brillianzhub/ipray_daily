import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

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
        const restLetters = title.slice(1, 2).toLowerCase();
        return firstLetter + restLetters;
    };

    return (
        <View className="flex-row justify-start items-center ">
            <View className="w-12 h-12 p-2  justify-center m-1.5 rounded-xl bg-orange-200">
                <Text className="text-center text-2xl font-bold">{getCategoryInitials(categories.title)}</Text>
            </View>
            <TouchableOpacity
                className="py-2 w-1/2"
                onPress={() => setSelectedCategory(categories.title)}
            >
                <Text className="pl-2 text-xl">{categories.title}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // alignItems: 'center',
        // paddingHorizontal: 16,
        // marginBottom: 48,
    },
});

export default CategoriesListing;
