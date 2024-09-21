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
}) => {
    const [tempNote, setTempNote] = useState(notes[id] || '');

    const handleSave = () => {
        setNotes({ ...notes, [id]: tempNote });
        handleSaveNote();
    }

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[
                styles.textStyle,
                { backgroundColor: highlightColors[id] || 'transparent' },
                selectedVerseIds.has(id) && styles.selectedItem
            ]}>
                <Text style={styles.verseText}>
                    <Text style={styles.verseNumber}>{verse}</Text>
                    {' '}
                    <Text style={styles.verseStyle}>
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
        padding: 4,
        marginBottom: 6,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10
    },
    selectedItem: {
        borderColor: '#d3d3d3',
        borderWidth: 1,
    },
    verseText: {
        fontSize: 20,
        lineHeight: 28,
        margin: 0,
        padding: 0,
        textAlign: 'justify',
    },
    verseStyle: {
        color: 'black'
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
        flexDirection: 'row',
        alignItems: 'center',
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
    noteStyle: {
        fontSize: 16,
        textAlign: 'justify',
    }
});

export default VerseText;