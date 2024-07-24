import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity,
  Button,
  RefreshControl,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons } from '../../constants';
import SearchInput from '../../components/SearchInput';
import TextCard from '../../components/TextCard';
import { useGlobalContext } from '../../context/GlobalProvider';
import SideMenu from '../../components/SideMenu';
import { getAllPosts, getPrayersByCategory, getAllCategory } from '@/lib/appwrite';
import useModal from '../../lib/useModal';
import CategoryModal from '../../components/CategoryModal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router } from 'expo-router';


const Prayer = () => {
  const { user } = useGlobalContext();
  const [posts, setPosts] = useState([]);
  const [data, setData] = useState([]);
  const [cat, setCat] = useState([]);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const { modalVisible, showModal, hideModal } = useModal();
  const [isMenuVisible, setIsMenuVisible] = useState(false);


  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [categoriesResponse, allPostsResponse] = await Promise.all([
          getAllCategory(),
          getAllPosts(),
        ]);
        setCategories([{ title: 'All' }, ...categoriesResponse]);
        setPosts(allPostsResponse);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      if (selectedCategory && selectedCategory !== 'all') {
        const categoryPosts = await getPrayersByCategory(selectedCategory);

        if (categoryPosts.length === 0) {
          Alert.alert('No Posts Found', 'No posts available for this category');
          setSelectedCategory('all');
          const allPosts = await getAllPosts();
          setPosts(allPosts);
        } else {
          setPosts(categoryPosts);
        }
      } else {
        const allPosts = await getAllPosts();
        setPosts(allPosts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleMenuToggle = () => {
    setIsMenuVisible((prev) => !prev);
  };

  const navigateTo = (route) => {
    router.replace(route);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const allPosts = await getAllPosts();
      setPosts(allPosts);
      setSelectedCategory('all');
    } catch (error) {
      console.error('Error refreshing posts:', error);
    }
    setRefreshing(false);
  };

  const handleCategorySelect = (category) => {
    const selected = category.title.toLowerCase();
    setSelectedCategory(selected);
    hideModal();
  };

  const renderHeader = useMemo(() => (
    <View className="my-6 px-4 space-y-6">
      <View className="justify-between items-start flex-row mb-3">
        <View className="justify-center mx-2 h-12">
          <TouchableOpacity onPress={handleMenuToggle}>
            <Image
              source={icons.sidebar}
              className="w-6 h-6 mr-2"
              resizeMethod="contain"
            />
          </TouchableOpacity>
          <SideMenu isVisible={isMenuVisible} onClose={handleMenuToggle}>
            <Button title="Close" onPress={handleMenuToggle} />
          </SideMenu>
        </View>
        <View className="justify-center items-end px-2 h-12">
          <TouchableOpacity onPress={() => navigateTo('/profile')}>
            <Image
              source={icons.profile}
              className="w-6 h-6 mr-2"
              resizeMethod="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
      <SearchInput />
      <TouchableOpacity onPress={showModal} className="bg-sky-600 rounded h-10 justify-center">
        <Text className="text-center text-white text-lg font-bold">Select Category</Text>
      </TouchableOpacity>
      <CategoryModal
        visible={modalVisible}
        categories={categories}
        onSelectCategory={handleCategorySelect}
        onClose={hideModal}
      />
    </View>
  ), [user, isMenuVisible, categories, modalVisible]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-white h-full items-center">
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
              <TextCard key={item.$id} text={item} />
            )}
            ListHeaderComponent={renderHeader}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Prayer;
