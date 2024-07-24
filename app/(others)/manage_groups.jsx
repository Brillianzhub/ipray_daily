import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert
} from 'react-native';
import { router } from 'expo-router';
import { icons } from '../../constants/';
import { useGlobalContext } from '../../context/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import GroupCodeModal from '../../components/GroupCodeModal';
import { useGroups } from '../../lib/useGroups';

const ManageGroup = () => {
    const { user } = useGlobalContext();
    const {
        groups,
        groupCode,
        setGroupCode,
        loading,
        fetchGroups,
        joinGroup,
        leaveGroup,
        deleteGroup
    } = useGroups(user);

    const [groupCodeModalVisible, setGroupCodeModalVisible] = useState(false);
    const [filteredGroups, setFilteredGroups] = useState([]);

    useEffect(() => {
        if (groups) {
            // Filter groups to include only those the user is registered in
            const userGroups = groups.filter(group =>
                group.members.some(member => member.accountId === user.email)
            );
            setFilteredGroups(userGroups);
        }
    }, [groups, user.$id]);

    console.log(filteredGroups)

    const handleGroupCodeSubmit = async () => {
        setGroupCodeModalVisible(false);
        if (!groupCode) {
            Alert.alert("Error", "Group code is required.");
            return;
        }

        const { alreadyMember, message, error } = await joinGroup(selectedGroupId, user.$id, groupCode);
        if (error) {
            Alert.alert("Error", error);
        } else if (alreadyMember) {
            Alert.alert("Information", message);
        } else {
            Alert.alert("Success", message);
        }
        fetchGroups();
        setGroupCode("");
    };

    const renderGroupItem = ({ item }) => (
        <View className="flex flex-row justify-between items-center p-3 border-b border-gray-300">
            <View>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
                <Text className="text-left">{item.description}</Text>
                <Text className="text-left text-orange-400 italic">{item.open ? "Open group" : "Closed group"}</Text>
            </View>

            <View className="flex-row">
                <View className="bg-sky-600 round-lg w-20 h-12 justify-center">
                    <TouchableOpacity onPress={() => joinGroup(item.$id, user.$id)} >
                        <Text className="text-center text-white text-lg">Join</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Members:</Text>
                <View>
                    {item.members.map((member, index) => (
                        <View key={index}>
                            <Text>{member.creator.username}</Text>
                            <Text>{member.creator.email}</Text>
                            {/* Add more member information here as needed */}
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
            <View className="flex-row justify-between items-center bg-gray-200 px-4 py-4">
                <TouchableOpacity onPress={() => router.replace('/home')} className="p-2">
                    <Image
                        source={icons.back}
                        className="w-5 h-5"
                        resizeMode="contain" />
                </TouchableOpacity>
                <Text className="text-lg">My Groups</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={filteredGroups}
                    keyExtractor={(item) => item.$id}
                    renderItem={renderGroupItem}
                    refreshing={loading}
                    onRefresh={fetchGroups}
                />
            )}

            <GroupCodeModal
                visible={groupCodeModalVisible}
                onRequestClose={() => setGroupCodeModalVisible(false)}
                onSubmit={handleGroupCodeSubmit}
                groupCode={groupCode}
                setGroupCode={setGroupCode}
            />
        </SafeAreaView>
    );
};

export default ManageGroup;
