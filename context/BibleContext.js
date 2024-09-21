import React, { createContext, useContext } from 'react'
import { useBibleData } from '../lib/useBibleData'


const BibleContext = createContext();


export const useBibleContext = () => useContext(BibleContext)

const BibleProvider = ({ children }) => {

    const {
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
    } = useBibleData();


    return (
        <BibleContext.Provider
            value={{
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
            }}
        >
            {children}
        </BibleContext.Provider>
    );
};

export default BibleProvider
