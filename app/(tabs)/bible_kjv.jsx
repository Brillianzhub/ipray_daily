import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Share,
    Animated,
} from 'react-native';
import BookItem from '../../components/Bible';
import ChapterItem from '../../components/ChapterItem';
import VerseItem from '../../components/VerseItem';
import VerseText from '../../components/VerseText';
import FilterButton from '../../components/FilterButton';
import { GestureHandlerRootView, PanGestureHandler, State, Swipeable } from 'react-native-gesture-handler';

import ColorButton from '../../components/ColorButtons';

import useBookmarkManager from '../../lib/bookmarkManager';

import useBookCompletion from '../../lib/useBookCompletion';
import { useRoute } from '@react-navigation/native';
import { useBibleContext } from '../../context/BibleContext';


function Book() {
    const {
        books, chapters, verses, isLoading, error, selectedBook, setSelectedBook,
        selectedChapter, setSelectedChapter, selectedVersion, selectedVerse,
        setSelectedVerse, fetchVerses, setVerses, selectedBookId, setSelectedBookId, loadNextChapter,
        loadPreviousChapter
    } = useBibleContext();


    const { selectedVerseIds, setSelectedVerseIds, highlightColors, setHighlightColors,
        toggleSelection, notes, setNotes, showOptions, setShowOptions, showNoteInput,
        setShowNoteInput, handleAddNote, handleSaveNote, resetHighlights, showColorButtons,
        setShowColorButtons, setHighlightColorsForSelection, selectedChapterId,
        setSelectedChapterId } = useBookmarkManager();

    const { handleChapterComplete, buttonClicked } = useBookCompletion();

    const [filter, setFilter] = useState('all');

    const route = useRoute();


    const versesListRef = useRef(null);

    const handleShare = async () => {
        const selectedTexts = Array.from(selectedVerseIds).map(id => {
            const selectedItem = verses.find(item => item.id === id);
            return selectedItem ? `\n\n${selectedItem.verse}: ${selectedItem.text}` : '';
        }).join('');

        const shareOptions = {
            message: `${selectedBook.name} ${selectedChapter.number} ${selectedTexts}`,
        };

        try {
            await Share.share(shareOptions);
            setShowOptions(false);
            setShowColorButtons(false);
            setSelectedVerseIds(new Set());
        } catch (error) {
            console.log('Error sharing:', error);
            Alert.alert('Error', 'Unable to share the content.');
        }
    };



    const handleBookPress = (book) => {
        if (selectedBookId === book.id) {
            setSelectedChapter(null);
            setSelectedChapterId(null);
        }
        setSelectedBook(book);
        setSelectedBookId(book.id);
    };

    const handleChapterPress = (chapter) => {
        setSelectedChapter(chapter);
        setSelectedChapterId(chapter.id);
    };

    const handleVersePress = (verse) => {
        setSelectedVerse(verse);
    };

    useEffect(() => {
        if (selectedBook === null) {
            setSelectedChapterId(null);
            setShowOptions(false);
            setShowColorButtons(false);
        }
    }, [selectedBook]);


    const filteredBooks = filter === 'all'
        ? books
        : books.filter((book) => {
            if (filter === 'OT') return book.category === 'Old Testament';
            if (filter === 'NT') return book.category === 'New Testament';
            return false;
        });

    const handleFilterPress = (newFilter) => {
        setFilter(newFilter);
    };


    useEffect(() => {
        if (selectedVerse && versesListRef.current) {
            versesListRef.current.scrollToIndex({
                index: selectedVerse.verse - 1,
                animated: true
            });
        }
    }, [selectedVerse]);

    const getItemLayout = (data, index) => ({
        length: 100,
        offset: 120 * index,
        index,
    });


    const buttonOpacity = useRef(new Animated.Value(0)).current;
    const buttonTranslateX = useRef(new Animated.Value(100)).current;
    const translationX = new Animated.Value(0);


    const handleScroll = (event) => {
        const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;

        if (!contentOffset || !layoutMeasurement || !contentSize) {
            return;
        }

        const isCloseToBottom =
            contentOffset.y + layoutMeasurement.height >= contentSize.height - 50;

        Animated.parallel([
            Animated.timing(buttonOpacity, {
                toValue: isCloseToBottom ? 1 : 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(buttonTranslateX, {
                toValue: isCloseToBottom ? 0 : 100,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };


    const renderVerseTextItem = useCallback(
        ({ item }) => (
            <VerseText
                verse={item.verse}
                text={item.text}
                note={item.note}
                id={item.id}
                onPress={() => toggleSelection(item.id)}
                highlightColors={highlightColors}
                selectedVerseIds={selectedVerseIds}
                notes={notes}
                setNotes={setNotes}
                showNoteInput={showNoteInput}
                handleSaveNote={handleSaveNote}
            />
        ),
        [
            toggleSelection,
            highlightColors,
            selectedVerseIds,
            notes,
            setNotes,
            showNoteInput,
            handleSaveNote,
        ]
    );

    const renderVerseItem = useCallback(
        ({ item }) => (
            <VerseItem
                verse={item}
                onPress={() => handleVersePress(item)}
            />
        ),
        [handleVersePress]
    );

    const renderBookHeader = () => (
        <View style={styles.bookHeader}>
            <FilterButton
                title="All"
                onPress={() => handleFilterPress('all')}
                isSelected={filter === 'all'} />
            <FilterButton
                title="OT"
                onPress={() => handleFilterPress('OT')}
                isSelected={filter === 'OT'} />
            <FilterButton
                title="NT"
                onPress={() => handleFilterPress('NT')}
                isSelected={filter === 'NT'} />
        </View>
    );


    const handleNextChapter = () => {
        loadNextChapter();
    };


    const handlePreviousChapter = () => {
        loadPreviousChapter();
    };


    const handleGesture = (event) => {
        if (event.nativeEvent.state === State.END) {
            const { translationX: finalTranslationX } = event.nativeEvent;
            if (finalTranslationX < -50) {
                handleNextChapter();
            } else if (finalTranslationX > 50) {
                handlePreviousChapter();
            }
            translationX.setValue(0);
        }
    };

    const footerButtonStyle = buttonClicked ? '#ff9800' : '#f67b6b';
    const buttonText = buttonClicked ? 'Reset progress' : 'Mark as complete';


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.safeArea}>

                <View style={styles.container}>
                    {isLoading && <ActivityIndicator size="large" />}
                    {error && <Text style={{ color: 'red' }}>{error}</Text>}
                    {!isLoading && !error && books.length === 0 && <Text>No books available.</Text>}

                    {showOptions && !showColorButtons && (
                        <View style={styles.options}>
                            <TouchableOpacity
                                style={styles.optionButton}
                                onPress={() => setShowColorButtons(true)}
                            >
                                <Text style={styles.optionButtonText}>Bookmark</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.optionButton}
                                onPress={handleAddNote}
                            >
                                <Text style={styles.optionButtonText}>Note</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.optionButton}
                                onPress={handleShare}
                            >
                                <Text style={styles.optionButtonText}>Share</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.optionButton}
                                onPress={resetHighlights}
                            >
                                <Text style={styles.optionButtonText}>Reset</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {showColorButtons && (
                        <View style={styles.colorOptions}>
                            <ColorButton color="#EAC8C0" onPress={() => setHighlightColorsForSelection("#EAC8C0")} />
                            <ColorButton color="#E3EAC0" onPress={() => setHighlightColorsForSelection("#E3EAC0")} />
                            <ColorButton color="#87CEEB" onPress={() => setHighlightColorsForSelection("#87CEEB")} />
                            <ColorButton color="#98FB98" onPress={() => setHighlightColorsForSelection("#98FB98")} />
                            <ColorButton color="#C0EAE8" onPress={() => setHighlightColorsForSelection("#C0EAE8")} />
                            <ColorButton color="#F2EDDC" onPress={() => setHighlightColorsForSelection("#F2EDDC")} />
                            <ColorButton color="#FFA07A" onPress={() => setHighlightColorsForSelection("#FFA07A")} />
                        </View>
                    )}
                    {selectedVerse ? (
                        <PanGestureHandler
                            failOffsetY={[-5, 5]}
                            activeOffsetX={[-5, 5]}
                            onHandlerStateChange={handleGesture}
                        >
                            <View style={styles.listContainer}>
                                <FlatList
                                    ref={versesListRef}
                                    data={verses}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={renderVerseTextItem}
                                    contentContainerStyle={styles.verseListContent}
                                    getItemLayout={getItemLayout}
                                    onScroll={handleScroll}
                                    scrollEventThrottle={16}
                                />
                                <Animated.View
                                    style={[
                                        styles.footer,
                                        {
                                            opacity: buttonOpacity,
                                            transform: [{ translateX: buttonTranslateX }]
                                        }
                                    ]}
                                >
                                    <TouchableOpacity
                                        onPress={() => handleChapterComplete(selectedChapter.id)}
                                        style={[styles.footerButton, { backgroundColor: footerButtonStyle }]}
                                    >
                                        <Text style={styles.footerButtonText}>
                                            {buttonText}
                                        </Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            </View>
                        </PanGestureHandler>
                    ) : selectedChapter ? (
                        <View style={styles.listContainer}>
                            <FlatList
                                data={verses}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={renderVerseItem}
                                key="verses"
                                numColumns={6}
                                contentContainerStyle={styles.flatListContent}
                            />
                        </View>
                    ) : selectedBook ? (
                        <View style={styles.listContainer}>
                            <FlatList
                                data={chapters}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => <ChapterItem chapter={item} onPress={() => handleChapterPress(item)} />}
                                key="chapters"
                                numColumns={6}
                                contentContainerStyle={styles.flatListContent}
                            />
                        </View>
                    ) : (
                        <View>
                            <FlatList
                                data={filteredBooks}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => <BookItem item={item} onPress={handleBookPress} />}
                                key="books"
                                numColumns={2}
                                ListHeaderComponent={renderBookHeader}
                                contentContainerStyle={styles.flatListContent}
                            />
                        </View>
                    )}
                </View>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        paddingTop: 10,
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f0f0f0',
    },
    headerTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    headerIcon: {
        width: 24,
        height: 24,
    },
    dropdownContainer: {
        width: 200,
    },
    dropdown: {
        backgroundColor: '#fafafa',
    },
    dropdownStyle: {
        backgroundColor: '#fafafa',
    },
    options: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    optionButton: {
        flex: 1,
        backgroundColor: '#00BFFF',
        alignItems: 'center',
        paddingVertical: 10,
        marginHorizontal: 4,
        borderRadius: 8,
    },
    optionButtonText: {
        color: 'white',
        fontSize: 16,
    },
    colorOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 8,
        marginBottom: 16,
    },
    listContainer: {
        flex: 1,
    },
    flatListContent: {
        paddingBottom: 15,
    },
    verseListContent: {
        paddingBottom: 50,
    },
    bookHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 0,
        marginHorizontal: 16
    },

    footer: {
        position: 'absolute',
        bottom: 15,
        right: 10,
        backgroundColor: '#fff',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderRadius: 6,
        alignItems: 'flex-end',
    },
    footerButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6,
        backgroundColor: 'rgb(253 186 116)',
    },
    footerButtonText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#fff',
    }
});

export default Book;
