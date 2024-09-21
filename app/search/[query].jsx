import { FlatList, Text, View, TouchableOpacity, Image, StyleSheet, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import EmptyState from '../../components/EmptyState';
import { usePrayer } from '../../lib/usePrayer';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import PrayerModal from '../../components/PrayerModal';


const Search = () => {
    const { query } = useLocalSearchParams();
    const { categories, prayers, setPrayers, selectedCategory, setSelectedCategory } = usePrayer();
    const [refreshing, setRefreshing] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const navigateTo = (path) => {
        router.replace(path);
    };

    useEffect(() => {
        const foundCategory = categories.find(category => category.title.toLowerCase() === query.toLowerCase());
        if (foundCategory) {
            setSelectedCategory(foundCategory.title);
        } else {
            console.log('Category not found.');
        }
    }, [query, categories]);


    const displaySearch = ({ item }) => {

        const truncatedText = item.text.length > 150 ? `${item.text.substring(0, 150)}......` : item.text;
        return (
            <TouchableOpacity onPress={() => handlePressItem(item)}>
                <View>
                    <Text style={styles.textStyle}>{truncatedText} {''}
                        <Text className="text-orange-400 text-lg italic">{item.bible_quotation}</Text>
                    </Text>
                    <View style={styles.separator}></View>
                    <View />
                </View>
            </TouchableOpacity>
        )
    };


    const handlePressItem = (item) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedItem(null);
    };

    const handleSwipeLeft = () => {
        if (!selectedItem) return;
        const currentIndex = prayers.findIndex(prayer => prayer.id === selectedItem.id);
        const nextIndex = (currentIndex + 1) % prayers.length;
        setSelectedItem(prayers[nextIndex]);
    };

    const handleSwipeRight = () => {
        if (!selectedItem) return;
        const currentIndex = prayers.findIndex(prayer => prayer.id === selectedItem.id);
        const prevIndex = (currentIndex - 1 + prayers.length) % prayers.length;
        setSelectedItem(prayers[prevIndex]);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        navigateTo('/home');
        setRefreshing(false);
    };


    return (
        <View className="bg-white">
            <View className="p-4">
                {selectedItem ? (
                    <PrayerModal
                        isVisible={modalVisible}
                        onClose={handleCloseModal}
                        item={selectedItem}
                        onSwipeLeft={handleSwipeLeft}
                        onSwipeRight={handleSwipeRight}
                    />
                ) : (
                    <FlatList
                        data={prayers}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={displaySearch}
                        ListEmptyComponent={() => (
                            <EmptyState
                                title="No Prayers Found"
                                subtitle="No prayers found for this query"
                            />
                        )}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    separator: {
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        paddingBottom: 8
    },
    textStyle: {
        fontSize: 18,
        textAlign: 'justify'
    }
})

export default Search;
