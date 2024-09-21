import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const useBookCompletion = () => {
    const [completedChaptersOTIds, setCompletedChaptersOTIds] = useState(new Set());
    const [completionOldTestament, setCompletionOldTestament] = useState(0);

    const [completedChaptersNTIds, setCompletedChaptersNTIds] = useState(new Set());
    const [completionNewTestament, setCompletionNewTestament] = useState(0);

    const [percentageCompletion, setPercentageCompletion] = useState(0);

    const [buttonClicked, setButtonClicked] = useState(false);

    const oldTestament = 929;
    const newTestament = 260;
    const totalBookChapters = oldTestament + newTestament;

    useEffect(() => {
        const loadCompletedChapters = async () => {
            try {
                const savedCompletedChaptersOTIds = await AsyncStorage.getItem('completedChaptersOTIds');
                const savedPercentageOTCompletion = await AsyncStorage.getItem('completionOldTestament');

                const savedCompletedChaptersNTIds = await AsyncStorage.getItem('completedChaptersNTIds');
                const savedPercentageNTCompletion = await AsyncStorage.getItem('completionNewTestament');

                const savedPercentageCompletion = await AsyncStorage.getItem('percentageCompletion');

                if (savedCompletedChaptersOTIds) {
                    const idsOTArray = JSON.parse(savedCompletedChaptersOTIds);
                    setCompletedChaptersOTIds(new Set(idsOTArray));
                }

                if (savedCompletedChaptersNTIds) {
                    const idsNTArray = JSON.parse(savedCompletedChaptersNTIds);
                    setCompletedChaptersNTIds(new Set(idsNTArray));
                }

                if (savedPercentageOTCompletion) {
                    setCompletionOldTestament(parseFloat(savedPercentageOTCompletion));
                }

                if (savedPercentageNTCompletion) {
                    setCompletionNewTestament(parseFloat(savedPercentageNTCompletion));
                }

                if (savedPercentageCompletion) {
                    setPercentageCompletion(parseFloat(savedPercentageCompletion));
                }

            } catch (error) {
                Alert.alert('Error', 'Failed to load saved state');
            }
        };

        loadCompletedChapters();
    }, []);

    useEffect(() => {
        const calculateAndSaveCompletion = async () => {
            try {
                const numCompletedChaptersOT = completedChaptersOTIds.size;
                const percentageOT = oldTestament > 0 ? (numCompletedChaptersOT / oldTestament) * 100 : 0;

                const numCompletedChaptersNT = completedChaptersNTIds.size;
                const percentageNT = newTestament > 0 ? (numCompletedChaptersNT / newTestament) * 100 : 0;

                // Round to 2 decimal places
                const roundedOTPercentage = percentageOT.toFixed(2);
                const roundedNTPercentage = percentageNT.toFixed(2);

                // Update completion percentages
                setCompletionOldTestament(parseFloat(roundedOTPercentage));
                setCompletionNewTestament(parseFloat(roundedNTPercentage));

                // Compute total completion percentage
                const totalCompletedChapters = numCompletedChaptersOT + numCompletedChaptersNT;
                const totalPercentage = totalBookChapters > 0 ? (totalCompletedChapters / totalBookChapters) * 100 : 0;
                const roundedTotalPercentage = totalPercentage.toFixed(2);

                setPercentageCompletion(parseFloat(roundedTotalPercentage));

                // Save to AsyncStorage
                await AsyncStorage.setItem('completedChaptersOTIds', JSON.stringify(Array.from(completedChaptersOTIds)));
                await AsyncStorage.setItem('completionOldTestament', roundedOTPercentage);

                await AsyncStorage.setItem('completedChaptersNTIds', JSON.stringify(Array.from(completedChaptersNTIds)));
                await AsyncStorage.setItem('completionNewTestament', roundedNTPercentage);

                await AsyncStorage.setItem('percentageCompletion', roundedTotalPercentage);

            } catch (error) {
                Alert.alert('Error', 'Failed to save state');
            }
        };

        calculateAndSaveCompletion();
    }, [completedChaptersOTIds, completedChaptersNTIds]);

    const toggleChapterCompletion = (id) => {
        const toggleSet = (set) => {
            const newSet = new Set(set);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        };

        if (id <= oldTestament) {
            setCompletedChaptersOTIds(toggleSet(completedChaptersOTIds));
        } else {
            setCompletedChaptersNTIds(toggleSet(completedChaptersNTIds));
        }
    };

    const handleChapterComplete = (id) => {
        toggleChapterCompletion(id);
        setButtonClicked(prevState => !prevState);
    };

    return {
        handleChapterComplete,
        completionOldTestament,
        completionNewTestament,
        percentageCompletion,
        buttonClicked,
    };
};

export default useBookCompletion;