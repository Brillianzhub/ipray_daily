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

export const getAllCategories = async () => {
    try {
        const response = await axios.get('https://www.brillianzhub.com/ipray/categories/');

        if (response.status !== 200) {
            throw new Error('Error fetching categories: ' + response.statusText);
        }

        const data = response.data;

        const filteredData = data.filter(category =>
            category.title !== 'New Testament' &&
            category.title !== 'Old Testament'
        );

        const sortedData = filteredData.sort((a, b) => a.title.localeCompare(b.title));

        return sortedData;
    } catch (error) {
        throw new Error('Error fetching categories: ' + error.message);
    }
};


export const getPrayersByCategory = async (category) => {
    try {
        const response = await axios.get(`https://www.brillianzhub.com/ipray/prayerpoints/by_category/?category=${category}`);

        if (!response.statusText === 'OK') {
            throw new Error('Error fetching prayers: ' + response.statusText);
        }
        const data = response.data;
        const prayers = data.filter((prayer) => prayer.category.title === category);
        return prayers;
    } catch (error) {
        throw new Error('Error fetching categories: ' + error.message);
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


export const getPrayerPointsById = async (fprayerId) => {
    try {
        const response = await axios.get(`https://www.brillianzhub.com/ipray/prayerpoints/${fprayerId}`);

        if (response.status !== 200) {
            throw new Error('Error fetching chapters: ' + response.statusText);
        }

        const favoriteprayerpoints = response.data;
        return favoriteprayerpoints;
    } catch (error) {
        throw new Error('Error fetching verse: ' + error.message);
    }
};


