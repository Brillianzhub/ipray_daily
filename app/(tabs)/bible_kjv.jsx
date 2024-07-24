import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    Share,
    Animated
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import BookItem from '../../components/Bible';
import ChapterItem from '../../components/ChapterItem';
import VerseItem from '../../components/VerseItem';
import VerseText from '../../components/VerseText';
import FilterButton from '../../components/FilterButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';

import { icons } from '../../constants';
import ColorButton from '../../components/ColorButtons';

import { useBibleData } from '../../lib/useBibleData';
import useBookmarkManager from '../../lib/bookmarkManager';



function Book() {
    const {
        books, chapters, verses, isLoading, error, selectedBook, setSelectedBook,
        selectedChapter, setSelectedChapter, selectedVersion, setSelectedVersion,
        fetchVerses, setVerses, fetchChapters, setChapters
    } = useBibleData();

    const { selectedVerseIds, setSelectedVerseIds, highlightColors, setHighlightColors,
        toggleSelection, notes, setNotes, showOptions, setShowOptions, showNoteInput,
        setShowNoteInput, handleAddNote, handleSaveNote, resetHighlights, showColorButtons,
        setShowColorButtons, setHighlightColorsForSelection, selectedChapterId,
        setSelectedChapterId } = useBookmarkManager();

    const [filter, setFilter] = useState('all');
    const [open, setOpen] = useState(false);

    const [items, setItems] = useState([
        { label: 'King James Version, KJV', value: 'KJV' },
        { label: 'Amplified Version, AMP', value: 'AMP' },
        { label: 'New International Version, NIV', value: 'NIV' }

    ]);

    const [selectedBookId, setSelectedBookId] = useState(null);
    const [selectedVerse, setSelectedVerse] = useState(null);
    const [nextBookChapters, setNextBookChapters] = useState(null);

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

    const handleBackToBooks = () => {
        setSelectedBook(null);
        setSelectedBookId(null);
        setSelectedChapter(null);
        setSelectedChapterId(null);
        setSelectedVerse(null);
        setShowOptions(false);
        setShowColorButtons(false);
    };

    const filteredBooks = filter === 'all'
        ? books
        : books.filter((book) => {
            if (filter === 'OT') return book.category.title === 'Old Testament';
            if (filter === 'NT') return book.category.title === 'New Testament';
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

    const getItemLayout = (data, index) => (
        { length: 100, offset: 120 * index, index }
    );

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

    const translationX = new Animated.Value(0);

    const handleNextChapter = () => {
        if (selectedChapter && selectedChapter.next_chapter) {
            const nextChapterId = selectedChapter.next_chapter.id;
            const nextChapter = chapters.find(chapter => chapter.id === nextChapterId);
            if (nextChapter) {
                setSelectedChapter(nextChapter);
                setVerses(fetchVerses(nextChapterId));
            }
        }
    };


    const handlePreviousChapter = () => {
        if (selectedChapter && selectedChapter.previous_chapter) {
            const previousChapterId = selectedChapter.previous_chapter.id;
            const previousChapter = chapters.find(chapter => chapter.id === previousChapterId);
            if (previousChapter) {
                setSelectedChapter(previousChapter);
                setVerses(fetchVerses(previousChapterId));
            }
        }
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


    const renderChapterHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={handleBackToBooks} style={styles.headerTextContainer}>
                <Text style={styles.headerText}>
                    {selectedBook ? `${selectedBook.name}${selectedChapter ? ` ${selectedChapter.number}` : ''}` : 'Select a book'}
                </Text>
                <Image
                    source={icons.down}
                    style={styles.headerIcon}
                    resizeMethod="contain"
                />
            </TouchableOpacity>
            <View style={styles.dropdownContainer}>
                <DropDownPicker
                    open={open}
                    value={selectedVersion}
                    items={items}
                    setOpen={setOpen}
                    setValue={setSelectedVersion}
                    setItems={setItems}
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownStyle}
                />
            </View>
        </View>
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.headerContainer}>
                    {renderChapterHeader()}
                </View>
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
                                    contentContainerStyle={styles.flatListContent}
                                    getItemLayout={getItemLayout}
                                />
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
            </SafeAreaView>
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
        paddingTop: 90,  // Add paddingTop to prevent content from being hidden under the fixed header
        paddingHorizontal: 16,
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        width: '100%',
        zIndex: 10,  // Ensure the header is on top of other components
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'rgb(243 244 246)',
        // borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 8,
        marginTop: 40,
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
        paddingBottom: 20,
    },
    bookHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        // backgroundColor: '#f8f8f8',
        padding: 8,
        // paddingHorizontal: 8,
    },
});

export default Book;
