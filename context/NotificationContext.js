import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePushNotifications } from '../usePushNotifications';

// Create the context
const NotificationContext = createContext();

// Hook to access the context
export const useNotification = () => useContext(NotificationContext);

const NotificationProvider = ({ children }) => {
    const [unreadNotifications, setUnreadNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const { notification } = usePushNotifications(); // Get the incoming notification

    // Load stored notifications from AsyncStorage when the app loads
    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const storedNotifications = await AsyncStorage.getItem('notifications');
                const parsedNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];

                setNotifications(parsedNotifications);

                const hasUnread = parsedNotifications.some((notification) => !notification.read);
                setUnreadNotifications(hasUnread);

            } catch (error) {
                console.log('Error loading notifications:', error);
            }
        };

        loadNotifications();
    }, []);

    // Listen for incoming push notifications and update the notifications list
    useEffect(() => {
        if (notification) {
            const newNotification = {
                id: notification.request.identifier, // Use the notification ID from the push service
                title: notification.request.content.title || 'New Notification',
                message: notification.request.content.body || 'You have a new notification.',
                read: false,
            };

            const updatedNotifications = [newNotification, ...notifications];
            setNotifications(updatedNotifications);
            AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));

            setUnreadNotifications(true); 
        }
    }, [notification]);

    const markAsRead = async (notificationId) => {
        const updatedNotifications = notifications.map((notification) =>
            notification.id === notificationId
                ? { ...notification, read: true }
                : notification
        );
        setNotifications(updatedNotifications);

        await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));

        const hasUnread = updatedNotifications.some((notification) => !notification.read);
        setUnreadNotifications(hasUnread);
    };

    return (
        <NotificationContext.Provider
            value={{
                unreadNotifications,
                notifications,
                markAsRead,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;
