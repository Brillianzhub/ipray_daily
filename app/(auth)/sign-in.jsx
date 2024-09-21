import { Alert, Text, TouchableOpacity, View, Linking, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, router } from 'expo-router';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { useGlobalContext } from '../../context/GlobalProvider';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { icons } from '../../constants';
import { images } from '../../constants';
import { usePushNotifications } from '../../usePushNotifications';


const signIn = async (email, password, deviceToken) => {
    try {
        const response = await fetch('https://www.brillianzhub.com/ipray/signin/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                device_token: deviceToken
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to sign in');
        }

        const result = await response.json();

        return result;
    } catch (error) {
        console.error('Sign-In Error:', error);
        Alert.alert('Sign-In Error', error.message);
        return null;
    }
};

const SignIn = () => {
    const [error, setError] = useState(null);
    const { setUser, setIsLoggedIn } = useGlobalContext();
    const { expoPushToken } = usePushNotifications();

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);


    const submit = async () => {
        if (!form.email || !form.password) {
            Alert.alert('Error', 'Please fill in all the fields');
            return;
        }

        setIsSubmitting(true);

        const deviceToken = expoPushToken.data || expoPushToken

        try {
            const result = await signIn(form.email, form.password, deviceToken);
            if (result) {
                setUser({
                    id: result.id,
                    email: result.email,
                    name: result.name,
                    authProvider: 'email'
                });
                setIsLoggedIn(true);
                router.replace('/home');
            }
        } catch (error) {
            console.error('Login Error:', error);
            Alert.alert('Error', 'Failed to sign in. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const configureGoogleSignIn = () => {
        GoogleSignin.configure({
            androidClientId: "1019179928415-t4tno89dijmofiavdibd7oc10skcv2q6.apps.googleusercontent.com",
        });
    };

    useEffect(() => {
        configureGoogleSignIn();
    }, []);

    const googleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const googleUserInfo = await GoogleSignin.signIn();


            const deviceToken = expoPushToken.data || expoPushToken;

            // Set the Google user info into the global context
            setUser({
                id: googleUserInfo.user.id,
                email: googleUserInfo.user.email,
                name: googleUserInfo.user.name,
                photo: googleUserInfo.user.photo,
                authProvider: 'google',
            });

            setIsLoggedIn(true);
            router.replace('/home');

            // Optionally send user info to the backend for storage
            await fetch('https://www.brillianzhub.com/save-google-user/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: googleUserInfo.user.id,
                    email: googleUserInfo.user.email,
                    name: googleUserInfo.user.name,
                    photo: googleUserInfo.user.photo,
                    device_token: deviceToken
                }),
            });
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
                    title="Email"
                    value={form.email}
                    handleChangeText={(e) => setForm({
                        ...form,
                        email: e
                    })}
                    otherStyles="mt-5"
                    keyboardType="email-address"
                />

                <FormField
                    title="Password"
                    value={form.password}
                    handleChangeText={(e) => setForm({
                        ...form,
                        password: e
                    })}
                    otherStyles="mt-3"
                />
                <TouchableOpacity>
                    <Text className="text-lg mt-5 text-sky-900 font-bold">Forgot password</Text>
                </TouchableOpacity>

                <CustomButton
                    title="Sign In"
                    handlePress={submit}
                    containerStyles="mt-2 h-10"
                    isLoading={isSubmitting}
                />

                <View className="justify-center pt-5 flex-row gap-2">
                    <Text className="text-lg text-black-100 font-pregular mt-7">
                        Don't have an account?
                    </Text>
                    <Link href="/sign-up" className="text-lg font-psemibold text-secondary">
                        Sign Up
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
    );
};

export default SignIn;





