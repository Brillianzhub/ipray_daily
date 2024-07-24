import React, { useState, useEffect, memo } from 'react';
import { SafeAreaView, Image, Text, View, ScrollView, Switch, TouchableOpacity, Modal, Button, FlatList, RefreshControl } from 'react-native';
import SlideShow from '../../components/SlideShow';
import useAppwrite from '../../lib/useAppwrite';
import {
  getAllPosts,
  getAllAudio,
  getUserPrayerTime,
  updateUserPrayerTime,
  getAllCategory,
  getPrayersByCategory
} from '@/lib/appwrite';
import CustomButton from '../../components/CustomButton';
import PrayerFormField from '../../components/PrayerFormField';
import { Link, useNavigation } from 'expo-router';
import { useGlobalContext } from "../../context/GlobalProvider";
import CategoryModal from '../../components/CategoryModal';
import useModal from '../../lib/useModal';
import { icons } from '../../constants';
import { router } from 'expo-router';

const StartPrayer = () => {
  const { user } = useGlobalContext();
  const { data: posts, error, loading } = useAppwrite(getAllPosts);
  const { data: audio } = useAppwrite(getAllAudio);
  const { modalVisible, showModal, hideModal } = useModal();

  const userId = user ? user.$id : null;
  const { data: time_prayer } = useAppwrite(() => userId ? getUserPrayerTime(userId) : null, [userId]);

  const [slideDuration, setSlideDuration] = useState('4');
  const [numTexts, setNumTexts] = useState('5');
  const [totalPrayerTime, setTotalPrayerTime] = useState(0);
  const [currentPrayerTime, setCurrentPrayerTime] = useState(0);
  const [currentDocumentId, setCurrentDocumentId] = useState(null);
  const [startSlideshow, setStartSlideshow] = useState(false);
  const [playMusic, setPlayMusic] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [selectedAudioTitle, setSelectedAudioTitle] = useState('');
  const [completed, setCompleted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categoryPosts, setCategoryPosts] = useState([]);
  const [modalVisibleCategory, setModalVisibleCategory] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  const getRandomPosts = (allPosts, count) => {
    if (!allPosts || allPosts.length === 0) return [];
    const shuffled = allPosts.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    if (slideDuration && numTexts) {
      const durationInMinutes = parseFloat(slideDuration);
      const numberOfPoints = parseInt(numTexts, 10);

      if (!isNaN(durationInMinutes) && !isNaN(numberOfPoints)) {
        setTotalPrayerTime(durationInMinutes * numberOfPoints);
      } else {
        setTotalPrayerTime(0);
      }
    }
  }, [slideDuration, numTexts]);

  useEffect(() => {
    if (time_prayer && time_prayer.length > 0) {
      const currentPrayerTime = time_prayer[0].time_prayer;
      const currentDocumentId = time_prayer[0].$id.toString();

      setCurrentPrayerTime(currentPrayerTime);
      setCurrentDocumentId(currentDocumentId);
    }
  }, [time_prayer]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await getAllCategory();
        setCategories([{ title: 'All' }, ...categoriesResponse]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      if (selectedCategory && selectedCategory !== 'all') {
        try {
          const categoryPostsResponse = await getPrayersByCategory(selectedCategory);
          const numberOfPrayers = parseInt(numTexts, 10)

          if (categoryPostsResponse.length === 0 || categoryPostsResponse.length < numberOfPrayers) {
            setSelectedCategory('all');
          } else {
            setCategoryPosts(categoryPostsResponse);
          }
        } catch (error) {
          console.error('Error fetching category posts:', error);
        }
      }
    };

    fetchCategoryPosts();
  }, [selectedCategory]);


  const handleFormSubmit = async () => {
    const durationInMinutes = parseFloat(slideDuration);
    const numberOfPoints = parseInt(numTexts, 10);

    if (!isNaN(durationInMinutes) && !isNaN(numberOfPoints)) {
      const calculatedTotalPrayerTime = durationInMinutes * numberOfPoints;
      setTotalPrayerTime(calculatedTotalPrayerTime);

      setStartSlideshow(true);
    }
  };

  const handleComplete = async () => {
    if (currentDocumentId) {
      await updateUserPrayerTime(currentDocumentId, totalPrayerTime + currentPrayerTime);
    }
    setStartSlideshow(false);
    setCompleted(true);
  };

  const handleAudioSelect = (audio) => {
    setSelectedAudio(audio);
    setSelectedAudioTitle(audio.title);
    hideModal();
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.title.toLowerCase());
    setModalVisibleCategory(false);
  };


  const navigateTo = (route) => {
    router.replace(route);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setSlideDuration('');
    setNumTexts('');
    setTotalPrayerTime(0);
    setCurrentPrayerTime(0);
    setStartSlideshow(false);
    setPlayMusic(false);
    setSelectedAudio(null);
    setSelectedAudioTitle('');
    setCompleted(false);
    setSelectedCategory('all');
    setCategoryPosts([]);
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error loading prayers.</Text>;
  }

  const texts = getRandomPosts(selectedCategory === 'all' ? posts : categoryPosts, parseInt(numTexts, 10));

  const renderAudioItem = ({ item }) => (
    <TouchableOpacity
      style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}
      onPress={() => handleAudioSelect(item)}
    >
      <Text>{item.title}</Text>
      {selectedAudio === item.url && <Text>✔</Text>}
    </TouchableOpacity>
  );

  if (completed) {
    return (
      <SafeAreaView className="bg-white h-full justify-center items-center">
        <Text className="text-2xl text-black text-center text-semibold mb-7 font-psemibold">
          Congratulations! You have completed your prayer session.
        </Text>
        <TouchableOpacity onPress={() => {
          setStartSlideshow(false);
          setCompleted(false);
          navigation.navigate('home');
        }} className="mt-4 p-3 bg-blue-500 rounded-full bg-orange-400">
          <Text className="text-white text-lg">Explore more...</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!startSlideshow) {
    return (
      <SafeAreaView className="bg-white h-full mt-8">
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View className="min-h-[95vh]">
            <View className="flex-row items-center justify-between px-4 bg-gray-200 h-16">
              <TouchableOpacity onPress={() => navigateTo('/home')} className="p-2 h-12 justify-center">
                <Image source={icons.back} className="w-6 h-6" resizeMode="contain" />
              </TouchableOpacity>
              <Text className="text-xl text-center">Start prayer session</Text>
              <View className="w-6 h-6" />
            </View>

            <View className="w-full justify-center px-4 items-center">

              <View>
                <Text className="text-2xl text-orange-400 text-semibold mb-3 mt-3 font-psemibold">
                  Information on your prayer
                </Text>
              </View>

              <PrayerFormField
                title="Time for one prayer point (minutes):"
                value={slideDuration}
                onChangeText={setSlideDuration}
                keyboardType="numeric"
                otherStyles="mt-7 h-12"
              />

              <PrayerFormField
                title="How many prayer points?"
                value={numTexts}
                onChangeText={setNumTexts}
                keyboardType="numeric"
                otherStyles="mt-7 h-12"
              />

              <View className="bg-sky-600 rounded-lg w-full h-10 mt-4 justify-center">
                <TouchableOpacity onPress={() => setModalVisibleCategory(true)} className="">
                  <Text className=" text-center text-lg text-white font-bold">SELECT CATEGORY</Text>
                </TouchableOpacity>
              </View>
              <View className="mt-2">
                <Text className="text-lg text-sky-950 mt-3 italic">{`Selected Category: ${selectedCategory}`}</Text>
              </View>

              <View className="flex-row items-center mt-7 ">
                <Text className="text-lg text-black font-psemibold mr-3">Play Background Music</Text>
                <Switch
                  className="h-14"
                  value={playMusic}
                  onValueChange={(value) => {
                    setPlayMusic(value);
                    if (value) {
                      showModal();
                    } else {
                      setSelectedAudio(null);
                      setSelectedAudioTitle('');
                    }
                  }}
                />
              </View>

              {playMusic && selectedAudioTitle && (
                <Text className="text-lg text-black mt-3">{selectedAudioTitle}</Text>
              )}


              <Text className="text-xl text-black font-psemibold mt-7">
                Total Prayer Time: {totalPrayerTime} minutes
              </Text>

              <CustomButton
                title="Start"
                handlePress={handleFormSubmit}
                containerStyles="w-[50%] h-12 mt-7"
              />

              <View className="justify-center pt-5 flex-row gap-2">
                <Text className="text-lg text-black-100 font-pregular mt-7">
                  Not ready yet?
                </Text>
                <Link href="/home" className="text-lg font-psemibold text-secondary">
                  Go back!
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={hideModal}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ width: 300, backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
              <Text className="text-lg text-black font-psemibold mb-3">Select Background Music</Text>
              <FlatList
                data={audio}
                keyExtractor={(item) => item.url}
                renderItem={renderAudioItem}
              />
              <View className="w-full h-12 bg-sky-600 justify-center rounded-lg mt-2">
                <TouchableOpacity onPress={hideModal}>
                  <Text className="text-center text-white font-bold text-xl">Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <CategoryModal
          visible={modalVisibleCategory}
          categories={categories}
          onSelectCategory={handleCategorySelect}
          onClose={() => setModalVisibleCategory(false)}
        />

      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
        <SlideShow
          posts={texts}
          slideDuration={slideDuration * 60}
          numTexts={numTexts}
          playMusic={playMusic}
          selectedAudio={selectedAudio}
          onComplete={handleComplete}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default StartPrayer;
