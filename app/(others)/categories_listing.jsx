import { SafeAreaView, StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React from 'react';

const CategoriesListing = ({ categories, isLoading, error, setSelectedCategory }) => {

    const handleRowPress = (category) => {
        setSelectedCategory(category);
    };



    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Categories Listing</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Loading data...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Categories Listing</Text>
                </View>
                <View style={styles.errorContainer}>
                    <Text>Error loading data: {error.message}</Text>
                </View>
            </SafeAreaView>
        );
    }

    const getCategoryInitials = (title) => {
        const firstLetter = title.charAt(0).toUpperCase();
        const restLetters = title.slice(1, 3).toLowerCase();
        return firstLetter + restLetters;
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleRowPress(item.title)} style={styles.tableRow}>
            <View style={[styles.cell, styles.indexColumn]}>
                <Text style={styles.cellText}>{getCategoryInitials(item.title)}</Text>
            </View>
            <View style={[styles.cell, styles.categoryColumn]}>
                <Text style={styles.cellText}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Categories Listing</Text>
            </View>
            <View style={styles.table}>
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                />
            </View>
        </SafeAreaView>
    );
};

export default CategoriesListing;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 20,
        paddingVertical: 15,
    },
    header: {
        backgroundColor: '#d3d3d3',
        padding: 16,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    table: {
        flex: 1,
        marginTop: 10,
        padding: 12,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        overflow: 'hidden',
    },
    tableHeader: {
        backgroundColor: '#f7f7f7',
        borderBottomWidth: 2,
        borderBottomColor: '#000',
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    cell: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        borderRightWidth: 1,
        borderRightColor: '#ccc',
    },
    indexColumn: {
        flex: 0.75,
        backgroundColor: '#FFF7ED',
    },
    categoryColumn: {
        flex: 3.25,
    },
    headerCellText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    cellText: {
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
