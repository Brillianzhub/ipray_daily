import { StyleSheet, Text, View, Switch, Alert, TouchableOpacity, Image, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { usePushNotifications } from '../../usePushNotifications';
import { router } from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';


const Settings = ({ navigation }) => {
    const { enableNotifications, disableNotifications, getNotificationStatus } = usePushNotifications();
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true); // Default state enabled
    const [isDarkTheme, setIsDarkTheme] = useState(false); // Add state for theme

    useEffect(() => {
        const checkNotificationStatus = async () => {
            const status = await getNotificationStatus();
            setIsNotificationsEnabled(status);
            if (!status) {
                await enableNotifications();
                setIsNotificationsEnabled(true);
            }
        };
        checkNotificationStatus();
    }, []);

    const toggleNotificationSwitch = async () => {
        if (isNotificationsEnabled) {
            await disableNotifications();
            Alert.alert('Notifications', 'Notifications have been disabled.');
        } else {
            await enableNotifications();
            Alert.alert('Notifications', 'Notifications have been enabled.');
        }
        setIsNotificationsEnabled(previousState => !previousState);
    };

    const toggleThemeSwitch = () => {
        setIsDarkTheme(previousState => !previousState);
    };


    const clearStorage = async () => {
        try {
            await AsyncStorage.clear();
            alert('AsyncStorage has been cleared.');
        } catch (error) {
            alert('Failed to clear AsyncStorage.');
        }
    };

    return (
        <View style={{ backgroundColor: 'white' }}>
            <View className="mt-6 px-4">
                <View style={styles.switchWrapper}>
                    <Text style={[styles.label, isDarkTheme ? styles.darkLabel : styles.lightLabel]}>
                        Enable Notifications
                    </Text>
                    <Switch
                        trackColor={{ false: isDarkTheme ? '#767577' : '#767577', true: isDarkTheme ? '#81b0ff' : '#81b0ff' }}
                        thumbColor={isNotificationsEnabled ? (isDarkTheme ? '#f5dd4b' : '#f5dd4b') : (isDarkTheme ? '#f4f3f4' : '#f4f3f4')}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleNotificationSwitch}
                        value={isNotificationsEnabled}
                    />
                </View>
                <View style={styles.switchWrapper}>
                    <Text style={[styles.label, isDarkTheme ? styles.darkLabel : styles.lightLabel]}>
                        Dark Theme
                    </Text>
                    <Switch
                        trackColor={{ false: isDarkTheme ? '#767577' : '#767577', true: isDarkTheme ? '#81b0ff' : '#81b0ff' }}
                        thumbColor={isDarkTheme ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleThemeSwitch}
                        value={isDarkTheme}
                        disabled={true} // Disable the theme switcher button
                    />
                </View>
                <Button title="Clear AsyncStorage" onPress={clearStorage} />
            </View>
        </View>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    lightContainer: {
        backgroundColor: '#f0f0f0',
    },
    darkContainer: {
        backgroundColor: '#121212',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingBottom: 16,
    },
    lightHeader: {
        backgroundColor: '#e0e0e0',
    },
    darkHeader: {
        backgroundColor: '#333',
    },
    backButton: {
        padding: 8,
    },
    backIcon: {
        width: 24,
        height: 24,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    lightHeaderTitle: {
        color: '#000',
    },
    darkHeaderTitle: {
        color: '#fff',
    },
    placeholder: {
        width: 24,
        height: 24,
    },
    switchContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start', // Align items to the start
        flexDirection: 'column', // Align items in a column
        width: '80%',
        padding: 16,
    },
    switchWrapper: {
        flexDirection: 'row', // Align switch and label in a row
        alignItems: 'center', // Center align items vertically
        marginBottom: 16, // Add margin to separate rows
    },
    label: {
        fontSize: 18,
        marginRight: 16,
    },
    lightLabel: {
        color: '#000',
    },
    darkLabel: {
        color: '#fff',
    },
});
