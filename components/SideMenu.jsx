import { Text, View, TouchableOpacity, Modal, Dimensions, Image, Linking, Alert, Share } from 'react-native';
import React, { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { icons } from '../constants';
import { useRouter } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const SideMenu = ({ isVisible, onClose }) => {
    const screenWidth = Dimensions.get('window').width;
    const translateX = useSharedValue(-screenWidth);
    const backgroundOpacity = useSharedValue(0);

    const router = useRouter();

    const handleShare = async () => {
        const shareOptions = {
            message: "IPray Daily amazing Prayer & Bible app: https://play.google.com/store/apps/details?id=com.brillianzhub.ipray",
        };

        try {
            await Share.share(shareOptions);
        } catch (error) {
            console.log('Error sharing:', error);
            Alert.alert('Error', 'Unable to share the content.');
        }
    };

    useEffect(() => {
        if (isVisible) {
            translateX.value = withTiming(0, { duration: 200 });
            backgroundOpacity.value = withTiming(0.5, { duration: 400 });
        } else {
            translateX.value = withTiming(-screenWidth, { duration: 400 });
            backgroundOpacity.value = withTiming(0, { duration: 400 });
        }
    }, [isVisible]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const backgroundStyle = useAnimatedStyle(() => ({
        backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity.value})`,
    }));

    const navigateTo = (route) => {
        onClose();
        router.replace(route);
    };

    const navigateToPrivacyPolicy = async () => {
        const url = 'https://www.brillianzhub.com/policies/ipray_privacy_policy';
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            console.error("Couldn't open URL:", url);
        }
    };

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = Math.max(event.translationX - screenWidth, -screenWidth);
        })
        .onEnd((event) => {
            if (event.translationX < -screenWidth / 2) {
                translateX.value = withTiming(-screenWidth, { duration: 200 });
                backgroundOpacity.value = withTiming(0, { duration: 200 });
                runOnJS(onClose)();
            } else {
                translateX.value = withTiming(0, { duration: 200 });
            }
        });

    return (
        <Modal transparent visible={isVisible} animationType="none">
            <GestureDetector gesture={panGesture}>
                <View className="flex-1 flex-row">
                    <Animated.View style={[animatedStyle, { width: '80%', backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 }]}>
                        <View className="flex-1">
                            <View className="justify-center py-10 mt-20 h-30 bg-sky-900">
                                <Text className="font-bold text-2xl text-left px-4 mb-3 text-orange-400">IPRAY DAILY</Text>
                            </View>
                            <View className="border-solid w-full flex-col rounded-b-xl">
                                <TouchableOpacity
                                    onPress={() => navigateTo('/bookmark')}
                                    className="py-4 px-4 flex-row items-center bg-orange-50">
                                    <Image
                                        source={icons.bookmark}
                                        className="w-6 h-6"
                                        resizeMethod='contain'
                                    />
                                    <Text className="text-xl text-sky-950 font-normal px-7 mt-2 mb-2 ">Bookmark</Text>
                                </TouchableOpacity>
                                <View className="border border-white w-full" />
                                <TouchableOpacity
                                    onPress={() => navigateTo('/about')}
                                    className="py-4 px-4 flex-row items-center bg-white">
                                    <Image
                                        source={icons.about}
                                        className="w-6 h-6"
                                        resizeMethod='contain'
                                    />
                                    <Text className="text-xl text-sky-950 font-normal px-7 mt-1 mb-1">About</Text>
                                </TouchableOpacity>
                                <View className="border border-white w-full" />
                                <TouchableOpacity
                                    onPress={() => navigateTo('/join_us')}
                                    className="py-4 px-4 flex-row items-center bg-orange-50">
                                    <Image
                                        source={icons.team}
                                        className="w-6 h-6"
                                        resizeMethod='contain'
                                    />
                                    <Text className="text-xl text-sky-950 font-normal px-7 mt-2 mb-2 ">Join Our Prayer Meeting</Text>
                                </TouchableOpacity>
                                <View className="border border-white w-full" />
                                <TouchableOpacity
                                    onPress={() => navigateTo('/remove_ads')}
                                    className="py-4 px-4 flex-row items-center bg-white">
                                    <Image
                                        source={icons.fund}
                                        className="w-6 h-6"
                                        resizeMethod='contain'
                                    />
                                    <Text className="text-xl text-sky-950 font-normal px-7 mt-1 mb-1">Support us</Text>
                                </TouchableOpacity>
                                <View className="border-b border-white w-full" />
                                <TouchableOpacity
                                    onPress={() => navigateTo('/rate_us')}
                                    className="py-4 px-4 flex-row items-center bg-orange-50">
                                    <Image
                                        source={icons.rate_us}
                                        className="w-6 h-6"
                                        resizeMethod='contain'
                                    />
                                    <Text className="text-lg text-sky-950 font-normal px-7 mt-1 mb-1">Rate this App</Text>
                                </TouchableOpacity>
                                <View className="border border-white w-full" />
                                <TouchableOpacity
                                    onPress={handleShare}
                                    className="py-4 px-4 flex-row items-center bg-white">
                                    <Image
                                        source={icons.share}
                                        className="w-6 h-6"
                                        resizeMethod='contain'
                                    />
                                    <Text className="text-xl text-sky-950 font-normal px-7 mt-1 mb-1">Share the App</Text>
                                </TouchableOpacity>
                                <View className="border border-white w-full" />

                                <TouchableOpacity
                                    onPress={() => navigateTo('/settings')}
                                    className="py-4 px-4 flex-row items-center bg-orange-50">
                                    <Image
                                        source={icons.settings}
                                        className="w-6 h-6"
                                        resizeMethod='contain'
                                    />
                                    <Text className="text-xl text-sky-950 font-normal px-7 mt-1 mb-1">Settings</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="border border-white w-full" />

                            <View className="h-20 bg-white">
                                {/* Free empty space */}
                            </View>
                        </View>
                    </Animated.View>
                    <Animated.View
                        className="flex-1"
                        onTouchEnd={onClose}
                        style={backgroundStyle}
                    />
                </View>
            </GestureDetector>
        </Modal>
    );
};

export default SideMenu;
