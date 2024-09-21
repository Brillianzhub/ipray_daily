import { StyleSheet, View } from 'react-native';
import React, { useLayoutEffect } from 'react';

import { FlatList } from 'react-native-gesture-handler';
import ChapterItem from '../components/ChapterItem';
import { useBibleContext } from '../context/BibleContext';

const BibleChaptersScreen = ({ navigation }) => {
    const { selectedBook, chapters, selectedChapter, setSelectedChapter } = useBibleContext();

    useLayoutEffect(() => {
        if (selectedBook) {
            navigation.setOptions({
                title: selectedBook.book_name,
            });
        }
    }, [navigation, selectedBook]);

    const handleChapterPress = (chapter) => {
        setSelectedChapter(chapter);
        navigation.navigate('BibleVersesScreen', {
            selectedChapterId: chapter
        });
    };


    return (
        <View style={styles.container}>
            <FlatList
                data={chapters}
                keyExtractor={(item) => item.chapter_id.toString()}
                numColumns={6}
                renderItem={({ item }) => <ChapterItem item={item} onPress={() => handleChapterPress(item)} />}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default BibleChaptersScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
    },
});
