import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, useRouter } from 'expo-router';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '@/context/GlobalProvider';
import { usePrayer } from '../lib/usePrayer';
import LoadingScreen from '../components/LoadingScreen';


const Welcome = () => {
  const { isLoggedIn } = useGlobalContext();
  const translateX = useSharedValue(-300);
  const { categories, isLoading } = usePrayer();
  const router = useRouter();

  useEffect(() => {
    translateX.value = withTiming(0, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  if (isLoggedIn) {
    return <Redirect href="/home" />;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="w-full flex justify-center items-center min-h-[95vh] px-4">
          <Animated.View style={animatedStyle}>
            <Text className="text-5xl text-white font-bold text-center mt-5">
              IPray {''}
              <Text className="text-secondary-200 italic">Daily</Text>
            </Text>
          </Animated.View>
          <Text className="text-xl text-white text-center italic mt-5">
            ... Men ought always to pray, and not {"\n"} to faint.{" "}
            <Text className="text-secondary-200 italic font-bold">Luke 18:1 (KJV)</Text>
          </Text>
          <CustomButton
            title="Let Us Pray!"
            handlePress={() => {
              router.push("/home");
            }}
            containerStyles="w-[50%] h-14 mt-9"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Welcome;
