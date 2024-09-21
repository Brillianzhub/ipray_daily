import { Text, TextInput, View, Image } from "react-native"
import React, { useState } from "react"
import { icons } from '../constants'
import { TouchableOpacity } from "react-native"


const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <View className={`space-y-2 ${otherStyles}`}>
            <Text className="text-base text-black-100 font-pmedium">
                {title}
            </Text>

            <View className="border-2 border-gray-200 w-full h-12 px-4 bg-white-100 rounded-2xl focus:border-secondary items-center flex-row">
                <TextInput
                    className="flex-1 text-black font-normal text-base text-xl"
                    value={value}
                    placeholder={placeholder}
                    onChangeText={handleChangeText}
                    secureTextEntry={title === 'Password' && !showPassword}
                />

                {title === 'Password' && (
                    <TouchableOpacity onPress={() =>
                        setShowPassword(!showPassword)}>
                        <Image
                            source={!showPassword ? icons.eye : icons.eyeHide}
                            className='w-6 h-6'
                            resizeMethod="contain"
                        />
                    </TouchableOpacity>
                )}

            </View>
        </View>
    )

}

export default FormField