// src/components/CalendarComponent.js

import React, { useEffect, useState } from 'react';
import { Button, View, Text } from 'react-native';
import { requestCalendarPermissions, createCalendar, createEventWithReminder } from '../services/calendarService';

const CalendarComponent = () => {
    const [calendarId, setCalendarId] = useState(null);

    useEffect(() => {
        requestCalendarPermissions().then(() => {
            createCalendar().then(id => {
                setCalendarId(id);
            });
        });
    }, []);

    const handleCreateEvent = () => {
        if (calendarId) {
            createEventWithReminder(calendarId)
                .then(({ eventId, reminderId }) => {
                    alert(`Event and reminder created! Event ID: ${eventId}, Reminder ID: ${reminderId}`);
                })
                .catch(error => {
                    alert(`Error creating event and reminder: ${error.message}`);
                });
        }
    };

    return (
        <View>
            <Button title="Create Event with Reminder" onPress={handleCreateEvent} />
        </View>
    );
};

export default CalendarComponent;
