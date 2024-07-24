import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const FilterButton = ({ title, onPress, isSelected }) => (
    <TouchableOpacity
        className={`m-1 w-1/3 items-center px-2 py-2 rounded-md ${isSelected ? 'bg-orange-200' : 'bg-sky-400 text-white'}`} // Tailwind classes
        onPress={onPress}
    >
        <Text className="text-lg font-bold text-center">{title}</Text>
    </TouchableOpacity>
);

export default FilterButton;
