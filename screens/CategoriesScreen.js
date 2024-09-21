import {
    StyleSheet,
    View,
    FlatList,
    RefreshControl
} from 'react-native';
import React, { useState, useCallback } from 'react';
import { useGlobalContext } from '../context/GlobalProvider';
import CategoriesListing from '../components/CategoriesListing';
import { usePrayer } from '../lib/usePrayer';
import ListCard from '../components/ListCard';
import PrayerModal from '../components/PrayerModal';


const CategoriesScreen = () => {

    const { user } = useGlobalContext();
    const { categories, isLoading, error, prayers, fetchedPrayers, setPrayers, selectedCategory, setSelectedCategory } = usePrayer();

    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);


    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            setSelectedCategory();
        } catch (error) {
            console.error('Error refreshing posts:', error);
        }
        setRefreshing(false);
        setActiveTab('categories');
    }, [setPrayers, setSelectedCategory]);

    const [activeTab, setActiveTab] = useState('categories');

    const renderCategoryItem = useCallback(
        ({ item }) => (
            <CategoriesListing
                categories={item}
                error={error}
                setSelectedCategory={(category) => setSelectedCategory(category)}
            />
        ),
        [error, setSelectedCategory]
    );


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


    return (
        <View style={styles.container}>
            {selectedCategory ? (
                <FlatList
                    data={prayers}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <ListCard
                            item={item}
                            onPress={handlePressItem}
                        />
                    )}
                    // ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    contentContainerStyle={styles.contentContainer}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                />
            ) : (
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderCategoryItem}
                    showsVerticalScrollIndicator={false}
                />
            )}
            {selectedItem && (
                <PrayerModal
                    isVisible={modalVisible}
                    onClose={handleCloseModal}
                    item={selectedItem}
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight}
                />
            )}
        </View>
    );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'left',
        alignItems: 'left',
        backgroundColor: '#fbfaf9',
    },
    contentContainer: {
    }
});
