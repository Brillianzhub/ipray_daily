import { Text, View, Image } from 'react-native'
import React from 'react'
import { images } from '../constants'
import CustomButton from './CustomButton'
import { router } from 'expo-router'


const EmptyState = ({ text, category }) => {
    return (
        <View className="w-full flex justify-center items-center px-4">
            <Image
                source={images.empty}
                className="w-[270px] h-[216px]"
                resizeMode='contain'
            />
            <Text className="text-sm font-pmedium text-gray-100">{text}</Text>
            <Text className="text-xl text-center font-psemibold text-white mt-2">
                {category}
            </Text>

            <CustomButton
                title="Back to Explore"
                handlePress={() => router.push("/home")}
                containerStyles="w-full my-5"
            />

        </View>
    )
}

export default EmptyState
