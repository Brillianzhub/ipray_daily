import { Text, View, ScrollView, TouchableOpacity, Button, Alert, Image, Linking } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons } from '../../constants';
import { router } from 'expo-router';
import { useGlobalContext } from "../../context/GlobalProvider";

const RemoveAds = () => {
    const { user, setUser, setIsLoggedIn } = useGlobalContext();
    const userId = user ? user.$id : null;

    const toggleShowGuidelines = () => {
        setShowGuildlines(!showGuildlines);
    };

    const navigateTo = (route) => {
        router.replace(route);
    };

    const navigateToApplicationForm = async () => {
        const url = 'https://www.brillianzhub.com/policies/ipray_privacy_policy'; // Replace with your actual URL
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            console.error("Couldn't open URL:", url);
        }
    };

    const handlePayment = async () => {
        Alert.alert("Feature Unavailable", "The 'Receive Support' functionality is under development and will be available soon.")
        // if (!user) {
        //     navigateTo('/sign-in');
        //     return;
        // }
        // console.log('Payment processing initiated...');
        // setShowAds(false);
        // alert('Thank you for your support! Ads are now removed.');
    };

    return (
        <View className="bg-white h-full">
            <View className="flex-col my-6 px-4 min-h-[95vh]">
                <View className="flex justify-center">
                    <View className="border-solid border-2 border-orange-400 rounded-lg p-2 mb-8">
                        <View className="flex-row items-center mb-2">
                            <Text className="text-lg text-orange-400 mr-2">Help us grow!</Text>
                        </View>
                        <Text className="text-base text-justify leading-loose">
                            Developing and maintaining IPray Daily requires ongoing resources. Your financial support allows us to:
                            {/* List benefits of support */}
                            {"\n"}
                            * Enhance the app's features and functionality.
                            {"\n"}
                            * Maintain a secure and reliable platform.
                            {"\n"}
                            * Spread the word and reach new users. Thank you!
                        </Text>
                    </View>
                    <Button title="Send Support!" onPress={handlePayment} className="" />
                </View>
            </View>
        </View>
    );
};

export default RemoveAds;
