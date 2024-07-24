// PrayerListContext.js

import React, { createContext, useState, useContext } from 'react';

const PrayerListContext = createContext();

export const PrayerListProvider = ({ children }) => {
    const [prayerList, setPrayerList] = useState({});

    const addPrayer = (prayer) => {
        setPrayerList(prevList => ({ ...prevList, [prayer.id]: prayer }));
    };

    const removePrayer = (id) => {
        setPrayerList(prevList => {
            const newList = { ...prevList };
            delete newList[id];
            return newList;
        });
    };

    return (
        <PrayerListContext.Provider value={{ prayerList, addPrayer, removePrayer }}>
            {children}
        </PrayerListContext.Provider>
    );
};

export const usePrayerList = () => useContext(PrayerListContext);
