import axios from 'axios';

export const getAllBooks = async () => {
    try {
        const response = await axios.get('https://www.brillianzhub.com/ipray/bible_books/');

        if (!response.statusText === 'OK') {
            throw new Error('Error fetching books: ' + response.statusText);
        }

        const data = response.data;
        return data;
    } catch (error) {
        throw new Error('Error fetching books: ' + error.message);
    }
};


export const getChaptersByBookId = async (bookId) => {
    try {
        const response = await axios.get(`https://www.brillianzhub.com/ipray/bible_chapters/?book_id=${bookId}`);

        if (response.status !== 200) {
            throw new Error('Error fetching chapters: ' + response.statusText);
        }
        const data = response.data;
        const chapters = data.filter((chapter) => chapter.book.id === bookId);
        return chapters;
    } catch (error) {
        throw new Error('Error fetching chapters: ' + error.message);
    }
};

export const getVersesByChapterId = async (chapterId, selectedVersion) => {
    try {
        let url;
        if (selectedVersion === 'AMP') {
            url = `https://www.brillianzhub.com/ipray/bible_verses_amp/?chapter_id=${chapterId}`;
        } else if (selectedVersion === 'NIV') {
            url = `https://www.brillianzhub.com/ipray/bible_verses_niv/?chapter_id=${chapterId}`;
        } else {
            url = `https://www.brillianzhub.com/ipray/bible_verses_kjv/?chapter_id=${chapterId}`;
        }

        const response = await axios.get(url);

        if (response.status !== 200) {
            throw new Error('Error fetching chapters: ' + response.statusText);
        }
        const data = response.data;
        const verses = data.filter((verse) => verse.chapter.id === chapterId);
        return data;
    } catch (error) {
        throw new Error('Error fetching chapters: ' + error.message);
    }
};


// export const getVersesByChapterId = async (chapterId, selectedVersion) => {
//     try {
//         const url = selectedVersion === 'AMP'
//             ? `https://www.brillianzhub.com/ipray/bible_verses_amp/?chapter_id=${chapterId}`
//             : `https://www.brillianzhub.com/ipray/bible_verses_kjv/?chapter_id=${chapterId}`;

//         const response = await axios.get(url);

//         if (response.status !== 200) {
//             throw new Error('Error fetching chapters: ' + response.statusText);
//         }
//         const data = response.data;
//         const verses = data.filter((verse) => verse.chapter.id === chapterId);
//         return data;
//     } catch (error) {
//         throw new Error('Error fetching chapters: ' + error.message);
//     }
// };


export const getVerseById = async (verseId, selectedVersion) => {
    try {
        let url;
        if (selectedVersion === 'AMP') {
            url = `https://www.brillianzhub.com/ipray/bible_verses_amp/${verseId}/`;
        } else if (selectedVersion === 'NIV') {
            url = `https://www.brillianzhub.com/ipray/bible_verses_niv/${verseId}/`;
        } else {
            url = `https://www.brillianzhub.com/ipray/bible_verses_kjv/${verseId}/`;
        }

        const response = await axios.get(url);

        if (response.status !== 200) {
            throw new Error('Error fetching verse: ' + response.statusText);
        }

        const verse = response.data;
        return verse;
    } catch (error) {
        throw new Error('Error fetching verse: ' + error.message);
    }
};


// export const getVerseById = async (verseId, selectedVersion) => {
//     try {
//         const url = selectedVersion === 'AMP'
//             ? `https://www.brillianzhub.com/ipray/bible_verses_amp/${verseId}/`
//             : `https://www.brillianzhub.com/ipray/bible_verses_kjv/${verseId}/`;

//         const response = await axios.get(url);

//         if (response.status !== 200) {
//             throw new Error('Error fetching verse: ' + response.statusText);
//         }

//         const verse = response.data;
//         return verse;
//     } catch (error) {
//         throw new Error('Error fetching verse: ' + error.message);
//     }
// };


export const getChapterById = async (chapterId) => {
    try {
        const response = await axios.get(`https://www.brillianzhub.com/ipray/bible_chapters/${chapterId}`);

        if (response.status !== 200) {
            throw new Error('Error fetching chapters: ' + response.statusText);
        }

        const chapter = response.data;
        return chapter;
    } catch (error) {
        throw new Error('Error fetching verse: ' + error.message);
    }
};


