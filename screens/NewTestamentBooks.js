import { StyleSheet, FlatList, View } from 'react-native'
import React from 'react'
import { useBibleContext } from '../context/BibleContext';
import BookItem from '../components/Bible';

const NewTestamentBooks = ({ navigation }) => {

    const {
        books,
        setSelectedBook,
        setSelectedBookId
    } = useBibleContext();

    const filteredBooks = books.filter(book => book.category === 'New Testament');

    const handleBookPress = (book) => {

        setSelectedBook(book);
        setSelectedBookId(book.book_id);
        navigation.navigate('BibleChaptersScreen', {
            selectedBook: book,
        });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredBooks}
                keyExtractor={(item) => item.book_id.toString()}
                key="books"
                renderItem={({ item }) => <BookItem item={item} onPress={handleBookPress} />}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default NewTestamentBooks

const styles = StyleSheet.create({})