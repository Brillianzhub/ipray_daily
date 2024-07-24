import { Text, View, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons } from '../../constants';
import { router } from 'expo-router';
import useSchedulePrayer from '@/lib/useSchedulePrayer';
import { usePushNotifications } from '../../usePushNotifications';


const SchedulePrayer = ({ item }) => {
    const [prayerName, setPrayerName] = useState('');
    const {
        events,
        selectedDate,
        selectedTime,
        showDatePicker,
        showTimePicker,
        showDatePickerModal,
        hideDatePickerModal,
        handleDateChange,
        showTimePickerModal,
        hideTimePickerModal,
        handleTimeChange,
        createEvent,
        removeEvent,
        refreshEvents,
        shareEvent,
        modalVisible,
        setModalVisible,
        composeEmailModal,
    } = useSchedulePrayer(item);

    const { enableNotifications, disableNotifications, getNotificationStatus } = usePushNotifications();


    const navigateTo = (route) => {
        router.replace(route);
    };

    const renderEvent = (item) => (
        <View key={item.id}>
            <View className="flex-row justify-center bg-orange-50 h-10 items-center">
                <Text>{item.title}: {" "}</Text>
                <Text>{item.startDate.toString()}</Text>
            </View>
            <View className="flex-row justify-center mb-2 mt-2 pl-2 pr-2">
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    className="bg-orange-50 w-1/2 border mr-2 border-solid border-orange-400 p-2 rounded-xl"
                >
                    {composeEmailModal(item)}
                    <Text className="text-center">Share</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => removeEvent(item.id)}
                    className="bg-orange-50 w-1/2 border mr-2 border-solid border-orange-400 p-2 rounded-xl"
                >
                    <Text className="text-center">Remove</Text>
                </TouchableOpacity>
            </View>
            <View className="border-b border-gray-300 w-full mt-2 mb-4" />
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row items-center justify-between px-4 h-16 bg-gray-200">
                <TouchableOpacity onPress={() => navigateTo('/home')} className="mt-2 h-12 justify-center">
                    <Image source={icons.back} className="w-6 h-6" resizeMode="contain" />
                </TouchableOpacity>
                <Text className="text-xl text-center">Schedule Prayer</Text>
                <View className="w-6 h-6" />
            </View>
            <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 5, paddingHorizontal: 16 }}>
                <TextInput
                    value={prayerName}
                    onChangeText={setPrayerName}
                    placeholder="Enter Prayer Theme"
                    className="border-2 border-sky-600 h-12 rounded-xl mt-4 mb-4 p-2"
                />

                <View className="border border-solid border-orange-400 rounded-lg p-2">
                    <View className="flex-row justify-center mb-6 mt-6 pl-2 pr-2">
                        <TouchableOpacity onPress={showDatePickerModal} className="bg-orange-50 justify-center w-1/2 h-12 border mr-2 border-solid border-orange-400 p-2 rounded-xl">
                            <Text className="text-center">SELECT DATE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={showTimePickerModal} className="bg-orange-50 justify-center w-1/2 h-12 border border-solid border-orange-400 p-2 rounded-xl">
                            <Text className="text-center">SELECT TIME</Text>
                        </TouchableOpacity>
                    </View>

                    {showDatePicker && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}

                    {showTimePicker && (
                        <DateTimePicker
                            value={selectedTime}
                            mode="time"
                            display="default"
                            onChange={handleTimeChange}
                        />
                    )}

                    <View className="mb-4 rounded-xl">
                        <TouchableOpacity
                            onPress={() => createEvent(prayerName)}
                            className="bg-sky-600 p-2 rounded-lg h-12 justify-center">
                            <Text className="font-bold text-center text-white">ADD EVENT</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={{ fontSize: 18, marginVertical: 20 }}>Scheduled Prayers:</Text>
                {events.map(renderEvent)}
            </ScrollView>
        </SafeAreaView>
    );
};

export default SchedulePrayer;
