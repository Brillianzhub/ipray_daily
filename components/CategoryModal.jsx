import React from 'react';
import { Modal, View, Text, TouchableHighlight, Button, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const CategoryModal = ({ visible, categories, onSelectCategory, onClose }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className='flex-1 justify-center items-center'>
                <TouchableOpacity
                    className='absolute top-0 left-0 right-0 bottom-0 bg-black opacity-60'
                    activeOpacity={0.7}
                    onPress={onClose}
                />
                <View className='w-4/5 bg-white rounded-2xl p-5 shadow-lg max-h-4/5'>
                    <TouchableOpacity>
                        <View className='max-h-80'>
                            <Text className='mb-4 text-center text-lg font-bold'>Select a Category</Text>
                            <ScrollView>
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <TouchableHighlight
                                            key={category.id}
                                            onPress={() => onSelectCategory(category)}
                                            underlayColor="#d3d3d3"
                                            className='p-3 bg-gray-200 my-1 rounded-lg w-full'
                                        >
                                            <Text className='text-center'>{category.title}</Text>
                                        </TouchableHighlight>
                                    ))
                                ) : (
                                    <Text className='text-center'>No categories available</Text>
                                )}
                            </ScrollView>
                            <View className="w-full h-12 bg-sky-600 justify-center rounded-lg mt-4">
                                <TouchableOpacity onPress={onClose}>
                                    <Text className="text-center text-white font-bold text-xl">Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default CategoryModal;
