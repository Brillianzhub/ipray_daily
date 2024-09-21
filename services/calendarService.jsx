// src/services/calendarService.js

import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';

// Request permissions
export async function requestCalendarPermissions() {
  if (Platform.OS === 'android') {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === 'granted') {
      const { status: reminderStatus } = await Calendar.requestRemindersPermissionsAsync();
      if (reminderStatus !== 'granted') {
        alert('Reminder permissions are required for setting reminders.');
      }
    } else {
      alert('Calendar permissions are required for setting reminders.');
    }
  } else if (Platform.OS === 'ios') {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
      alert('Calendar permissions are required for setting reminders.');
    }
  }
}

// Create a calendar
export async function createCalendar() {
  const defaultCalendarSource =
    Platform.OS === 'ios'
      ? await Calendar.getDefaultCalendarSourceAsync()
      : { isLocalAccount: true, name: 'Expo Calendar' };

  const newCalendarID = await Calendar.createCalendarAsync({
    title: 'Expo Calendar',
    color: 'blue',
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: defaultCalendarSource.id,
    source: defaultCalendarSource,
    name: 'internalCalendarName',
    ownerAccount: 'personal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });

  return newCalendarID;
}

// Create an event with a reminder
export async function createEventWithReminder(calendarId) {
  const eventId = await Calendar.createEventAsync(calendarId, {
    title: 'Sample Event',
    startDate: new Date('2024-06-10T10:00:00.000Z'),
    endDate: new Date('2024-06-10T11:00:00.000Z'),
    timeZone: 'GMT',
    location: 'Somewhere',
  });

  const reminderId = await Calendar.createReminderAsync(eventId, {
    title: 'Sample Reminder',
    startDate: new Date('2024-06-10T09:50:00.000Z'),
    timeZone: 'GMT',
    minutes: 10, // minutes before the event
  });

  return { eventId, reminderId };
}
