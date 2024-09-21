import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { router } from 'expo-router';
import { icons } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';
import InfoBox from '../../components/InfoBox';
import * as MailComposer from 'expo-mail-composer';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios';
import useBookCompletion from '../../lib/useBookCompletion';


const Profile = () => {
    const { user, setUser, setIsLoggedIn } = useGlobalContext();
    const { percentageCompletion, completionOldTestament, completionNewTestament } = useBookCompletion();
    const [showPercentageCompletion, setShowPercentageCompletion] = useState(false);
    const [showPrayerStatistics, setShowPrayerStatistics] = useState(false);

    const userId = user ? user.$id : null;

    const photoUrl = user?.photo || 'https://via.placeholder.com/150';

    const signOut = async () => {
        try {
            const response = await axios.post('https://www.brillianzhub.com/ipray/logout');

            if (response.status === 200) {
                console.log("Logged out successfully");
                return true;
            } else {
                console.error("Failed to log out");
                return false;
            }
        } catch (error) {
            console.error("Logout Error: ", error);
            Alert.alert("Logout Error", "Failed to logout. Please try again.")
            return false;
        }
    };

    const logout = async () => {
        try {
            if (user.authProvider === 'email') {
                const success = await signOut();
                if (!success) return;
            } else if (user.authProvider === 'google') {
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
            };
            setUser(null);
            setIsLoggedIn(false);
        } catch (error) {
            console.error("Logout Error: ", error);
        }
    };

    const login = async () => {
        router.replace('/sign-in');
    };

    const manage_groups = async () => {
        Alert.alert("Page not available", "This feature is still under development")
        // router.replace('/manage_groups');
    };

    const toggleStudyStatistics = () => {
        setShowPrayerStatistics(!showPrayerStatistics)
    }

    const prayerItems = [
        { title: 'Total time on prayers', value: "NA" },
    ];

    const capitalizeName = (name) => {
        if (!name) return '';
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };


    const togglePercentageCompletion = () => {
        setShowPercentageCompletion(!showPercentageCompletion);
    };

    const dropdownItems = [
        { title: 'Word study progress', value: percentageCompletion },
        { title: 'New Testament', value: completionNewTestament },
        { title: 'Old Testament', value: completionOldTestament },
    ];


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
                {photoUrl && (
                    <Image
                        source={{ uri: photoUrl }}
                        className="w-[90%] h-[90%] rounded-lg"
                        resizeMode="cover"
                    />
                )}
            </View>
            <InfoBox title={capitalizeName(user?.name)} containerStyles="mt-5" titleStyles="text-xl" />
        </View>
    );

    return (
        <View className="bg-white h-full">
            <View className="w-full mt-4">
                {renderHeader()}
                <View className="border-t border-gray-300 my-2" />
                <TouchableOpacity
                    onPress={toggleStudyStatistics}
                    className="flex-row items-center px-4 ml-2 py-2 bg-white rounded shadow">
                    <Image source={icons.statistics} className="w-5 h-5 mr-4" resizeMode="contain" />
                    <Text className="text-lg text-black">My prayer statistics</Text>
                    <View className="ml-auto">
                        {showPrayerStatistics ? (
                            <Image source={icons.up} className="w-7 h-7" resizeMode="contain" />
                        ) : (
                            <Image source={icons.down} className="w-7 h-7" resizeMode="contain" />
                        )}
                    </View>
                </TouchableOpacity>
                {showPrayerStatistics && (
                    <View className="bg-orange-50 px-4 mx-5 rounded-lg">
                        <FlatList
                            data={prayerItems}
                            keyExtractor={(item) => item.title}
                            renderItem={({ item }) => (
                                <View className="flex-row justify-between py-2">
                                    <Text className="text-lg">{item.title}</Text>
                                    <Text className="text-lg">{item.value}%</Text>
                                </View>
                            )}
                        />
                    </View>
                )}
                <View className="border-t border-gray-300 my-2" />
                <TouchableOpacity
                    onPress={togglePercentageCompletion}
                    className="flex-row items-center px-4 ml-2 py-2 bg-white rounded shadow"
                >
                    <Image source={icons.book} className="w-5 h-5 mr-4" resizeMode="contain" />
                    <Text className="text-lg text-black flex-1">My Word Study</Text>
                    <View className="ml-auto">
                        {showPercentageCompletion ? (
                            <Image source={icons.up} className="w-7 h-7" resizeMode="contain" />
                        ) : (
                            <Image source={icons.down} className="w-7 h-7" resizeMode="contain" />
                        )}
                    </View>
                </TouchableOpacity>
                {showPercentageCompletion && (
                    <View className="bg-orange-50 px-4 mx-5 rounded-lg">
                        <FlatList
                            data={dropdownItems}
                            keyExtractor={(item) => item.title}
                            renderItem={({ item }) => (
                                <View className="flex-row justify-between py-2">
                                    <Text className="text-lg">{item.title}</Text>
                                    <Text className="text-lg">{item.value}%</Text>
                                </View>
                            )}
                        />
                    </View>
                )}
                <View className="border-t border-gray-300 my-2" />
                <TouchableOpacity onPress={manage_groups} className="flex-row w-full items-center flex items-left ml-4 px-2 py-4">
                    <Image source={icons.team} className="w-5 h-5 mr-4" resizeMode="contain" />
                    <Text className="text-lg text-black">My groups</Text>
                </TouchableOpacity>
                <View className="border-t border-gray-300 my-2" />
                {user ? (
                    <>
                        <TouchableOpacity onPress={logout} className="flex-row items-center w-full flex items-left ml-4 px-2 py-4">
                            <Image source={icons.logout} className="w-5 h-5 mr-4" resizeMode="contain" />
                            <Text className="text-lg text-black">Logout</Text>
                        </TouchableOpacity>
                        <View className="border-t border-gray-300 my-2" />
                        <TouchableOpacity onPress={handleDeleteAccount} className="flex-row items-center w-full flex items-left ml-4 px-2 py-4">
                            <Image source={icons.delete_account} className="w-5 h-5 mr-4" resizeMode="contain" />
                            <Text className="text-lg text-black">Delete Account</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TouchableOpacity onPress={login} className="flex-row items-center w-full flex items-left ml-4 px-2 py-4">
                            <Image source={icons.logout} className="w-5 h-5 mr-4" resizeMode="contain" />
                            <Text className="text-lg text-black">Login</Text>
                        </TouchableOpacity>
                    </>
                )}
                <View className="border-t border-gray-300 my-4" />
            </View>
        </View>
    );
};

export default Profile;
