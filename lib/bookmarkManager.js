import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const useBookmarkManager = () => {
    const [selectedVerseIds, setSelectedVerseIds] = useState(new Set());
    const [highlightColors, setHighlightColors] = useState({});
    const [notes, setNotes] = useState({});
    const [showOptions, setShowOptions] = useState(false);
    const [showNoteInput, setShowNoteInput] = useState(false);
    const [showColorButtons, setShowColorButtons] = useState(false);
    const [selectedChapterId, setSelectedChapterId] = useState(null);
    const [isSwipeEnabled, setIsSwipeEnabled] = useState(true);


    useEffect(() => {
        const loadState = async () => {
            try {
                const [
                    savedHighlightColors,
                    savedSelectedVerseIds,
                    savedNotes,
                    savedSelectedChapterId
                ] = await Promise.all([
                    AsyncStorage.getItem('highlightColors'),
                    AsyncStorage.getItem('selectedVerseIds'),
                    AsyncStorage.getItem('notes'),
                    AsyncStorage.getItem('selectedChapterId')
                ]);

                if (savedHighlightColors) {
                    setHighlightColors(JSON.parse(savedHighlightColors));
                }
                if (savedSelectedVerseIds) {
                    setSelectedVerseIds(new Set(JSON.parse(savedSelectedVerseIds)));
                }
                if (savedNotes) {
                    setNotes(JSON.parse(savedNotes));
                }
                if (savedSelectedChapterId) {
                    setSelectedChapterId(JSON.parse(savedSelectedChapterId));
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to load saved state');
            }
        };

        loadState();
    }, [setHighlightColors, setSelectedVerseIds, setNotes, setSelectedChapterId]);


    useEffect(() => {
        const saveState = async () => {
            try {
                await Promise.all([
                    AsyncStorage.setItem('highlightColors', JSON.stringify(highlightColors)),
                    AsyncStorage.setItem('selectedVerseIds', JSON.stringify(Array.from(selectedVerseIds))),
                    AsyncStorage.setItem('notes', JSON.stringify(notes)),
                    AsyncStorage.setItem('selectedChapterId', JSON.stringify(selectedChapterId))
                ]);
            } catch (error) {
                Alert.alert('Error', 'Failed to save state');
            }
        };

        saveState();
    }, [highlightColors, selectedVerseIds, notes, selectedChapterId]);


    const toggleSelection = (id) => {
        const newSelectedVerseIds = new Set(selectedVerseIds); // Correct variable name
        if (newSelectedVerseIds.has(id)) {
            newSelectedVerseIds.delete(id); // Deselect if already selected
        } else {
            newSelectedVerseIds.add(id); // Select the verse
        }

        setIsSwipeEnabled(newSelectedVerseIds.size === 0); // Use the correct variable name here
        setSelectedVerseIds(newSelectedVerseIds); // Update selected verses state
        setShowOptions(newSelectedVerseIds.size > 0); // Show options if any verse is selected
        setShowNoteInput(false); // Hide note input when selecting/deselecting verses
    };


    const handleAddNote = () => {
        setShowNoteInput(true);
    };

    const handleSaveNote = () => {
        setShowNoteInput(false);
        setShowOptions(false);
        setSelectedVerseIds(new Set());
    };

    const resetHighlights = () => {
        const newHighlightColors = { ...highlightColors };
        selectedVerseIds.forEach(id => {
            delete newHighlightColors[id];
        });
        setHighlightColors(newHighlightColors);
        setSelectedVerseIds(new Set());
        setShowOptions(false);
        setShowColorButtons(false);
    };


    const setHighlightColorsForSelection = (color) => {
        const newHighlightColors = { ...highlightColors };
        selectedVerseIds.forEach(id => {
            newHighlightColors[id] = color;
        });
        setHighlightColors(newHighlightColors);
        setSelectedVerseIds(new Set());
        setShowColorButtons(false);
        setShowOptions(false);
    };

    return {
        selectedVerseIds,
        setSelectedVerseIds,
        highlightColors,
        setHighlightColors,
        notes,
        setNotes,
        toggleSelection,
        showOptions,
        setShowOptions,
        showNoteInput,
        setShowNoteInput,
        handleAddNote,
        handleSaveNote,
        resetHighlights,
        showColorButtons,
        setShowColorButtons,
        setHighlightColorsForSelection,
        setSelectedChapterId,
        isSwipeEnabled,
        setIsSwipeEnabled
    };
};

export default useBookmarkManager;
