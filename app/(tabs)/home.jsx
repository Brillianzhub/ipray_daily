import React, { useState, useCallback } from 'react';
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from 'react-native';

import SearchInput from '../../components/SearchInput';
import { useGlobalContext } from '../../context/GlobalProvider';
import CategoriesListing from '../../components/CategoriesListing';
import ListCard from '../../components/ListCard';
import { usePrayer } from '../../lib/usePrayer';
import { useNavigation } from '@react-navigation/native';
import PrayerModal from '../../components/PrayerModal';



const Prayer = () => {
  const { user } = useGlobalContext();

  const { categories, isLoading, error, prayers, fetchedPrayers, setPrayers, selectedCategory, setSelectedCategory } = usePrayer();

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const navigation = useNavigation();

  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);


  const navigateToCategories = (tab) => {
    setActiveTab(tab);
    setSelectedCategory(null);
  }

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

  const handleFavorites = (tab) => {
    setActiveTab(tab);
    setSelectedCategory(tab);
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

  const optionHeader = (() => (
    <View style={styles.header}>
      <SearchInput />
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 5, marginBottom: 10 }}>
        <TouchableOpacity
          style={{ padding: 8, borderBottomWidth: activeTab === 'categories' ? 2 : 0, borderBottomColor: 'orange' }}
          onPress={() => navigateToCategories('categories')}
        >
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Categories</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ padding: 8, borderBottomWidth: activeTab === 'favorites' ? 2 : 0, borderBottomColor: 'orange' }}
          onPress={() => handleFavorites('favorites')}
        >
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Favorites</Text>
        </TouchableOpacity>
      </View>
    </View>
  ));


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

  const dataToShow = activeTab === 'favorites' ? fetchedPrayers : prayers;

  return (
    <View style={styles.container}>
      {optionHeader()}
      {selectedCategory ? (
        <FlatList
          data={dataToShow}
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
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCategoryItem}
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
});

export default Prayer;
