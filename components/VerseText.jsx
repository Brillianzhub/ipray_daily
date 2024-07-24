import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native';
import { icons } from '../constants';

const VerseText = ({
    verse,
    text,
    id,
    onPress,
    highlightColors,
    selectedVerseIds,
    notes,
    setNotes,
    showNoteInput,
    handleSaveNote,
    onNext, onPrevious
}) => {
    const [tempNote, setTempNote] = useState(notes[id] || '');

    const handleSave = () => {
        setNotes({ ...notes, [id]: tempNote });
        handleSaveNote();
    }

    const handleGesture = (event) => {
        if (event.nativeEvent.state === State.END) {
            if (event.nativeEvent.translationX < -50) {
                onNext();
            } else if (event.nativeEvent.translationX > 50) {
                onPrevious();
            }
        }
    };


    return (
        <TouchableOpacity onPress={onPress} style={{ marginTop: 0 }}>
            <View style={[
                styles.textStyle,
                { backgroundColor: highlightColors[id] || 'transparent' },
                selectedVerseIds.has(id) && styles.selectedItem
            ]}>
                <Text style={styles.verseText}>
                    <Text style={styles.verseNumber}>{verse}</Text>
                    <Text>  </Text>
                    <Text className="text-black text-xl">
                        {text}
                    </Text>

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
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    textStyle: {
        fontSize: 20,
        textAlign: 'justify',
        padding: 8,
        marginBottom: 6,

        borderTopRightRadius: 10,
        borderBottomRightRadius: 10
    },
    selectedItem: {
        borderColor: '#d3d3d3',
        borderWidth: 1,
    },
    verseText: {
        fontSize: 24,
        marginBottom: 5,
        textAlign: 'justify',
    },
    noteContainer: {
        padding: 10,
    },
    noteInput: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
        fontSize: 16,
        fontFamily: 'Roboto',
    },
    noteRow: {
        flexDirection: 'row', // Arrange items in a row
        alignItems: 'center', // Center align items vertically
    },
    noteButtonText: {
        color: '#fff',
    },
    noteButton: {
        backgroundColor: '#dcdcdc',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    noteButtonImage: {
        width: 24,
        height: 24,
    },
    verseNumber: {
        color: 'orange',
    },
    verseContent: {
        paddingLeft: 20,
        flexShrink: 1,  // This helps ensure the text justifies correctly within the available space
    },
    noteStyle: {
        fontSize: 16,
        // marginTop: ,
        // fontStyle: 'italic',
        // color: '#C11403',
    }
});

export default VerseText;
