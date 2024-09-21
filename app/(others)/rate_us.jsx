import { Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { icons } from '../../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Linking } from 'react-native'

const RateUs = () => {

    const navigateTo = (route) => {
        router.replace(route)
    }

    const rateApp = () => {
        Linking.openURL('https://play.google.com/store/apps/details?id=com.brillianzhub.ipray')
    }

    return (
        <View className="bg-white h-full">

            <View className="flex-1 justify-center items-center min-h-[50vh] p-4 mb-12">
                <Image
                    source={icons.rate_us}
                    resizeMode='contain'
                    className="w-12 h-12 mb-6"
                />
                <Text className="text-center text-xl mb-4 text-orange-400">Please rate our App!</Text>
                <Text className="text-center text-lg mb-4">
                    We value your feedback! Taking a moment to rate our Prayer app helps us create a
                    more inspiring experience for everyone..
                </Text>
                <View className="flex flex-row w-full justify-center">
                    <Image
                        source={icons.rating}
                        resizeMode='contain'
                        className="w-5 h-5 mr-2"
                    />
                    <Image
                        source={icons.rating}
                        resizeMode='contain'
                        className="w-5 h-5 mr-2"
                    />
                    <Image
                        source={icons.rating}
                        resizeMode='contain'
                        className="w-5 h-5 mr-2"
                    />
                    <Image
                        source={icons.rating}
                        resizeMode='contain'
                        className="w-5 h-5 mr-2"
                    />
                    <Image
                        source={icons.rating}
                        resizeMode='contain'
                        className="w-5 h-5 mb-6"
                    />
                </View>

                <TouchableOpacity onPress={rateApp} className="w-1/2 bg-sky-600 p-4 rounded-lg mb-20">
                    <Text className="text-white text-center text-lg">Rate Now!</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default RateUs;
