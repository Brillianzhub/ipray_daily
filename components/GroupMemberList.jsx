import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, Alert } from 'react-native';

// Import the memberContactList function
import { memberContactList } from '@/lib/appwrite';

const GroupMemberList = ({ groupId }) => {
    const [loading, setLoading] = useState(false);
    const [members, setMembers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMemberContacts = async () => {
            setLoading(true);
            setError(null);

            try {
                const memberDetails = await memberContactList(groupId);
                setMembers(memberDetails);
            } catch (error) {
                console.error("Error fetching member contacts:", error);
                setError(error.message);
                Alert.alert("Error", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMemberContacts();
    }, [groupId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }

    return (
        <View>
            <Text>Group Members</Text>
            <FlatList
                data={members}
                keyExtractor={(item) => item.email}
                renderItem={({ item }) => (
                    <View style={{ padding: 10 }}>
                        <Text>Username: {item.username}</Text>
                        <Text>Email: {item.email}</Text>
                        {item.avatar && (
                            <Image
                                source={{ uri: item.avatar }}
                                style={{ width: 50, height: 50, borderRadius: 25 }}
                            />
                        )}
                    </View>
                )}
            />
        </View>
    );
};

export default GroupMemberList;
