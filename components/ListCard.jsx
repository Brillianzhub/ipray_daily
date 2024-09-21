import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';


const ListCard = ({ item, onPress }) => {

    const truncatedText = item.text.length > 150 ? `${item.text.substring(0, 150)}......` : item.text;

    return (
        <View style={styles.container}>
            <Pressable
                onPress={() => onPress(item)}
                android_ripple={{ color: '#dddddd' }}
            >
                <Text style={styles.text}>{truncatedText} {''}
                    <Text className="text-orange-400 text-lg italic">{item.bible_quotation}</Text>
                </Text>
            </Pressable>

            <View style={styles.separator} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 20,
        textAlign: 'justify',
        paddingHorizontal: 14,
        marginBottom: 10,
        marginTop: 10,
    },
    separator: {
        height: 1,
        backgroundColor: '#ddd',
    },
});

export default ListCard;
