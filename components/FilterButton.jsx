import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const FilterButton = ({ title, onPress, isSelected }) => (
    <TouchableOpacity
        className={`m-1 w-1/3 items-center px-2 py-2 rounded-md ${isSelected ? 'bg-orange-400' : 'bg-orange-200 text-white'}`} // Tailwind classes
        onPress={onPress}
    >
        <Text className="text-lg font-bold text-center">{title}</Text>
    </TouchableOpacity>
);

// const FilterButton = ({ title, onPress, isSelected }) => (
//     <TouchableOpacity
//         className={`w-1/3 items-center px-2 pb-2 mb-3 border-b-4 ${isSelected ? 'border-orange-500' : 'border-transparent'}`} // Tailwind classes
//         onPress={onPress}
//     >
//         <Text className={`text-xl font-bold text-center ${isSelected ? 'text-orange-500' : 'text-black'}`}>{title}</Text>
//     </TouchableOpacity>
// );

export default FilterButton;
