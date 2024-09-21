import React, { useState, useEffect } from 'react';
import { Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Network from 'expo-network';

const LoadingScreen = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const checkInternetConnection = async () => {
      try {
        const networkState = await Network.getNetworkStateAsync();
        setIsConnected(networkState.isConnected && networkState.isInternetReachable);
      } catch (error) {
        console.error("Error checking network state:", error);
        setIsConnected(false);
      }
    };

    checkInternetConnection();

    const intervalId = setInterval(checkInternetConnection, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full flex justify-center items-center">
      <ActivityIndicator size="large" color="#ffffff" />
      <Text className="text-white mt-4">Loading data...</Text>
      {!isConnected && (
        <Text className="text-white mt-4">Data may not load properly without an internet connection.</Text>
      )}
    </SafeAreaView>
  );
};

export default LoadingScreen;
