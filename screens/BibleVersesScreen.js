import { FlatList, StyleSheet, View } from 'react-native'
import React, { useEffect, useLayoutEffect } from 'react'
import VerseItem from '../components/VerseItem'
import { useBibleContext } from '../context/BibleContext'

const BibleVersesScreen = ({ route, navigation }) => {

    const { selectedBook, selectedChapter, selectedVerseNumbers, setSelectedVerse, setSelectedVerseNumbers, processSelectedChapter } = useBibleContext();

    useEffect(() => {
        processSelectedChapter(selectedChapter, setSelectedVerseNumbers);
    }, [selectedChapter]);

    const chapterId = route.params;


    const handleVersePress = (verse) => {
        setSelectedVerse(verse)

        navigation.navigate('BibleTextRenderScreen', {
            selectedVerse: verse,
            chapterId: chapterId
        })
    }

    useLayoutEffect(() => {
        if (selectedBook && selectedChapter) {
            navigation.setOptions({
                title: `${selectedBook.book_name} : ${selectedChapter.chapter_number}`
            });
        }
    }, [navigation, selectedBook, selectedChapter]);

    return (
        <View style={styles.container}>
            <FlatList
                data={selectedVerseNumbers}
                keyExtractor={(item) => item.verse_id.toString()}
                key="verseNumber"
                numColumns={6}
                renderItem={({ item }) => <VerseItem item={item} onPress={() => handleVersePress(item)} />}
            />
        </View>
    )
}

export default BibleVersesScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10
    }
})