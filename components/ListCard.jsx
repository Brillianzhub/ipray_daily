import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';


const ListCard = ({ item, onPress }) => {

    const truncatedText = item.text.length > 150 ? `${item.text.substring(0, 150)}......` : item.text;

    return (
        <TouchableOpacity onPress={() => onPress(item)}>
            <View style={styles.container}>
                <Text style={styles.text}>{truncatedText} {''}
                    <Text className="text-orange-400 text-lg italic">{item.bible_quotation}</Text>
                </Text>
                <View style={styles.separator} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 20,
        textAlign: 'justify',
    },
    separator: {
        height: 1,
        marginBottom: 5,
        marginTop: 5,
        backgroundColor: '#ddd',
    },
});

export default ListCard;
