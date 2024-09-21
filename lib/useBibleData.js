import { useState, useEffect } from 'react';
import bibleData from '../assets/bible_data.json';
import ampData from '../assets/amp_data.json';
import nivData from '../assets/niv_data.json';

export const useBibleData = () => {
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [selectedVerse, setSelectedVerse] = useState(null);
    const [selectedBookId, setSelectedBookId] = useState(null);
    const [selectedVerseNumbers, setSelectedVerseNumbers] = useState(null);

    const [allChapters, setAllChapters] = useState([]);

    const [selectedVersion, setSelectedVersion] = useState('KJV');


    const getBibleDataByVersion = () => {
        switch (selectedVersion) {
            case 'AMP':
                return ampData;
            case 'NIV':
                return nivData;
            case 'KJV':
            default:
                return bibleData;
        }
    };

    const fetchBooks = () => {
        const bibleDataByVersion = getBibleDataByVersion();
        const booksInfo = bibleDataByVersion.map(book => ({
            book_name: book.book_name,
            book_id: book.book_id,
            category: book.category,
        }));
        setBooks(booksInfo);
    };


    useEffect(() => {
        const fetchAllChapters = () => {
            const allChapter = [];

            bibleData.forEach(book => {
                const bookChapters = Object.values(book.chapters).map(chapter => ({
                    chapter_id: chapter.chapter_id,
                    chapter_number: chapter.chapter_number,
                    verses: chapter.verses
                }));
                allChapter.push(...bookChapters);
            })
            return allChapter;
        };
        const chaptersData = fetchAllChapters();
        setAllChapters(chaptersData);
    }, [])


    useEffect(() => {
        const bibleDataByVersion = getBibleDataByVersion();
        if (selectedBook) {
            const book = bibleDataByVersion.find(b => b.book_id === selectedBook.book_id || b.book_name === selectedBook.book_name);
            const chapterNumbers = Object.values(book.chapters).map(chapter => ({
                chapter_number: chapter.chapter_number,
                chapter_id: chapter.chapter_id,
                verses: chapter.verses
            }));
            setChapters(chapterNumbers);
        } else {
            setChapters([]);
        }
    }, [selectedBook]);


    const processSelectedChapter = (selectedChapter, setSelectedVerseNumbers) => {
        if (selectedChapter) {
            const verseNumbers = Object.values(selectedChapter.verses).map(verse => ({
                verse_id: verse.verse_id,
                verse_number: verse.verse_number,
                verse_text: verse.text
            }));
            setSelectedVerseNumbers(verseNumbers);
        } else {
            setSelectedVerseNumbers([]);
        }
    };


    useEffect(() => {
        fetchBooks();
    }, [selectedVersion]);


    return {
        books,
        chapters,
        selectedBook,
        setSelectedBook,
        selectedChapter,
        setSelectedChapter,
        selectedVerse,
        setSelectedVerse,
        selectedBookId,
        setSelectedBookId,
        selectedVersion,
        setSelectedVersion,
        selectedVerseNumbers,
        setSelectedVerseNumbers,
        processSelectedChapter,
        allChapters, 
        setAllChapters
    };
};
