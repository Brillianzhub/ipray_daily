import { useState, useEffect } from 'react';
import * as Calendar from 'expo-calendar';
import * as Notifications from 'expo-notifications';
import * as MailComposer from 'expo-mail-composer';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Modal, View, Alert } from 'react-native';
import ShareEventForm from '../components/ShareEventForm';


const useSchedulePrayer = (item) => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        const storedEvents = await AsyncStorage.getItem('events');
        if (storedEvents) {
            setEvents(JSON.parse(storedEvents));
        }
    };

    const saveEvents = async (newEvents) => {
        await AsyncStorage.setItem('events', JSON.stringify(newEvents));
    };

    const showDatePickerModal = () => {
        setShowDatePicker(true);
    };

    const hideDatePickerModal = () => {
        setShowDatePicker(false);
    };

    const showTimePickerModal = () => {
        setShowTimePicker(true);
    };

    const hideTimePickerModal = () => {
        setShowTimePicker(false);
    };

    const handleDateChange = (event, date) => {
        const selected = date || selectedDate;
        hideDatePickerModal();
        setSelectedDate(selected);
    };

    const handleTimeChange = (event, time) => {
        const selected = time || selectedTime;
        hideTimePickerModal();
        setSelectedTime(selected);
    };



    const createEvent = async (prayerName) => {
        const eventStartDate = new Date(selectedDate);
        eventStartDate.setHours(selectedTime.getHours());
        eventStartDate.setMinutes(selectedTime.getMinutes());

        const eventEndDate = new Date(eventStartDate.getTime());

        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status === 'granted') {
            const calendars = await Calendar.getCalendarsAsync();
            let defaultCalendar = calendars.find(cal => cal.allowsModifications);

            if (!defaultCalendar) {
                const newCalendar = await Calendar.createCalendarAsync({
                    title: 'Prayer Calendar',
                    color: 'blue',
                    entityType: Calendar.EntityTypes.EVENT,
                    sourceId: calendars[0].source.id,
                    source: calendars[0].source,
                    name: 'Prayer Calendar',
                    ownerAccount: 'personal',
                    accessLevel: Calendar.CalendarAccessLevel.OWNER,
                });
                defaultCalendar = { id: newCalendar };
            }

            const eventId = await Calendar.createEventAsync(defaultCalendar.id, {
                title: prayerName,
                startDate: eventStartDate,
                endDate: eventEndDate,
                timeZone: 'local',
            });

            const newEvent = { id: eventId, title: prayerName, startDate: eventStartDate };
            const newEvents = [...events, newEvent];
            setEvents(newEvents);
            saveEvents(newEvents);

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Prayer Reminder',
                    body: `It's time for your ${prayerName} prayer!`,
                    sound: 'default',
                },
                trigger: {
                    date: eventStartDate,
                    channelId: 'your_notification_channel_id',
                },
            });

            alert('Prayer scheduled successfully!');
        } else {
            alert('Calendar permission not granted');
        }
    };

    const removeEvent = async (id) => {
        const newEvents = events.filter(event => event.id !== id);
        setEvents(newEvents);
        saveEvents(newEvents);

        await Calendar.deleteEventAsync(id);
        alert('Event removed successfully!');
    };

    const refreshEvents = async () => {
        await AsyncStorage.removeItem('events');
        setEvents([]);
    };



    const updateEvent = async (id, updatedTitle, updatedDate, updatedTime) => {
        const eventIndex = events.findIndex(event => event.id === id);
        if (eventIndex === -1) {
            Alert.alert('Event not found');
            return;
        }

        const updatedStartDate = new Date(updatedDate);
        updatedStartDate.setHours(updatedTime.getHours());
        updatedStartDate.setMinutes(updatedTime.getMinutes());

        const updatedEndDate = new Date(updatedStartDate.getTime());

        try {
            await Calendar.updateEventAsync(id, {
                title: updatedTitle,
                startDate: updatedStartDate,
                endDate: updatedEndDate,
                timeZone: 'local',
            });

            const updatedEvent = {
                ...events[eventIndex],
                title: updatedTitle,
                startDate: updatedStartDate,
            };

            const updatedEvents = [...events];
            updatedEvents[eventIndex] = updatedEvent;

            setEvents(updatedEvents);
            await saveEvents(updatedEvents);

            alert('Event updated successfully!');
        } catch (error) {
            console.error('Error updating event:', error);
            Alert.alert('Error updating event');
        }
    };


    const shareEvent = async (event, recipients, body) => {
        console.log('Event received in shareEvent:', event);
        if (!event || !event.startDate) {
            Alert.alert('Invalid event data');
            return;
        }
        let formattedStartDate;
        if (typeof event.startDate === 'string') {
            formattedStartDate = new Date(event.startDate);
        } else if (event.startDate instanceof Date) {
            formattedStartDate = event.startDate;
        } else {
            alert('Invalid date format for event start date.');
            return;
        }
        const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Organization//Your App//EN
BEGIN:VEVENT
UID:${event.id}
DTSTAMP:${formatDateToICS(formattedStartDate)}
DTSTART:${formatDateToICS(formattedStartDate)}
DTEND:${formatDateToICS(formattedStartDate)}
SUMMARY:${event.title}
END:VEVENT
END:VCALENDAR`;

        const fileUri = `${FileSystem.documentDirectory}${event.id}.ics`;
        await FileSystem.writeAsStringAsync(fileUri, icsContent);

        await MailComposer.composeAsync({
            subject: `${event.title}`,
            body: body,
            recipients: recipients,
            attachments: [fileUri],
        });

        setModalVisible(false);
    };

    const composeEmailModal = (event) => (
        <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={{ margin: 20 }}>
                <ShareEventForm
                    event={event}
                    onSubmit={(recipients, body) => shareEvent(event, recipients, body)}
                    closeModal={() => setModalVisible(false)}
                />
            </View>
        </Modal>
    );

    const formatDateToICS = (date) => {
        const pad = (n) => (n < 10 ? '0' + n : n);
        return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
    };

    return {
        events,
        selectedDate,
        selectedTime,
        showDatePicker,
        setShowDatePicker,
        showTimePicker,
        modalVisible,
        handleDateChange,
        handleTimeChange,
        setModalVisible,
        showDatePickerModal,
        hideDatePickerModal,
        showTimePickerModal,
        hideTimePickerModal,
        createEvent,
        removeEvent,
        updateEvent,
        refreshEvents,
        shareEvent,
        composeEmailModal,
    };
};

export default useSchedulePrayer;
