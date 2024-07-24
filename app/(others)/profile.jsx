import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import { router } from 'expo-router';
import { icons } from '../../constants';
import useAppwrite from '../../lib/useAppwrite';
import { getUserPrayerTime, signOut, deleteUserData } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import InfoBox from '../../components/InfoBox';
import * as MailComposer from 'expo-mail-composer';


const Profile = () => {
    const { user, setUser, setIsLoggedIn } = useGlobalContext();
    const [prayerTime, setPrayerTime] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);

    const userId = user ? user.$id : null;
    const { data: time_prayer } = useAppwrite(() => userId ? getUserPrayerTime(userId) : null, [userId]);

    useEffect(() => {
        if (time_prayer && time_prayer.length > 0) {
            const totalPrayerTime = time_prayer[0].time_prayer;
            setPrayerTime(totalPrayerTime);
        }
    }, [time_prayer]);

    const formatTime = (totalMinutes) => {
        if (totalMinutes < 60) {
            return `${totalMinutes} mins`;
        } else {
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return `${hours} hrs ${minutes} mins`;
        }
    };

    const navigateTo = (path) => {
        router.replace(path);
    };

    const logout = async () => {
        await signOut();
        setUser(null);
        setIsLoggedIn(false);
        router.replace('/home');
    };

    const login = async () => {
        router.replace('/sign-in');
    };

    const manage_groups = async () => {
        Alert.alert("Page not available", "This feature is still under development")
        // router.replace('/manage_groups');
    };



    const sendEmail = async (recipient, subject, body) => {
        try {
            const result = await MailComposer.composeAsync({
                recipients: [recipient],
                subject: subject,
                body: body,
            });

            if (result.status === MailComposer.MailComposerStatus.SENT) {
                console.log('Email sent successfully');
            } else {
                throw new Error('Email not sent');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Send Request to Delete Account',
            'You will lose all data associated with your account. Do you want to proceed?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Account deletion canceled'),
                    style: 'cancel',
                },
                {
                    text: 'Proceed',
                    onPress: async () => {
                        try {
                            await sendEmail('contact.ipraydaily@gmail.com', 'Request Account Deletion', '');
                            Alert.alert('Account Deletion Request', 'We have received your request to delete your account. We will get back to you as soon as possible to confirm the deletion.');
                        } catch (error) {
                            console.error('Error requesting account deletion:', error);
                            Alert.alert('Error', 'Unable to request account deletion. Please try again.');
                        }
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: false }
        );
    };


    const renderHeader = () => (
        <View className="w-full flex justify-center items-center mt-6">
            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
                <Image source={{ uri: user?.avatar }} className="w-[90%] h-[90%] rounded-lg" resizeMode="cover" />
            </View>
            <InfoBox title={user?.username} containerStyles="mt-5" titleStyles="text-xl" />
        </View>
    );

    const renderStatisticsModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                <View className="bg-white w-4/5 p-5 rounded-lg shadow-lg">
                    {userId ? (
                        <>
                            <Text className="text-xl font-semibold text-center mb-4">Prayer Statistics</Text>
                            <Text className="text-lg text-center">You have prayed for {formatTime(prayerTime)} in the last 7 days.</Text>
                        </>
                    ) : (
                        <>
                            <Text className="text-xl font-semibold text-center mb-4">No Account</Text>
                            <Text className="text-lg text-center mb-4">You don't have an account.</Text>
                            <TouchableOpacity onPress={login} className="bg-orange-400 px-4 py-2 rounded mt-4">
                                <Text className="text-white text-center">Create Account Now</Text>
                            </TouchableOpacity>
                        </>
                    )}
                    <TouchableOpacity onPress={() => setModalVisible(false)} className="bg-gray-400 px-4 py-2 rounded mt-4">
                        <Text className="text-white text-center">Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView className="bg-white h-full">
            <View className="flex-row items-center justify-between pl-4 mt-8 bg-gray-200 py-4">
                <TouchableOpacity onPress={() => navigateTo('/home')} className="p-2">
                    <Image source={icons.back} className="w-6 h-6" resizeMethod="contain" />
                </TouchableOpacity>
                <Text className="text-xl">Profile</Text>
                <View className="w-6 h-6" />
            </View>

            <View className="w-full mt-4">
                {renderHeader()}
                <View className="border-t border-gray-300 my-2" />
                <TouchableOpacity onPress={() => setModalVisible(true)} className="flex-row w-full items-center flex items-left ml-6 px-2 py-4">
                    <Image source={icons.statistics} className="w-5 h-5 mr-4" resizeMode="contain" />
                    <Text className="text-lg text-black">My prayer statistics</Text>
                </TouchableOpacity>
                <View className="border-t border-gray-300 my-2" />
                <TouchableOpacity onPress={manage_groups} className="flex-row w-full items-center flex items-left ml-6 px-2 py-4">
                    <Image source={icons.team} className="w-5 h-5 mr-4" resizeMode="contain" />
                    <Text className="text-lg text-black">My groups</Text>
                </TouchableOpacity>
                <View className="border-t border-gray-300 my-2" />
                {userId ? (
                    <>
                        <TouchableOpacity onPress={logout} className="flex-row items-center w-full flex items-left ml-6 px-2 py-4">
                            <Image source={icons.logout} className="w-5 h-5 mr-4" resizeMode="contain" />
                            <Text className="text-lg text-black">Logout</Text>
                        </TouchableOpacity>
                        <View className="border-t border-gray-300 my-2" />
                        <TouchableOpacity onPress={handleDeleteAccount} className="flex-row items-center w-full flex items-left ml-6 px-2 py-4">
                            <Image source={icons.delete_account} className="w-5 h-5 mr-4" resizeMode="contain" />
                            <Text className="text-lg text-black">Delete Account</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TouchableOpacity onPress={login} className="flex-row items-center w-full flex items-left ml-6 px-2 py-4">
                            <Image source={icons.logout} className="w-5 h-5 mr-4" resizeMode="contain" />
                            <Text className="text-lg text-black">Login</Text>
                        </TouchableOpacity>
                    </>
                )}
                <View className="border-t border-gray-300 my-4" />
            </View>
            {renderStatisticsModal()}
        </SafeAreaView>
    );
};

export default Profile;
