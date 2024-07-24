import { useState, useEffect, useRef } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
  enableNotifications: () => Promise<void>;
  disableNotifications: () => Promise<void>;
  getNotificationStatus: () => Promise<boolean>;
}

export const usePushNotifications = (): PushNotificationState => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldShowAlert: true,
      shouldSetBadge: false,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification');
        return;
      }

      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      });

      console.log('Generated Expo Push Token:', token);

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      if (token) {
        try {
          const storedToken = await AsyncStorage.getItem('expoPushToken');
          if (storedToken !== token.data) {
            await AsyncStorage.setItem('expoPushToken', token.data);

            // Send the token to the backend
            await fetch('https://www.brillianzhub.com/notifications/register-token/', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ token: token.data }),
            })
              .then(response => response.json())
              .then(data => {
                console.log('Token sent to backend:', data);
              })
              .catch(error => {
                console.error('Error sending token to backend:', error);
              });
          } else {
            console.log('Token already registered with the backend');
          }
        } catch (error) {
          console.error('Error storing or sending token:', error);
        }
      }
    } else {
      alert('Must be using a physical device for Push notifications');
    }

    return token;
  };

  const enableNotifications = async () => {
    await registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  };

  const disableNotifications = async () => {
    try {
      // Remove the token from local storage
      await AsyncStorage.removeItem('expoPushToken');

      // Optionally notify the backend to remove the token
      if (expoPushToken) {
        await fetch('https://www.brillianzhub.com/notifications/unregister-token/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: expoPushToken.data }),
        })
          .then(response => response.json())
          .then(data => {
            console.log('Token removed from backend:', data);
          })
          .catch(error => {
            console.error('Error removing token from backend:', error);
          });
      }

      setExpoPushToken(undefined);
    } catch (error) {
      console.error('Error disabling notifications:', error);
    }
  };

  const getNotificationStatus = async () => {
    const token = await AsyncStorage.getItem('expoPushToken');
    return !!token;
  };

  useEffect(() => {
    // Automatically register for push notifications on component mount
    enableNotifications();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return {
    expoPushToken,
    notification,
    enableNotifications,
    disableNotifications,
    getNotificationStatus,
  };
};
