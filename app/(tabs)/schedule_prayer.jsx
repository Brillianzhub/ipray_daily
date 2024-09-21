import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Modal,
    StyleSheet
} from 'react-native';
import React, { useState, useRef } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import useSchedulePrayer from '@/lib/useSchedulePrayer';
import { usePushNotifications } from '../../usePushNotifications';


const SchedulePrayer = ({ item }) => {
    const [prayerName, setPrayerName] = useState('');
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [newDate, setNewDate] = useState(new Date());
    const [newTime, setNewTime] = useState(new Date());

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
        updateEvent,
        refreshEvents,
        shareEvent,
        setShowDatePicker,
        modalVisible,
        setModalVisible,
        composeEmailModal,
    } = useSchedulePrayer(item);


    const { enableNotifications, disableNotifications, getNotificationStatus } = usePushNotifications();

    const openEditModal = (event) => {
        setSelectedEvent(event);
        setPrayerName(event.title);
        setNewDate(new Date(event.startDate));
        setNewTime(new Date(event.startDate));
        setUpdateModalVisible(true);
    };

    const handleUpdateEvent = () => {
        if (selectedEvent) {
            const updatedDateTime = new Date(newDate);
            updatedDateTime.setHours(newTime.getHours(), newTime.getMinutes());

            updateEvent(selectedEvent.id, prayerName || selectedEvent.title, updatedDateTime, updatedDateTime);
            setUpdateModalVisible(false);
        } else {
            Alert.alert("No event selected for update.");
        }
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
                    className="bg-orange-50 w-1/3 border ml-2 mr-2 border-solid border-orange-400 p-2 rounded-xl"
                >
                    {composeEmailModal(item)}
                    <Text className="text-center">Share</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => openEditModal(item)}
                    className="bg-orange-50 w-1/3 border mr-2 border-solid border-orange-400 p-2 rounded-xl"
                >
                    <Text className="text-center">Modify</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => removeEvent(item.id)}
                    className="bg-orange-50 w-1/3 border mr-2 border-solid border-orange-400 p-2 rounded-xl"
                >
                    <Text className="text-center">Remove</Text>
                </TouchableOpacity>
            </View>
            <View className="border-b border-gray-300 w-full mt-2 mb-4" />
        </View>
    );

    return (

        <View className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 5, paddingHorizontal: 16 }}>
                <TextInput
                    value={prayerName}
                    onChangeText={setPrayerName}
                    placeholder="Enter event title"
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
                            onChange={(event, date) => {
                                handleDateChange(event, date);
                                setNewDate(date || newDate); // Ensure the date is set
                            }}
                        />
                    )}

                    {showTimePicker && (
                        <DateTimePicker
                            value={selectedTime}
                            mode="time"
                            display="default"
                            onChange={(event, time) => {
                                handleTimeChange(event, time);
                                setNewTime(time || newTime);
                            }}
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

                <Text style={{ fontSize: 18, marginVertical: 20 }}>Scheduled Events:</Text>
                {events.map(renderEvent)}
            </ScrollView>

            {/* Modal for Editing Event */}
            {selectedEvent && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={updateModalVisible}
                    onRequestClose={() => setUpdateModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Modify Event</Text>
                            <TextInput
                                value={prayerName || selectedEvent.title}
                                onChangeText={setPrayerName}
                                placeholder="Enter Prayer Theme"
                                style={styles.input}
                            />
                            <TouchableOpacity onPress={showDatePickerModal} style={styles.dateButton}>
                                <Text style={styles.buttonText}>SELECT NEW DATE</Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={newDate}
                                    mode="date"
                                    display="default"
                                    onChange={(event, date) => {
                                        handleDateChange(event, date);
                                        setNewDate(date || newDate);
                                    }}
                                />
                            )}
                            <TouchableOpacity onPress={showTimePickerModal} style={styles.dateButton}>
                                <Text style={styles.buttonText}>SELECT NEW TIME</Text>
                            </TouchableOpacity>
                            {showTimePicker && (
                                <DateTimePicker
                                    value={newTime}
                                    mode="time"
                                    display="default"
                                    onChange={(event, time) => {
                                        handleTimeChange(event, time);
                                        setNewTime(time || newTime);
                                    }}
                                />
                            )}

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity onPress={handleUpdateEvent} style={styles.updateButton}>
                                    <Text style={styles.updateButtonText}>Update Event</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setUpdateModalVisible(false)} style={styles.cancelButton}>
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

            )}
        </View>
    );
};



const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark background
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '90%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 2,
        borderColor: '#0284C7',
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    dateButton: {
        backgroundColor: '#FFF7E6',
        borderWidth: 1,
        borderColor: '#FB923C',
        height: 50,
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: 20,
    },
    buttonText: {
        textAlign: 'center',
        color: '#EA580C',
        fontWeight: '600',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    updateButton: {
        flex: 1,
        backgroundColor: '#10B981',
        height: 50,
        justifyContent: 'center',
        borderRadius: 10,
        marginRight: 10,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#EF4444',
        height: 50,
        justifyContent: 'center',
        borderRadius: 10,
        marginLeft: 10,
    },
    updateButtonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
    },
    cancelButtonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
    },
});
export default SchedulePrayer;
