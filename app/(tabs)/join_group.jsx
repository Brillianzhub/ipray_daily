import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    Alert,
    TextInput,
    Switch,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    ActivityIndicator
} from 'react-native';
import { createPrayerGroup, getPrayerGroups, joinPrayerGroup } from '../../lib/appwrite'; // Ensure these functions are correctly imported
import { router } from 'expo-router';
import { icons } from '../../constants/';
import { useGlobalContext } from '../../context/GlobalProvider';
import * as Crypto from 'expo-crypto';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import GroupCodeModal from '../../components/GroupCodeModal';

const Create = () => {
    const { user } = useGlobalContext();
    const [groups, setGroups] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [form, setForm] = useState({
        name: "",
        description: "",
        open: false,
    });
    const [refreshing, setRefreshing] = useState(false);
    const [groupCodeModalVisible, setGroupCodeModalVisible] = useState(false);
    const [groupCode, setGroupCode] = useState("");
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [loading, setLoading] = useState(false); // Add loading state for join group

    const [descriptionLength, setDescriptionLength] = useState(form.description.length);

    const MIN_DESCRIPTION_LENGTH = 10;
    const MAX_DESCRIPTION_LENGTH = 25;

    const handleDescriptionLengthChange = (text) => {
        setForm({ ...form, description: text });
        setDescriptionLength(text.length);
    };

    const validateDescription = () => {
        if (descriptionLength < MIN_DESCRIPTION_LENGTH) {
            return `Description must be at least ${MIN_DESCRIPTION_LENGTH} characters.`;
        } else if (descriptionLength > MAX_DESCRIPTION_LENGTH) {
            return `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.`;
        }
        return true; // Input is valid
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const fetchedGroups = await getPrayerGroups();
            setGroups(fetchedGroups);
        } catch (error) {
            console.error("Error fetching groups:", error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const fetchedGroups = await getPrayerGroups();
            setGroups(fetchedGroups);
        } catch (error) {
            console.error("Error fetching groups:", error);
        } finally {
            setRefreshing(false);
        }
    };

    const handleCopy = (groupCode) => {
        Clipboard.setStringAsync(groupCode);
        Alert.alert("Copied", "Group code copied to clipboard.");
    };

    const navigateToSignIn = () => {
        router.replace('/sign-in');
    };

    const handleCreate = () => {
        if (user) {
            setModalVisible(true);
        } else {
            Alert.alert("Sign in Required", 'You need to sign in to create a group. Would you like to sign in now?',
                [
                    { text: 'Cancel' },
                    { text: 'Sign In', onPress: () => navigateToSignIn() },
                ],
                { cancelable: false }
            );
        }
    };

    const handleChange = (name, value) => {
        if (name === "description") {
            handleDescriptionLengthChange(value);
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const generateRandomCode = async () => {
        const randomBytes = await Crypto.getRandomBytesAsync(5); // Generate 5 random bytes
        const randomCode = Array.from(randomBytes)
            .map(byte => (byte % 10).toString())
            .join('');

        return parseInt(randomCode, 10);
    };

    const submit = async () => {
        if (form.name === "" || form.description === "") {
            return Alert.alert("Please provide all fields");
        }

        const validationError = validateDescription();
        if (validationError !== true) {
            return Alert.alert("Description Error", validationError);
        }

        setLoading(true);
        try {
            const groupCode = await generateRandomCode();
            const groupData = {
                ...form,
                userId: user.$id,
                groupCode: groupCode,
            };

            await createPrayerGroup(groupData);
            Alert.alert(
                "Success",
                `Group successfully created! Share this code to invite members: ${groupCode}`,
                [
                    { text: "Cancel", onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: "Copy Code", onPress: () => handleCopy(groupCode) }
                ],
                { cancelable: false }
            );
            fetchGroups();
            setModalVisible(false);
        } catch (error) {
            console.log(error);
            Alert.alert(
                "Error",
                "Failed to create group. Please try again later."
            );
        } finally {
            setLoading(false);
        }
    };

    const joinGroup = async (groupId, isOpen) => {
        if (!user) {
            Alert.alert(
                'Sign in Required',
                'You need to sign in to join a group. Would you like to sign in now?',
                [
                    { text: 'Cancel' },
                    { text: 'Sign In', onPress: () => navigateToSignIn() },
                ],
                { cancelable: false }
            );
            return;
        }

        if (!isOpen) {
            setSelectedGroupId(groupId);
            setGroupCodeModalVisible(true);
            return;
        }

        setLoading(true);

        try {
            const { alreadyMember, message, response, error } = await joinPrayerGroup(groupId, user.$id, groupCode);

            if (error) {
                throw new Error(error);
            }

            if (alreadyMember) {
                Alert.alert("Information", message);
            } else {
                Alert.alert("Success", message);
            }

            fetchGroups();
        } catch (error) {
            console.error("Error joining group:", error);
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoLivePress = () => {
        Alert.alert("Go Live Feature", "Go Live is coming soon! This feature is still under development.");
    };

    const handleGroupCodeSubmit = async () => {
        setGroupCodeModalVisible(false);
        if (!groupCode) {
            Alert.alert("Error", "Group code is required.");
            return;
        }

        setLoading(true);
        try {
            const { alreadyMember, message, response, error } = await joinPrayerGroup(selectedGroupId, user.$id, groupCode);
            if (error) {
                Alert.alert("Error", error);
            } else if (alreadyMember) {
                Alert.alert("Information", message);
            } else {
                Alert.alert("Success", message);
            }
            fetchGroups();
        } catch (error) {
            console.error("Error joining group:", error);
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
            setGroupCode("");
        }
    };

    const renderGroupItem = ({ item }) => (
        <View className="flex flex-row justify-between items-center p-3 border-b border-gray-300">
            <View>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
                <Text className="text-left">{item.description}</Text>
                <Text className="text-left text-orange-400 italic">{item.open ? "Open group" : "Closed group"}</Text>
            </View>

            <View className="flex-row">
                <View className="bg-sky-600 round-lg w-20 h-12 justify-center mr-2">
                    <TouchableOpacity onPress={handleGoLivePress} className="opacity-50 cursor-not-allowed ">
                        <Text className="text-center text-white text-lg">Go Live</Text>
                    </TouchableOpacity>
                </View>
                <View className="bg-sky-600 round-lg w-20 h-12 justify-center">
                    <TouchableOpacity onPress={() => joinGroup(item.$id, item.open)} >
                        <Text className="text-center text-white text-lg">Join</Text>
                    </TouchableOpacity>
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
                <Text className="text-lg">Prayer Groups</Text>
                <View className="bg-sky-600 rounded-lg pr-3 pl-3 h-12 justify-center">
                    <TouchableOpacity onPress={handleCreate} >
                        <Text className="text-center text-xl font-bold text-white">Create Group</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={groups}
                    keyExtractor={(item) => item.$id}
                    renderItem={renderGroupItem}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            )}

            <GroupCodeModal
                visible={groupCodeModalVisible}
                onRequestClose={() => setGroupCodeModalVisible(false)}
                onSubmit={handleGroupCodeSubmit}
                groupCode={groupCode}
                setGroupCode={setGroupCode}
            />

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <TouchableWithoutFeedback>
                            <View style={{ width: '90%', padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Create New Group</Text>
                                <TextInput
                                    value={form.name}
                                    onChangeText={(text) => handleChange('name', text)}
                                    placeholder="Group Name"
                                    style={{ padding: 8, borderWidth: 1, borderColor: '#fb923c', borderRadius: 8, marginBottom: 16 }}
                                />
                                <TextInput
                                    value={form.description}
                                    onChangeText={(text) => handleChange('description', text)}
                                    placeholder="Short Description"
                                    style={{ padding: 8, borderWidth: 1, borderColor: '#fb923c', borderRadius: 8, marginBottom: 16 }}
                                />
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                                    <Switch
                                        value={form.open}
                                        onValueChange={(value) => handleChange('open', value)}
                                        trackColor={{ false: '#ccc', true: '#007bff' }}
                                        thumbColor='#fff'
                                    />
                                    <Text style={{ marginLeft: 8 }}>Open Group?</Text>
                                </View>
                                <View className="bg-sky-600 rounded-lg pr-3 pl-3 h-10 justify-center mb-4">
                                    <TouchableOpacity onPress={submit}>
                                        <Text className="text-white text-center font-bold text-lg">Create Group</Text>
                                    </TouchableOpacity>
                                </View>
                                <View className="bg-sky-600 rounded-lg pr-3 pl-3 h-10 justify-center">
                                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                                        <Text className="text-white text-center font-bold text-lg">Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
};

export default Create;
