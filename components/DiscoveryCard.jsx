import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';

const DiscoveryCard = ({ discovery }) => {
    const { title, definition, quotation } = discovery;
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedQuotation, setSelectedQuotation] = useState(null);
    const [activeReference, setActiveReference] = useState(null);

    const handlePress = (quotation, index) => {
        setSelectedQuotation(quotation);
        setActiveReference(index);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedQuotation(null);
        setActiveReference(null);
    };

    return (
        <View className="flex-1 m-2">
            <TouchableOpacity
                className="bg-orange-200 p-5 rounded-lg"
                onPress={() => setModalVisible(true)}
            >
                <Text className="text-xl">{title}</Text>
            </TouchableOpacity>

            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={closeModal}
            >
                <TouchableOpacity
                    className="flex-1 justify-center items-center"
                    activeOpacity={1}
                    onPress={closeModal}
                >
                    <View className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50" />
                    <TouchableOpacity
                        className="bg-white p-6 rounded-lg w-3/4 h-3/4"
                        activeOpacity={1}
                    >
                        <ScrollView>
                            <Text className="text-2xl font-bold mb-6">{title}</Text>
                            {definition && (
                                <Text className="text-base mb-4">{definition}</Text>
                            )}
                            {quotation && quotation.length > 0 && (
                                <View className="mb-4">
                                    <Text className="font-bold mb-2">References:</Text>
                                    {quotation.map((q, index) => (
                                        <TouchableOpacity key={index} onPress={() => handlePress(q, index)}>
                                            <Text className={`text-base mb-1 ${activeReference === index ? 'text-gray-500' : 'text-blue-700'}`}>
                                                {q.reference}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                            {selectedQuotation && (
                                <View className="mb-4">
                                    <Text className="font-bold mb-2">{selectedQuotation.reference}</Text>
                                    <Text className="text-base italic text-orange-400">{selectedQuotation.content}</Text>
                                </View>
                            )}
                        </ScrollView>
                        <TouchableOpacity
                            className="bg-orange-500 p-3 rounded-lg mt-4"
                            onPress={closeModal}
                        >
                            <Text className="text-white text-center">Close</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

export default DiscoveryCard;
