import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    RefreshControl
} from 'react-native';
import React, { useState, useCallback } from 'react';
import { useGlobalContext } from '../context/GlobalProvider';
import { usePrayer } from '../lib/usePrayer';
import ListCard from '../components/ListCard';
import PrayerModal from '../components/PrayerModal';


const FavoritesScreen = () => {

    const { user } = useGlobalContext();
    const { isLoading, error, prayers, fetchedPrayers, setPrayers, selectedCategory, setSelectedCategory } = usePrayer();

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
    }, [setPrayers, setSelectedCategory]);


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
            <FlatList
                data={fetchedPrayers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <ListCard
                        item={item}
                        onPress={handlePressItem}
                    />
                )}
                contentContainerStyle={styles.contentContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
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

export default FavoritesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'left',
        alignItems: 'left',
        backgroundColor: '#fbfaf9',
    },
    contentContainer: {
        marginTop: 10
    }
});
