import { useState } from "react";
import { router, usePathname } from "expo-router";
import { View, TouchableOpacity, Image, TextInput, Alert } from "react-native";

import { icons } from "../constants";

const SearchInput = ({ initialQuery }) => {
    const pathname = usePathname();
    const [query, setQuery] = useState(initialQuery || "");


    return (
        <View className="flex flex-row items-center space-x-4 w-full h-12 px-4 rounded-xl bg-gray-200
        border-sky-700 focus:border-secondary">
            <TextInput
                className="text-base mt-0.5 text-black flex-1 font-pregular h-12"
                value={query}
                placeholder="Search for prayers by category"
                placeholderTextColor="#CDCDE0"
                onChangeText={(e) => setQuery(e)}
            />

            <TouchableOpacity
                className="h-12 justify-center"
                onPress={() => {
                    if (query === "")
                        return Alert.alert(
                            "Missing Query",
                            "Please input something to search results across database"
                        );

                    if (pathname.startsWith("/search")) router.setParams({ query });
                    else router.push(`/search/${query}`);
                }}
            >
                <Image source={icons.search} className="w-7 h-7" resizeMode="contain" />
            </TouchableOpacity>
        </View>
    );
};

export default SearchInput;
