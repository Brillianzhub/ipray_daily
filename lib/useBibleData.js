import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllBooks, getChaptersByBookId, getVersesByChapterId, getVerseById } from './brillianzhub';

export const useBibleData = () => {
    const [books, setBooks] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [verses, setVerses] = useState([]);
    const [verse, setVerse] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [selectedVersion, setSelectedVersion] = useState('KJV');

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const cachedBooks = await AsyncStorage.getItem('books');
            if (cachedBooks) {
                setBooks(JSON.parse(cachedBooks));
            } else {
                const fetchedBooks = await getAllBooks();
                setBooks(fetchedBooks);
                await AsyncStorage.setItem('books', JSON.stringify(fetchedBooks));
            }
        } catch (error) {
            setError('Unable to fetch books. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchChapters = async (bookId) => {
        setIsLoading(true);
        setError(null);
        try {
            const cachedChapters = await AsyncStorage.getItem(`chapters-${bookId}`);
            if (cachedChapters) {
                setChapters(JSON.parse(cachedChapters));
            } else {
                const fetchedChapters = await getChaptersByBookId(bookId);
                setChapters(fetchedChapters);
                await AsyncStorage.setItem(`chapters-${bookId}`, JSON.stringify(fetchedChapters));
            }
        } catch (error) {
            setError('Unable to fetch chapters. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchVerses = async (chapterId) => {
        setIsLoading(true);
        setError(null);
        try {
            const cachedVerses = await AsyncStorage.getItem(`verses-${chapterId}-${selectedVersion}`);
            if (cachedVerses) {
                setVerses(JSON.parse(cachedVerses));
            } else {
                const fetchedVerses = await getVersesByChapterId(chapterId, selectedVersion);
                setVerses(fetchedVerses);
                await AsyncStorage.setItem(`verses-${chapterId}-${selectedVersion}`, JSON.stringify(fetchedVerses));
            }
        } catch (error) {
            setError('Unable to fetch verses. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchVerseById = async (verseId) => {
        setIsLoading(true);
        setError(null);
        try {
            const cachedVerse = await AsyncStorage.getItem(`verse-${verseId}`);
            if (cachedVerse) {
                setVerse(JSON.parse(cachedVerse));
            } else {
                const fetchedVerse = await getVerseById(verseId);
                setVerse(fetchedVerse);
                await AsyncStorage.setItem(`verse-${verseId}`, JSON.stringify(fetchedVerse));
            }
        } catch (error) {
            setError('Unable to fetch verse. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedBook) {
            fetchChapters(selectedBook.id);
        }
    }, [selectedBook]);

    useEffect(() => {
        if (selectedChapter) {
            fetchVerses(selectedChapter.id);
        }
    }, [selectedChapter, selectedVersion]);

    return {
        books,
        chapters,
        setChapters,
        verses,
        setVerses,
        isLoading,
        error,
        selectedBook,
        setSelectedBook,
        selectedChapter,
        setSelectedChapter,
        selectedVersion,
        setSelectedVersion,
        fetchVerseById,
        fetchVerses,
        fetchChapters
    };
};
