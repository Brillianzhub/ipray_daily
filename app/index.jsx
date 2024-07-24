import React, { useEffect, useState } from 'react';
import { StatusBar, Alert } from 'react-native';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, router } from 'expo-router';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from "@/context/GlobalProvider";
// import * as Network from 'expo-network';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Somewhere in your app initialization
// GoogleSignin.configure({
//   webClientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
// });


const Welcome = () => {
  const { isLoading, isLoggedIn } = useGlobalContext();
  // const [isConnected, setIsConnected] = useState(true);

  const translateX = useSharedValue(-300); // Initial position off-screen to the left

  // useEffect(() => {
  //   const checkInternetConnection = async () => {
  //     try {
  //       const networkState = await Network.getNetworkStateAsync();
  //       setIsConnected(networkState.isConnected && networkState.isInternetReachable);
  //     } catch (error) {
  //       console.error("Error checking network state:", error);
  //       setIsConnected(false);
  //     }
  //   };

  //   checkInternetConnection();
  // }, []);

  useEffect(() => {
    // Slide the text into view when the component mounts
    translateX.value = withTiming(0, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
  }, []);

  // useEffect(() => {
  //   if (!isConnected) {
  //     Alert.alert("No Internet Connection", "Please check your internet connection and try again.");
  //   }
  // }, [isConnected]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  if (!isLoading && isLoggedIn) {
    return <Redirect href="/home" />;
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
            ... Men ought always to pray, and not {"\n"}
            to faint.{" "}
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
