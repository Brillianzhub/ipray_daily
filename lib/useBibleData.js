import { useState, useEffect, useRef } from 'react';
import bibleBooks from '../assets/bible_books.json';
import bibleChapters from '../assets/bible_chapters.json';
import kjvVerses from '../assets/verses_kjv.json';
import ampVerses from '../assets/verses_amp.json';
import nivVerses from '../assets/verses_niv.json';


const getVersesData = (version) => {
    switch (version) {
        case 'KJV':
            return kjvVerses;
        case 'AMP':
            return ampVerses;
        case 'NIV':
            return nivVerses;
        default:
            return [];
    }
};


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
    const [selectedVerse, setSelectedVerse] = useState(null);
    const [selectedBookId, setSelectedBookId] = useState(null);

    const fetchIdRef = useRef(0);

    const fetchBooks = () => {
        setBooks(bibleBooks);
    };

    const fetchChapters = (bookId) => {
        const currentFetchId = ++fetchIdRef.current;
        const filteredChapters = bibleChapters.filter(chapter => chapter.book === bookId);

        setTimeout(() => {
            if (currentFetchId === fetchIdRef.current) {
                setChapters(filteredChapters);
            }
        }, 0);
    };

    const fetchVerses = (chapterId) => {
        const currentFetchId = ++fetchIdRef.current;
        const versesData = getVersesData(selectedVersion);
        const filteredVerses = versesData.filter(verse => verse.chapter === chapterId);

        setTimeout(() => {
            if (currentFetchId === fetchIdRef.current) {
                setVerses(filteredVerses);
            }
        }, 0);
    };

    const fetchVerseById = (verseId) => {
        setIsLoading(true);
        setError(null);

        const currentFetchId = ++fetchIdRef.current;
        const versesData = getVersesData(selectedVersion);
        const foundVerse = versesData.find(verse => verse.id === verseId);

        setTimeout(() => {
            if (currentFetchId === fetchIdRef.current) {
                setVerse(foundVerse);
                setIsLoading(false);
            }
        }, 0);
    };

    const loadNextChapter = () => {
        if (!selectedBook || !selectedChapter) return;

        const currentChapterIndex = chapters.findIndex(
            (chapter) => chapter.id === selectedChapter.id
        );

        if (currentChapterIndex < chapters.length - 1) {
            const nextChapter = chapters[currentChapterIndex + 1];
            setSelectedChapter(nextChapter);
        } else {
            const nextBookIndex = books.findIndex(
                (book) => book.id === selectedBook.id
            ) + 1;

            if (nextBookIndex < books.length) {
                const nextBook = books[nextBookIndex];
                setSelectedBook(nextBook);

                const firstChapter = bibleChapters.find(
                    (chapter) => chapter.book === nextBook.id && chapter.number === 1
                );
                setSelectedChapter(firstChapter);
            }
        }
    };


    const loadPreviousChapter = () => {
        if (!selectedBook || !selectedChapter) return;

        const currentChapterIndex = chapters.findIndex(
            (chapter) => chapter.id === selectedChapter.id
        );

        if (currentChapterIndex > 0) {
            const previousChapter = chapters[currentChapterIndex - 1];
            setSelectedChapter(previousChapter);
        } else {
            const previousBookIndex = books.findIndex(
                (book) => book.id === selectedBook.id
            ) - 1;

            if (previousBookIndex >= 0) {
                const previousBook = books[previousBookIndex];
                setSelectedBook(previousBook);

                const previousBookChapters = bibleChapters.filter(
                    (chapter) => chapter.book === previousBook.id
                );
                const lastChapter = previousBookChapters[previousBookChapters.length - 1];
                setSelectedChapter(lastChapter);
            }
        }
    };


    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        if (selectedBook) {
            fetchChapters(selectedBook.id);
        } else {
            setChapters([]);
        }
    }, [selectedBook]);

    useEffect(() => {
        if (selectedChapter) {
            fetchVerses(selectedChapter.id);
        } else {
            setVerses([]);
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
        fetchChapters,
        selectedVerse,
        setSelectedVerse,
        selectedBookId,
        setSelectedBookId,
        loadNextChapter,
        loadPreviousChapter
    };
};
