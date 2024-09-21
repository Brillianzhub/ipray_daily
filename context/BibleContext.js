import { StyleSheet, Text, View } from 'react-native'
import React, { createContext, useContext } from 'react'
import { useBibleData } from '../lib/useBibleData'


const BibleContext = createContext();


export const useBibleContext = () => useContext(BibleContext)

const BibleProvider = ({ children }) => {

    const {
        books, chapters, verses, isLoading, error, selectedBook, setSelectedBook,
        selectedChapter, setSelectedChapter, selectedVersion, setSelectedVersion,
        fetchVerses, setVerses, selectedVerse, setSelectedVerse, selectedBookId,
        setSelectedBookId, loadNextChapter, loadPreviousChapter
    } = useBibleData();


    return (
        <BibleContext.Provider
            value={{
                books,
                chapters,
                verses,
                isLoading,
                error,
                selectedBook,
                setSelectedBook,
                selectedChapter,
                setSelectedChapter,
                selectedVersion,
                setSelectedVersion,
                fetchVerses,
                setVerses,
                selectedVerse,
                setSelectedVerse,
                selectedBookId,
                setSelectedBookId,
                loadNextChapter, loadPreviousChapter
            }}
        >
            {children}
        </BibleContext.Provider>
    );
};

export default BibleProvider
