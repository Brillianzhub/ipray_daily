import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    Alert,
    Share,
} from 'react-native';
import useBookmarkManager from '../../lib/bookmarkManager';
import useBookmarks from '../../lib/useBookmarks'
import { icons } from '../../constants';
import axios from 'axios';



const BookmarkedScreen = () => {
    const { highlightColors, notes, setSelectedVerseIds, setHighlightColors } = useBookmarkManager();
    const { bookmarkedItems } = useBookmarks();
    const [fetchedPrayers, setFetchedPrayers] = useState([]);

    const [fetchedVerses, setFetchedVerses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('Bible');
    const [visibleDropdown, setVisibleDropdown] = useState(null);

    const handleMenuPress = (id) => {
        setVisibleDropdown(visibleDropdown === id ? null : id);
    };


    const handleShare = async (item) => {
        const shareOptions = {
            message: `${item.book} ${item.chapter}:${item.verse}\n\n${item.text}\n\nIPRAY DAILY`,
        };

        try {
            await Share.share(shareOptions);
            setVisibleDropdown(null);
        } catch (error) {
            console.log('Error sharing:', error);
            Alert.alert('Error', 'Unable to share the content.');
        }
    };


    const fetchFavoritePrayersById = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedFavoritePrayers = await Promise.all(
                bookmarkedItems.map(async (id) => {
                    const response = await axios.get(`https://www.brillianzhub.com/ipray/prayerpoints/${id}`);
                    return response.data;
                })
            );
            setFetchedPrayers(fetchedFavoritePrayers);
        } catch (error) {
            console.error('Error fetching favorite prayers:', error);
            setError('Unable to fetch favorite prayers. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchFavoritePrayersById();
    }, [bookmarkedItems]);

    const handleRemove = (id) => {
        Alert.alert(
            "Confirm Remove",
            "Are you sure you want to remove this verse?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => {
                        const updatedHighlightColors = { ...highlightColors };
                        delete updatedHighlightColors[id];
                        setHighlightColors(updatedHighlightColors);

                        const updatedNotes = { ...notes };
                        delete updatedNotes[id];
                        setFetchedVerses((prevFetchedVerses) =>
                            prevFetchedVerses.filter((verse) => verse.id !== id)
                        );
                        setVisibleDropdown(null);
                    }
                }
            ]
        );
    };

    const fetchVerseById = async (verseId) => {
        try {
            const response = await fetch(`https://www.brillianzhub.com/ipray/bible_verses_kjv/${verseId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const verse = await response.json();
            return verse;
        } catch (error) {
            console.error(`Error fetching verse ${verseId}:`, error);
            throw error;
        }
    };

    const fetchChapterById = async (chapterId) => {
        try {
            const response = await axios.get(`https://www.brillianzhub.com/ipray/bible_chapters/${chapterId}`);
            if (response.status !== 200) {
                throw new Error('Error fetching chapters: ' + response.statusText);
            }
            const chapter = response.data;
            return chapter;
        } catch (error) {
            console.error('Error fetching chapter:', error);
            throw error;
        }
    };



    useEffect(() => {
        const fetchVerses = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedData = await Promise.all(
                    Object.keys(highlightColors).map(async (id) => {
                        const verse = await fetchVerseById(id);
                        const chapter = await fetchChapterById(verse.chapter);
                        return {
                            id,
                            ...verse,
                            book: chapter?.book?.name || 'Unknown Book',
                            chapter: chapter?.number || 'Unknown Chapter',
                            color: highlightColors[id],
                            note: notes[id] || '',
                        };
                    })
                );
                setFetchedVerses(fetchedData);
            } catch (error) {
                console.error('Error fetching verses:', error);
                setError('Unable to fetch verses. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchVerses();
    }, [highlightColors, notes]);



    const clearAllBookmarks = () => {
        Alert.alert(
            "Confirm Clear All",
            "Are you sure you want to clear all bookmarks?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => {
                        setHighlightColors({});
                        setSelectedVerseIds(new Set());
                    }
                }
            ]
        );
    };

    const renderVerseItem = ({ item }) => {
        return <View style={[styles.verseContainer, { backgroundColor: item.color }]}>
            <TouchableOpacity onPress={() => setVisibleDropdown(null)}>
                <View style={styles.headerRow}>
                    <Text style={styles.headerText}>
                        {item.book} {item.chapter}:{item.verse}
                    </Text>
                    <TouchableOpacity onPress={() => handleMenuPress(item.id)}>
                        <Image
                            style={styles.menuIcon}
                            source={icons.menu}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>

                {visibleDropdown === item.id && (
                    <View style={styles.dropdownMenu}>
                        <TouchableOpacity onPress={() => handleShare(item)} style={styles.dropdownButton}>
                            <Text style={styles.dropdownText}>Share</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleRemove(item.id)} style={styles.dropdownButton}>
                            <Text style={styles.dropdownText}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <Text style={styles.verseText}>
                    {item.text}
                </Text>
                {item.note ? <Text style={styles.noteText}>{item.note}</Text> : null}
            </TouchableOpacity>
        </View>
    }

    const renderPrayerItem = ({ item }) => {
        return (
            <View className="border-b border-gray-200">
                <View className="p-3">
                    <Text className="text-lg text-justify">{item.text}</Text>
                    <Text className="text-lg text-orange-400 text-justify">
                        {item.bible_verse}{' '}
                        <Text className="text-lg text-black font-bold italic">{item.bible_quotation}</Text>
                    </Text>
                </View>
            </View>
        );
    };


    const renderListContent = () => {
        if (isLoading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Loading verses...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            );
        }

        const filteredData = activeCategory === 'Bible' ? fetchedVerses : fetchedPrayers;
        const renderItem = activeCategory === 'Bible' ? renderVerseItem : renderPrayerItem;


        if (filteredData.length === 0) {
            return <Text>Your List is Empty!</Text>;
        }

        return (
            <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
        );
    };

    return (
        <View style={styles.container}>
            <View className="flex-row justify-between mb-2">
                <TouchableOpacity
                    style={[styles.button, activeCategory === 'Bible' && styles.activeButton]}
                    onPress={() => setActiveCategory('Bible')}
                >
                    <Text style={styles.buttonText}>Bible</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, activeCategory === 'Prayer' && styles.activeButton]}
                    onPress={() => setActiveCategory('Prayer')}
                >
                    <Text style={styles.buttonText}>Prayer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={clearAllBookmarks}>
                    <Text style={styles.buttonText}>Clear All</Text>
                </TouchableOpacity>
            </View>
            {renderListContent()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        marginTop: 36,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#f0f0f0',
        zIndex: 1000,
    },
    iconContainer: {
        padding: 8,
    },
    icon: {
        width: 24,
        height: 24,
    },
    iconPlaceholder: {
        width: 24,
        height: 24,
    },
    title: {
        fontSize: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 16,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'rgb(253 186 116)',
        borderRadius: 5,
        width: '32%'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    activeButton: {
        backgroundColor: 'rgb(249 115 22)',
    },
    verseContainer: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 6,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    menuIcon: {
        width: 20,
        height: 20,
    },
    verseText: {
        fontSize: 20,
        textAlign: 'justify',
    },
    noteText: {
        fontSize: 16,
        marginTop: 5,
        // fontStyle: 'italic',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
    },
    dropdownMenu: {
        position: 'absolute',
        top: '30%', // Position it below the header row
        right: 0, // Align it to the right
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        padding: 5,
        width: '40%',
        borderColor: '#000', // Add black border color
        borderWidth: 1, // Set border width
        zIndex: 1000, // Ensure it floats above other elements
    },

    dropdownButton: {
        paddingVertical: 5,
    },
    dropdownText: {
        fontSize: 14,
        color: '#007AFF',
    },
});

export default BookmarkedScreen;
