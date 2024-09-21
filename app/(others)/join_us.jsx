import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Button,
    Image,
    Alert,
    Linking,
    DrawerLayoutAndroid,
} from 'react-native';
import React, { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons } from '../../constants';
import { router } from 'expo-router';
import useNavigationView from '../../lib/useNavigationView';


const JoinUs = () => {
    const [showGuildlines, setShowGuildlines] = useState(false);

    const toggleShowGuildlines = () => {
        setShowGuildlines(!showGuildlines);
    };

    const navigateTo = (route) => {
        router.replace(route);
    };

    const navigateToApplicationForm = async () => {
        Alert.alert(
            'Feature Unavailable',
            'The application form functionality is currently under development and will be available soon. In the meantime, you can visit our privacy policy here:',
            [
                { text: 'OK' },
                { text: 'Privacy Policy', onPress: () => Linking.openURL('https://www.brillianzhub.com/policies/ipray_privacy_policy') }, // Open privacy policy if user clicks the link
            ],
            { cancelable: false } // Prevent dismissing without an action
        );
    };

    const drawer = useRef(null);
    const navigationView = useNavigationView();


    return (

        <View className="bg-white h-full">
            <ScrollView className="bg-white h-full">
                <View className="flex-col my-3 px-4 min-h-[95vh]">
                    <View className="flex justify-center">
                        <View className="flex-row items-center mb-2">
                            <Text className="text-lg text-orange-400 mr-2">Join Our Vibrant Prayer Community!</Text>
                        </View>
                        <Text className="text-base text-justify leading-loose mb-8">
                            At IPray Daily, we're passionate about creating a supportive space for individuals of all
                            backgrounds to strengthen their connection with God through prayer. We believe that prayer
                            is a powerful tool that allows us to work alongside Him in building His kingdom here on Earth.
                        </Text>

                        <View className="flex-row items-center mb-2">
                            <Text className="text-lg text-orange-400 mr-2">What to expect:</Text>
                        </View>

                        <View className="flex-row items-center mb-4">
                            <Text className="text-lg text-orange-400 mr-2">Supportive environment:{" "}
                                <Text className="text-base text-black w-full font-normal">
                                    Share your prayer requests and find encouragement from fellow believers.
                                </Text>
                            </Text>
                        </View>
                        <View className="flex-row items-center mb-4">
                            <Text className="text-lg text-orange-400 mr-2">Weekly gatherings:{" "}
                                <Text className="text-base text-black w-full font-normal">
                                    Join us on Wednesdays at midnight for a 30minutes kingdom based prayer time (virtual).
                                </Text>
                            </Text>
                        </View>
                        <View className="flex-row items-center mb-8">
                            <Text className="text-lg text-orange-400 mr-2">Fasting commitment (optional):{" "}
                                <Text className="text-base text-black w-full font-normal">
                                    Deepen your spiritual connection by participating in our community fasts.
                                </Text>
                            </Text>
                        </View>
                        <View className="flex-row items-center mb-2">
                            <Text className="text-lg text-orange-400 mr-2">Ready to embark on this journey with us?</Text>
                        </View>
                        <Text className="text-base text-justify leading-loose mb-8">
                            We invite you to apply to become part of our dedicated prayer community.  Please review our
                            Community Guidelines before submitting your application.
                        </Text>

                        <Button title="Our community guidelines" onPress={toggleShowGuildlines} className="" />
                        {showGuildlines && (
                            <>
                                <View className="bg-orange-50 rounded-b-xl">
                                    <Text className="text-base leading-loose my-6 mb-3 pl-2 italic">
                                        1. We believe in the triune God: Father, Son (Jesus Christ), and Holy Spirit.
                                        This foundational belief underpins our faith and prayer practices..
                                    </Text>
                                    <Text className="text-base leading-loose mb-3 pl-2 italic">
                                        2. We strive to live in accordance with God's will and contribute to building
                                        His Kingdom on Earth. Our prayers and actions aim to reflect this commitment.
                                    </Text>
                                    <Text className="text-base leading-loose mb-3 pl-2 italic">
                                        3. Sharing the love and message of Jesus Christ with others is a central aspect
                                        of our community. We encourage prayer and service opportunities that spread the Gospel.
                                    </Text>
                                    <Text className="text-base leading-loose mb-3 pl-2 italic">
                                        4. We welcome individuals from all backgrounds, denominations, and walks of life.
                                        We cultivate a space of tolerance and mutual respect, fostering understanding and unity in Christ.
                                    </Text>
                                    <Text className="text-base leading-loose mb-6 pl-2 italic">
                                        5. IPray Daily transcends specific denominational affiliations. We focus on the core
                                        principles of Christianity and unite in prayer regardless of denominational labels.
                                    </Text>

                                    <View className="flex-col items-center p-2">
                                        <View className="border-b border-gray-300 w-full mb-4" />
                                        <Text className="text-sm leading-loose mb-4">
                                            By joining our community, you agree to uphold these guidelines {"\n"}
                                            and contribute to a Christ-centered environment of prayer, support, and growth.
                                        </Text>
                                        <Image
                                            source={icons.agree}
                                            className="w-7 h-7 mr-2 mb-4"
                                            resizeMethod="contain"
                                        />

                                    </View>
                                </View>
                            </>
                        )}

                        <View className="flex-row items-center my-8 mb-2">
                            <Text className="text-lg text-orange-400 mr-2">Application Process:</Text>
                        </View>
                        <Text className="text-base text-justify leading-loose mb-8">
                            Fill out the brief application form below and allow up to 2 weeks for us to review your application
                            and respond. We look forward to welcoming you to IPray Daily!
                        </Text>
                        <Button title="Application form" onPress={navigateToApplicationForm} />
                    </View>
                </View>
            </ScrollView>
        </View>

    );
};

export default JoinUs;



