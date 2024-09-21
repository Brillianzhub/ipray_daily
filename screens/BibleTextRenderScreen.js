import React, { useState, useEffect, useCallback, useRef } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, Animated } from "react-native";
import PagerView from "react-native-pager-view";
import bibleData from '../assets/bible_data.json';
import ampData from '../assets/amp_data.json';
import nivData from '../assets/niv_data.json';

import VerseText from "../components/VerseText";
import useBookmarkManager from '../lib/bookmarkManager';
import { useBibleContext } from '../context/BibleContext';
import ColorButton from '../components/ColorButtons';
import useBookCompletion from '../lib/useBookCompletion';


const CHUNK_SIZE = 10;

const BibleTextRender = ({ route, navigation }) => {
    const [allChapters, setAllChapters] = useState([]);
    const [loadedChapters, setLoadedChapters] = useState([]);
    const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

    const [selectedChapterId, setSelectedChapterId] = useState(null);


    const currentChapterId = route.params;
    const { selectedVerse } = route.params;
    // const selectedChapterId = currentChapterId.chapterId.selectedChapterId.chapter_id;
    const chapterIdFromRoute = currentChapterId.chapterId.selectedChapterId.chapter_id;

    const { buttonClicked, setButtonClicked, handleChapterComplete } = useBookCompletion();

    const [isLayoutReady, setIsLayoutReady] = useState(false);

    const pagerViewRef = useRef(null);

    // const [buttonClicked, setButtonClicked] = useState(false);

    const {
        selectedBook,
        selectedChapter,
        selectedVerseNumbers,
        setSelectedVerseNumbers,
        processSelectedChapter,
        selectedVersion
    } = useBibleContext();

    const { selectedVerseIds, setSelectedVerseIds, highlightColors, setHighlightColors,
        toggleSelection, notes, setNotes, showOptions, setShowOptions, showNoteInput, setShowNoteInput,
        handleAddNote, handleSaveNote, resetHighlights, showColorButtons, setShowColorButtons,
        setHighlightColorsForSelection, isSwipeEnabled, setIsSwipeEnabled
    } = useBookmarkManager();


    useEffect(() => {

        let dataSource;
        switch (selectedVersion) {
            case "AMP":
                dataSource = ampData;
                break;
            case "NIV":
                dataSource = nivData;
                break;
            default:
                dataSource = bibleData;
        }

        const chaptersArray = dataSource.flatMap(book =>
            Object.keys(book.chapters).map(chapterNumber => ({
                ...book.chapters[chapterNumber],
                bookName: book.book_name
            }))
        );

        setAllChapters(chaptersArray);

        const initialIndex = chapterIdFromRoute - 1;
        setSelectedChapterId(chapterIdFromRoute);
        setCurrentChapterIndex(initialIndex);
        setButtonClicked(false);

        const loadInitialChapters = () => {
            const start = initialIndex;
            const end = Math.min(chaptersArray.length, start + CHUNK_SIZE);
            setLoadedChapters(chaptersArray.slice(start, end));
        };

        loadInitialChapters();
    }, [chapterIdFromRoute, selectedVersion]);

    const buttonOpacity = useRef(new Animated.Value(0)).current;
    const buttonTranslateX = useRef(new Animated.Value(100)).current;
    const translationX = new Animated.Value(0);



    const handleShare = useCallback(async () => {
        const selectedTexts = Array.from(selectedVerseIds).map(id => {
            const selectedItem = selectedVerseNumbers.find(item => item.verse_id === id);
            return selectedItem ? `\n\n${selectedItem.verse_number}: ${selectedItem.text}` : '';
        }).join('');

        const appUrl = 'https://play.google.com/store/apps/details?id=com.brillianzhub.ipray';

        const shareOptions = {
            message: `${selectedBook.book_name} ${selectedChapter.chapter_number} ${selectedTexts}\n\nCheck out the app: ${appUrl}`,
        };

        try {
            await Share.share(shareOptions);
            setShowOptions(false);
            setShowColorButtons(false);
            setSelectedVerseIds(new Set());
        } catch (error) {
            Alert.alert('Error', 'Unable to share the content.');
        }
    }, [selectedVerseIds, selectedVerseNumbers, selectedBook, selectedChapter]);

    const handlePageChange = ({ nativeEvent }) => {
        const newIndex = nativeEvent.position;
        const newChapter = loadedChapters[newIndex];
        const newChapterId = newChapter?.chapter_id;

        setSelectedChapterId(newChapter.chapter_id);
        setButtonClicked(false);

        if (newChapter) {
            navigation.setOptions({
                title: `${newChapter.bookName} : ${newChapter.chapter_number}`,
            });
        }


        setCurrentChapterIndex(newIndex);
        if (newIndex >= loadedChapters.length - 1) {
            loadMoreChapters(newIndex);
        } else if (newIndex < Math.floor(CHUNK_SIZE / 2)) {
            loadPreviousChapters(newIndex);
        }
    };


    const loadMoreChapters = (currentIndex) => {
        const lastLoadedChapterIndex = allChapters.findIndex(
            (chapter) => chapter.chapter_id === loadedChapters[loadedChapters.length - 1]?.chapter_id
        );

        if (lastLoadedChapterIndex < allChapters.length - 1) {
            const nextStart = lastLoadedChapterIndex + 1;
            const nextEnd = Math.min(allChapters.length, nextStart + CHUNK_SIZE);
            setLoadedChapters([...loadedChapters, ...allChapters.slice(nextStart, nextEnd)]);
        }
    };

    const loadPreviousChapters = (currentIndex) => {
        const firstLoadedChapterIndex = allChapters.findIndex(
            (chapter) => chapter.chapter_id === loadedChapters[0]?.chapter_id
        );

        if (firstLoadedChapterIndex > 0) {
            const prevStart = Math.max(0, firstLoadedChapterIndex - CHUNK_SIZE);
            const prevEnd = firstLoadedChapterIndex;
            setLoadedChapters([
                ...allChapters.slice(prevStart, prevEnd),
                ...loadedChapters
            ]);
        }
    };

    const footerButtonStyle = buttonClicked ? '#ff9800' : '#f67b6b';
    const buttonText = buttonClicked ? 'Reset progress' : 'Mark as complete';


    const handleScroll = ({ nativeEvent }) => {
        const { contentOffset, layoutMeasurement, contentSize } = nativeEvent;
        if (!contentOffset || !layoutMeasurement || !contentSize) {
            return;
        }

        const yOffset = contentOffset.y;
        if (yOffset > 0) {
            setIsSwipeEnabled(false);
        } else {
            setIsSwipeEnabled(true);
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


    const flatListRef = useRef(null);

    const handleOnLayout = () => {
        setIsLayoutReady(true);
    };

    const getItemLayout = (data, index) => ({
        length: 100,
        offset: 120 * index,
        index,
    });


    // console.log(selectedChapterId)

    // const handleChapterComplete = () => {
    //     console.log("Chapter completed: ", selectedChapterId);
    //     setButtonClicked(prevState => !prevState);
    // };

    const handleVerseSelection = (verseId) => {
        setSelectedVerseIds(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(verseId)) {
                newSelected.delete(verseId);
            } else {
                newSelected.add(verseId);
            }
            return newSelected;
        });
    };

    const renderVerseTextItem = useCallback(
        ({ item }) => (
            <VerseText
                item={item}
                id={item.verse_id}
                onPress={toggleSelection}
                highlightColors={highlightColors}
                selectedVerseIds={selectedVerseIds}
                notes={notes}
                setNotes={setNotes}
                showNoteInput={showNoteInput}
                handleSaveNote={handleSaveNote}
                isSelected={selectedVerseIds.has(item.verse_id)}
                isVerseSelected={item.verse_id === selectedVerse.verse_id}
            />
        ),
        [toggleSelection, highlightColors, selectedVerseIds, notes, setNotes, showNoteInput, handleSaveNote, selectedVerse.verse_id]
    );


    return (
        <View style={styles.container}>
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
            <PagerView
                style={styles.pagerView}
                initialPage={currentChapterIndex}
                onPageSelected={handlePageChange}
                scrollEnabled={isSwipeEnabled}
            >
                {loadedChapters.map((chapter) => (
                    <View key={chapter.chapter_id}>
                        <FlatList
                            ref={flatListRef}
                            data={chapter.verses}
                            keyExtractor={(item) => item.verse_id.toString()}
                            renderItem={renderVerseTextItem}
                            onScroll={handleScroll}
                            getItemLayout={getItemLayout}
                            onLayout={handleOnLayout}
                            scrollEventThrottle={16}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                ))}
            </PagerView>
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
                    onPress={handleChapterComplete}
                    style={[styles.footerButton, { backgroundColor: footerButtonStyle }]}
                >
                    <Text style={styles.footerButtonText}>
                        {buttonText}
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

export default BibleTextRender;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    pagerView: {
        flex: 1,
    },
    chapterHeader: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    verseContainer: {
        flexDirection: "row",
        marginBottom: 10,
    },
    verseNumber: {
        fontWeight: "bold",
        marginRight: 10,
    },
    verseText: {
        flex: 1,
        fontSize: 16,
        color: "#333",
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
