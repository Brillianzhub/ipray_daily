import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllCategories, getPrayersByCategory } from './brillianzhub';
import axios from 'axios';

import useBookmarks from './useBookmarks'


export const usePrayer = () => {
    const [categories, setCategories] = useState([]);
    const [prayers, setPrayers] = useState([]);
    const { bookmarkedItems } = useBookmarks();
    const [fetchedPrayers, setFetchedPrayers] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);


    const fetchCategories = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedCategories = await getAllCategories();
            setCategories(fetchedCategories);
            await AsyncStorage.setItem('categories', JSON.stringify(fetchedCategories));
        } catch (error) {
            setError('Unable to fetch categories. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPrayersByCategory = async (category) => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedPrayers = await getPrayersByCategory(category);
            const reversedPrayers = fetchedPrayers.reverse();
            setPrayers(reversedPrayers);
            await AsyncStorage.setItem(`prayers-${category}`, JSON.stringify(fetchedPrayers));
        } catch (error) {
            setError('Unable to fetch prayers. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };


    const fetchFavoritePrayersById = async () => {
        if (bookmarkedItems.length === 0) {
            setFetchedPrayers([]);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const fetchedFavoritePrayers = await Promise.all(
                bookmarkedItems.map(async (id) => {
                    const response = await axios.get(`https://www.brillianzhub.com/ipray/prayerpoints/${id}`);
                    return response.data;
                })
            );
            setFetchedPrayers(fetchedFavoritePrayers);
        } catch (error) {
            console.error('Error fetching favorite prayers:', error);
            setError('Unable to fetch favorite prayers. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFavoritePrayersById();
    }, [bookmarkedItems]);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            fetchPrayersByCategory(selectedCategory);
        }
    }, [selectedCategory]);

    return {
        categories,
        isLoading,
        prayers,
        setPrayers,
        selectedCategory,
        setSelectedCategory,
        fetchedPrayers,
    }
};