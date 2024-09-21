import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet, Linking } from 'react-native';
import { useNotification } from '../../context/NotificationContext';

// Utility function to find and split URLs in the text
const parseMessageWithLinks = (message) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = message.split(urlRegex);

    return parts.map((part, index) => {
        if (urlRegex.test(part)) {
            return (
                <Text
                    key={index}
                    style={styles.updateLink}
                    onPress={() => Linking.openURL(part)}
                >
                    {part}
                </Text>
            );
        }
        return <Text key={index} style={styles.modalMessage}>{part}</Text>;
    });
};

const Notifications = () => {
    const { notifications, markAsRead } = useNotification();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);

    const handleNotificationPress = async (notification) => {
        await markAsRead(notification.id);
        setSelectedNotification(notification);
        setModalVisible(true);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.notificationItem} onPress={() => handleNotificationPress(item)}>
            <View style={styles.notificationContent}>
                <View style={styles.textContainer}>
                    <Text style={styles.notificationTitle}>{item.title}</Text>
                    <Text style={styles.notificationMessage} numberOfLines={1}>{item.message}</Text>
                </View>
                {!item.read && <View style={styles.unreadDot} />}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={notifications}
                keyExtractor={(item) => `${item.id}-${Math.random()}`}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>{selectedNotification?.title}</Text>
                        <View style={styles.modalMessageContainer}>
                            {selectedNotification && parseMessageWithLinks(selectedNotification.message)}
                        </View>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Notifications;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: 16,
    },
    listContainer: {
        paddingBottom: 16,
    },
    notificationItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
    },
    notificationContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    textContainer: {
        flex: 1,
        paddingRight: 10,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    notificationMessage: {
        fontSize: 14,
        color: '#555',
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'red',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    modalMessageContainer: {
        marginBottom: 20,
    },
    modalMessage: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
    updateLink: {
        fontSize: 16,
        color: '#1E90FF',
        textDecorationLine: 'underline',
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: '#FFA001',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
