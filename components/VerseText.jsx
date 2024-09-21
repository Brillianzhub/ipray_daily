import { StyleSheet, Text, View, Pressable, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { icons } from '../constants';

const VerseText = ({
    item,
    onPress,
    isSelected,
    isVerseSelected,
    id,
    highlightColors,
    selectedVerseIds,
    notes,
    setNotes,
    showNoteInput,
    handleSaveNote,
}) => {

    const [tempNote, setTempNote] = useState(notes[id] || '');

    const [pressStartX, setPressStartX] = useState(0);
    const [pressStartY, setPressStartY] = useState(0);

    const SWIPE_THRESHOLD = 10;

    const handlePressIn = (e) => {
        setPressStartX(e.nativeEvent.pageX);
        setPressStartY(e.nativeEvent.pageY);
    };

    const handlePressOut = (e) => {
        const pressEndX = e.nativeEvent.pageX;
        const pressEndY = e.nativeEvent.pageY;

        const deltaX = Math.abs(pressEndX - pressStartX);
        const deltaY = Math.abs(pressEndY - pressStartY);

        if (deltaX < SWIPE_THRESHOLD && deltaY < SWIPE_THRESHOLD) {
            onPress(item.verse_id);
        }
    };

    const handleSave = () => {
        setNotes({ ...notes, [id]: tempNote });
        handleSaveNote();
    }
    return (

        <View style={styles.textStyle}>
            <Pressable
                style={[
                    styles.textStyle,
                    isVerseSelected && styles.selected,
                    { backgroundColor: highlightColors[id] || 'transparent' },
                    selectedVerseIds.has(id) && styles.selectedItem,
                ]}
            // android_ripple={{ color: '#dddddd' }}
            // onPress={() => onPress(item.verse_id)}
            // onPressIn={handlePressIn}
            // onPressOut={handlePressOut}
            >
                <Text style={styles.verseText}>
                    <Text style={styles.verseNumber}>{item.verse_number}</Text>
                    <Text>  </Text>
                    <Text style={styles.verseStyle}>{item.text}</Text>
                </Text>
                {notes[id] && (
                    <Text style={styles.noteStyle}>
                        {notes[id]}
                    </Text>
                )}

                {selectedVerseIds.has(id) && showNoteInput && (
                    <View style={styles.noteContainer}>
                        <View style={styles.noteRow}>
                            <TextInput
                                style={styles.noteInput}
                                placeholder="Type your note here..."
                                value={tempNote}
                                onChangeText={setTempNote}
                            />
                            <TouchableOpacity
                                style={styles.noteButton}
                                onPress={handleSave}
                            >
                                <Image
                                    source={icons.checkmark}
                                    style={styles.noteButtonImage}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

            </Pressable>
        </View>
    );
};

export default VerseText;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
    },
    textStyle: {
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 4,
    },
    verseNumber: {
        color: '#EA540C',
        fontSize: 18,
    },
    verseText: {
        fontSize: 24,
        lineHeight: 32,
    },
    verseStyle: {
        color: 'black',
    },
    selected: {
        backgroundColor: '#e0f7fa',
    },
    selectedItem: {
        backgroundColor: '#dddddd'
    },
    selectedVerse: {
        backgroundColor: '#e0f7fa',
    },
    noteContainer: {
        // padding: 10
    },
});
