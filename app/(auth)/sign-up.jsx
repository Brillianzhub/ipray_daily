import { TouchableOpacity, Linking, Text, View, Alert, Image } from 'react-native'
import React, { useState } from 'react'
import { images, icons } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { useGlobalContext } from '../../context/GlobalProvider'
import { GoogleSignin } from '@react-native-google-signin/google-signin';



const SignUp = () => {
    const { setUser, setIsLoggedIn } = useGlobalContext();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const submit = async () => {
        if (!form.name || !form.email || !form.password) {
            Alert.alert('Error', 'Please fill in all the fields')
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('https://www.brillianzhub.com/ipray/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    auth_provider: 'email'
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to sign up');
            }

            const result = await response.json();

            setUser({
                id: result.id,
                email: result.email,
                name: result.name,
                photo: result.profile_picture,
                authProvider: 'email'
            });
            setIsLoggedIn(true);

            router.replace('/home')
        } catch (error) {
            Alert.alert('Error', error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const googleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const googleUserInfo = await GoogleSignin.signIn();

            // Optionally send user info to the backend for storage
            const response = await fetch('https://www.brillianzhub.com/save-google-user/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    google_id: googleUserInfo.user.id,
                    email: googleUserInfo.user.email,
                    name: googleUserInfo.user.name,
                    profile_picture: googleUserInfo.user.photo,
                    auth_provider: 'google'
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to sign in with Google');
            }

            // Set the Google user info into the global context
            const result = await response.json();
            setUser({
                id: result.google_id,
                email: result.email,
                name: result.name,
                photo: result.profile_picture,
                authProvider: 'google',
            });

            setIsLoggedIn(true);
            router.replace('/home');
        } catch (e) {
            Alert.alert('Google Sign-In Error', e.message);
        }
    };

    const navigateToPrivacyPolicy = async () => {
        const url = 'https://brillianzhub.github.io/ipraydaily_privacy_policy';
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            console.error("Couldn't open URL:", url);
        }
    };

    return (
        <View className="bg-white h-full">
            <View className="w-full justify-center px-4">
                <View className="item-center justify-center mt-7">
                    <Image
                        source={images.icon}
                        resizeMode="contain"
                        className="w-16 h-16 mx-auto"
                    />
                </View>
                <FormField
                    title="Name"
                    value={form.name}
                    handleChangeText={(e) => setForm({
                        ...form,
                        name: e
                    })}
                    otherStyles="mt-3"
                />
                <FormField
                    title="Email"
                    value={form.email}
                    handleChangeText={(e) => setForm({
                        ...form,
                        email: e
                    })}
                    otherStyles="mt-3"
                    keyboardType="email-address"
                />
                <FormField
                    title="Password"
                    value={form.password}
                    handleChangeText={(e) => setForm({
                        ...form,
                        password: e
                    })}
                    otherStyles="mt-5"
                />
                <CustomButton
                    title="Sign Up"
                    handlePress={submit}
                    containerStyles="mt-7 h-10"
                    isLoading={isSubmitting}
                />
                <View className="justify-center pt-5 flex-row gap-2">
                    <Text className="text-lg font-pregular mt-7">
                        Have an account already?
                    </Text>
                    <Link href="/sign-in" className="text-lg font-psemibold text-secondary">
                        Sign In
                    </Link>
                </View>
                <View className="mt-3">
                    <Text className="text-lg text-center text-black-100 font-pregular mb-3">
                        OR:
                    </Text>
                    <TouchableOpacity onPress={googleSignIn}>
                        <View className="flex-row justify-center items-center p-2 mt-2 rounded-lg border">
                            <Image
                                source={icons.google}
                                className="h-7 w-7"
                            />
                            <Text className="text-center text-lg pl-3">Continue with Google</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity className="mt-4" onPress={navigateToPrivacyPolicy}>
                    <View>
                        <Text className="p-4 text-lg text-center">
                            By using this App, you agree to IPray Daily's <Text className="text-sky-900 font-bold underline">Privacy Policy</Text>
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SignUp
