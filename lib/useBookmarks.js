import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useBookmarks = (itemId) => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [bookmarkedItems, setBookmarkedItems] = useState([]);

    useEffect(() => {
        const fetchBookmarkedItems = async () => {
            try {
                const bookmarks = await AsyncStorage.getItem('bookmarkedItems');
                const bookmarkList = bookmarks ? JSON.parse(bookmarks) : [];
                setBookmarkedItems(bookmarkList);
            } catch (error) {
                console.error('Error fetching bookmarked items', error);
            }
        };

        fetchBookmarkedItems();
    }, []);

    useEffect(() => {
        const fetchBookmarkStatus = async () => {
            try {
                const bookmarks = await AsyncStorage.getItem('bookmarkedItems');
                const bookmarkList = bookmarks ? JSON.parse(bookmarks) : [];
                setIsBookmarked(bookmarkList.includes(itemId));
            } catch (error) {
                console.error('Error fetching bookmark status', error);
            }
        };

        fetchBookmarkStatus();
    }, [itemId]);


    const handleBookmarkToggle = useCallback(async () => {
        try {
            const newBookmarkStatus = !isBookmarked;
            setIsBookmarked(newBookmarkStatus);

            const bookmarks = await AsyncStorage.getItem('bookmarkedItems');
            let bookmarkList = bookmarks ? JSON.parse(bookmarks) : [];

            if (newBookmarkStatus) {
                if (!bookmarkList.includes(itemId)) {
                    bookmarkList.push(itemId);
                }
            } else {
                bookmarkList = bookmarkList.filter(id => id !== itemId);
            }

            await AsyncStorage.setItem('bookmarkedItems', JSON.stringify(bookmarkList));
        } catch (error) {
            console.error('Error updating bookmarks', error);
        }
    }, [isBookmarked, itemId]);

    return {
        isBookmarked,
        bookmarkedItems,
        handleBookmarkToggle
    };
};

export default useBookmarks;
