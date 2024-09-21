import React, { useState } from 'react';
import { useEffect } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Modal,
    Text,
    FlatList,
    TouchableOpacity,
    Button,
    TouchableHighlight,
    TouchableWithoutFeedback,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { memberContactList, getPrayerGroups } from '@/lib/appwrite';
import InfoBox from './InfoBox'


const ShareEventForm = ({ event, onSubmit, closeModal }) => {
    const [email, setEmail] = useState('');
    const [emailList, setEmailList] = useState([]);
    const [body, setBody] = useState('');
    const [memberList, setMemberList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [emailModalVisible, setEmailModalVisible] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [prayerGroups, setPrayerGroups] = useState([]);


    useEffect(() => {
        fetchPrayerGroups();
    }, []);

    const fetchPrayerGroups = async () => {
        try {
            const groups = await getPrayerGroups();
            setPrayerGroups(groups);
        } catch (error) {
            console.error('Error fetching prayer groups:', error);
        }
    };

    const handleGroupSelection = async (groupId) => {
        setSelectedGroupId(groupId);
        setModalVisible(false);
        await fetchMemberList(groupId);
    };

    const fetchMemberList = async (groupId) => {
        try {
            const members = await memberContactList(groupId);
            const memberEmails = members.map(member => member);
            setEmailList(memberEmails);
            console.log('Fetched member list:', members);
        } catch (error) {
            console.error('Error fetching member list:', error);
        }
    };

    const addEmail = () => {
        if (email && !emailList.includes(email)) {
            setEmailList([...emailList, email]);
            setEmail('');
            Alert.alert("Success", "Emails added successfully to the email list");
        } else {
            Alert.alert("No email entered", "Enter email or select at least one group");
        }
    };


    const removeEmail = (emailToRemove) => {
        setEmailList(emailList.filter(e => e !== emailToRemove));
    };

    const Separator = () => <View className="h-px w-full bg-gray-300" />

    const handleSubmit = () => {
        if (emailList.length > 0 && body) {
            onSubmit(emailList, body);
        } else {
            alert('Please add at least one email and write the email content.');
        }
    };

    const toggleEmailList = () => {
        setEmailModalVisible(!emailModalVisible)
    };

    return (
        <SafeAreaView className="flex bg-white">
            <View className="w-full mt-10 justify-center">

                <TextInput
                    placeholder="Enter recipients email and click add email"
                    value={email}
                    onChangeText={setEmail}
                    className="mb-4 border border-sky-600 rounded-xl h-12 text-lg p-3 mt-4"
                />

                <View className="flex-row justify-center  mb-6 mt-2 px-1">
                    <TouchableOpacity onPress={addEmail} className="bg-orange-50 justify-center w-1/2 h-12 border border-solid border-orange-400 p-2 mr-2 rounded-xl">
                        <Text className="font-bold text-black text-center text-xl ">Add Email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-orange-50 justify-center w-1/2 h-12 border border-solid border-orange-400 p-2 rounded-xl">
                        <Text className="text-black font-bold text-center text-xl">Share to Group</Text>
                    </TouchableOpacity>
                </View>

                <View className="border-2 border-sky-600 p-3 rounded-xl mb-6 bg-sky-600">
                    <TouchableOpacity onPress={toggleEmailList}>
                        <Text className="text-white font-bold text-center text-xl">View Email Added to the List</Text>
                    </TouchableOpacity>
                </View>
                {/* <InfoBox title={'Email'} containerStyles="mt-0" titleStyles="text-xl" /> */}

                <View className="mb-6 border border-sky-600 px-3 rounded-xl">
                    <TextInput
                        placeholder="Write the email content"
                        value={body}
                        onChangeText={setBody}
                        multiline
                        numberOfLines={4}
                        className="text-xl"
                    />
                </View>

                <View className="flex flex-row justify-between bg-orange-50 items-center border border-orange-400 rounded-xl p-4">
                    <View className="justify-center h-12 w-1/3 mr-4 border-r border-orange-400">
                        <TouchableOpacity onPress={handleSubmit} className="">
                            <Text className="font-bold text-black text-center text-xl">Send</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="justify-center h-12 w-1/3 border-l border-orange-400">
                        <TouchableOpacity onPress={closeModal} className="">
                            <Text className="font-bold text-black text-center text-xl">Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <Text className="text-lg font-bold mb-5">Select a Prayer Group</Text>
                                <FlatList
                                    data={prayerGroups}
                                    keyExtractor={(item) => item.$id}
                                    renderItem={({ item }) => (
                                        <TouchableHighlight
                                            underlayColor="#DDDDDD"
                                            onPress={() => handleGroupSelection(item.$id)}
                                        >
                                            <Text className="text-left text-lg py-2">{item.name}</Text>
                                        </TouchableHighlight>
                                    )}
                                />
                                <TouchableHighlight
                                    className="bg-sky-600 rounded-xl py-3 mt-4 px-6"
                                    onPress={() => {
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text className="text-white text-center text-xl">Cancel</Text>
                                </TouchableHighlight>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>


            <Modal
                animationType="slide"
                transparent={true}
                visible={emailModalVisible}
                onRequestClose={() => {
                    setEmailModalVisible(false);
                }}
            >
                <TouchableWithoutFeedback onPress={() => setEmailModalVisible(false)}>
                    <View style={styles.emailModalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.emailModalContent}>
                                <Text className="text-lg font-bold mb-5">Email List</Text>
                                {emailList.length > 0 ? (
                                    <FlatList
                                        data={emailList}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) => (
                                            <View className="flex-row justify-between items-center mt-2 mb-2">
                                                <Text className="text-lg text-center">{item}</Text>
                                                <View className="border-2 border-orange-400 justify-center h-10 rounded-xl">
                                                    <TouchableOpacity onPress={() => removeEmail(item)} className="px-4">
                                                        <Text className="text-black text-lg">Remove</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        )}
                                        ItemSeparatorComponent={Separator}
                                    />
                                ) : (
                                    <Text className="text-center text-lg">No emails added yet</Text>
                                )}
                                <TouchableHighlight
                                    className="bg-sky-600 rounded-xl py-3 mt-4"
                                    onPress={() => {
                                        setEmailModalVisible(false);
                                    }}
                                >
                                    <Text className="text-white text-center text-xl">Close</Text>
                                </TouchableHighlight>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({

    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '80%',
        alignItems: 'center',
    },
    emailModalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    emailModalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: '100%',
        height: '85%',
        padding: 20,
    },
});
export default ShareEventForm;
