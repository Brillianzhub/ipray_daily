import { Text, View, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import React, { useState } from 'react';
import { icons } from '../../constants';

const About = () => {
    const [showContentAboutUs, setShowContentAboutUs] = useState(false);
    const [showContentAboutApp, setShowContentAboutApp] = useState(false);
    const [showContentJoinUs, setShowContentJoinUs] = useState(false);



    const toggleContentAboutUs = () => {
        setShowContentAboutUs(!showContentAboutUs);
    };

    const toggleContentAboutApp = () => {
        setShowContentAboutApp(!showContentAboutApp);
    };

    const toggleContentJoinUs = () => {
        setShowContentJoinUs(!showContentJoinUs);
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

    const sendEmail = async (to, subject, body) => {
        const url = `mailto:${to}?subject=${subject}&body=${body}`;
        const canOpen = await Linking.canOpenURL(url);

        if (canOpen) {
            await Linking.openURL(url);
        } else {
            console.error('Failed to open email client.');
        }
    };

    return (
        <View className="bg-white h-full">
            <ScrollView className="bg-white h-full">
                <View className="flex-col my-6 px-4 min-h-[95vh]">
                    <View className="flex justify-center">
                        <TouchableOpacity onPress={toggleContentAboutApp} className="flex-row justify-between items-center mb-7">
                            <View className="flex-row items-center">
                                <Image
                                    source={icons.about_app}
                                    className="w-7 h-7 mr-4"
                                    resizeMethod="contain"
                                />
                                <Text className="text-lg text-left text-sky-950">About IPray Daily</Text>
                            </View>
                            {showContentAboutApp ? (
                                <Image source={icons.up} className="w-7 h-7" resizeMethod="contain" />
                            ) : (
                                <Image source={icons.down} className="w-7 h-7" resizeMethod="contain" />
                            )}
                        </TouchableOpacity>

                        {showContentAboutApp && (
                            <>
                                <View className="flex-row items-center mb-4">
                                    <Text className="text-lg text-orange-400 mr-2">Reconnect with God Every Day</Text>
                                </View>
                                <Text className="text-base text-justify leading-loose mb-4">
                                    At IPray Daily, we're a community of believers united by a shared love for God.
                                    We believe prayer is a powerful cornerstone of faith, and we're passionate about
                                    making daily devotion accessible and inspiring.
                                </Text>
                                <Text className="text-base text-justify leading-loose mb-8">
                                    That's why we created the IPray Daily app. We understand life can be hectic, leaving
                                    little time for focused prayer. Our app provides you with curated lists of categorized
                                    prayer points to jumpstart your daily conversations with God. Each prayer point is
                                    accompanied by a corresponding Bible reference, allowing you to ground your petitions
                                    in scripture.
                                </Text>

                                <View className="flex-row items-center mb-4">
                                    <Text className="text-lg text-orange-400 mr-2">More Than Just a Prayer App</Text>
                                </View>
                                <Text className="text-base text-justify leading-loose mb-4">
                                    IPray Daily is more than just a collection of prompts. It's a tool designed to nurture your
                                    spiritual growth and strengthen your connection with God. With our app, you can:
                                </Text>

                                <View className="flex-row items-center mb-4">
                                    <Text className="text-lg text-justify text-orange-400 mr-2">Discover daily inspiration:{" "}
                                        <Text className="text-base  text-black w-full font-normal">
                                            We regularly update our library with fresh prayer points,
                                            ensuring you always have meaningful prompts to guide your daily prayers.
                                        </Text>
                                    </Text>
                                </View>
                                <View className="flex-row items-center mb-4">
                                    <Text className="text-lg text-justify text-orange-400 mr-2">Find prayers for every occasion:{" "}
                                        <Text className="text-base text-justify text-black w-full font-normal">
                                            Whether you're facing a personal challenge, praying for loved ones, or simply expressing
                                            gratitude, we have prayer points to address a wide range of needs.
                                        </Text>
                                    </Text>
                                </View>
                                <View className="flex-row items-center mb-4">
                                    <Text className="text-lg text-orange-400 mr-2">Deepen Your Biblical Understanding:{" "}
                                        <Text className="text-base text-justify text-black w-full font-normal">
                                            The included Bible verses with each prayer point will help you gain a deeper understanding
                                            of God's word and how it applies to your prayer life.
                                        </Text>
                                    </Text>
                                </View>
                                <View className="flex-row items-center mb-4">
                                    <Text className="text-lg text-orange-400 mr-2">Stay Connected to Your Faith:{" "}
                                        <Text className="text-base text-justify text-black">
                                            Carry IPray Daily with you wherever you go, allowing you to access scripture and engage
                                            in prayerful reflection anytime you feel called.
                                        </Text>
                                    </Text>
                                </View>

                            </>
                        )}
                    </View>
                    <View className="flex justify-center">
                        <TouchableOpacity onPress={toggleContentAboutUs} className="flex-row justify-between items-center mb-7">
                            <View className="flex-row items-center">
                                <Image
                                    source={icons.about_us}
                                    className="w-7 h-7 mr-4"
                                    resizeMethod="contain"
                                />
                                <Text className="text-lg text-left text-sky-950">About Us</Text>
                            </View>

                            {showContentAboutUs ? (
                                <Image source={icons.up} className="w-7 h-7" resizeMethod="contain" />
                            ) : (
                                <Image source={icons.down} className="w-7 h-7" resizeMethod="contain" />
                            )}
                        </TouchableOpacity>

                        {showContentAboutUs && (
                            <>
                                <View className="flex-row items-center mb-4">
                                    <Text className="text-lg text-orange-400 mr-2">Our Belief:</Text>
                                    <Text className="text-base w-full">Rooted in Faith, Spreading His Kingdom</Text>
                                </View>
                                <Text className="text-base text-justify leading-loose mb-8">
                                    At IPray Daily, our foundation lies in an unwavering belief in God. We are deeply
                                    passionate about spreading the message of His kingdom and empowering believers to
                                    live a life guided by His love. We believe that prayer is a powerful tool that
                                    connects us to God and allows us to work alongside Him in building His kingdom on Earth.
                                </Text>

                                <View className="flex-row items-center mb-4">
                                    <Text className="text-lg text-orange-400 mr-2">Our Mission:</Text>
                                    <Text className="text-base w-full">Connecting You to God Through Prayer</Text>
                                </View>
                                <Text className="text-base text-justify leading-loose mb-8">
                                    Our mission at IPray Daily is to help believers of all backgrounds deepen their connection
                                    to God through prayer. We understand the challenges of maintaining a consistent prayer life,
                                    especially in our fast-paced world. We strive to create an atmosphere that fosters prayer and
                                    provides the resources necessary to cultivate a vibrant conversation with God.
                                </Text>

                                <View className="flex-row items-center mb-4">
                                    <Text className="text-lg text-orange-400 mr-2">Our Vision:</Text>
                                    <Text className="text-base w-full">A Global Community United in Prayer</Text>
                                </View>
                                <Text className="text-base text-justify leading-loose mb-8">
                                    Our vision is to build a global community where Christians across the globe can come together
                                    in prayer. We envision a world where believers are empowered to superimpose God's will upon
                                    the Earth through fervent, unified prayers. IPray Daily aims to be a central hub, a digital
                                    sanctuary where believers can support one another, share prayer requests, and collectively
                                    lift their voices to Heaven.
                                </Text>
                            </>
                        )}
                    </View>

                    <View className="flex justify-center mb-8">
                        <TouchableOpacity onPress={toggleContentJoinUs} className="flex-row justify-between items-center mb-6">
                            <View className="flex-row items-center">
                                <Image
                                    source={icons.joinus}
                                    className="w-7 h-7 mr-4"
                                    resizeMethod="contain"
                                />
                                <Text className="text-lg text-left text-sky-950">Become our member</Text>
                            </View>

                            {showContentJoinUs ? (
                                <Image source={icons.up} className="w-7 h-7" resizeMethod="contain" />
                            ) : (
                                <Image source={icons.down} className="w-7 h-7" resizeMethod="contain" />
                            )}
                        </TouchableOpacity>
                        {showContentJoinUs && (
                            <>
                                <Text className="text-base text-left text-justify mt-2">
                                    We invite you to become part of this vibrant prayer community at IPray Daily. Download the app
                                    today and embark on a journey of deeper connection with God, finding strength and encouragement
                                    through prayer alongside fellow believers.
                                </Text>
                            </>
                        )}
                    </View>

                    <View className="flex justify-center">
                        <View className="border-b border-gray-300 w-full mb-4" />
                        <TouchableOpacity onPress={() => sendEmail('contact.ipraydaily@gmail.com', 'Contact IPray Daily', '')} className="flex-row justify-between items-center mb-6">
                            <View className="flex-row items-center">
                                <Image
                                    source={icons.contact}
                                    className="w-7 h-7 mr-4"
                                    resizeMethod="contain"
                                />
                                <Text className="text-lg text-left text-sky-950">Contact us</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View className="flex justify-center">
                        <TouchableOpacity onPress={navigateToPrivacyPolicy} className="flex-row justify-between items-center mb-6">
                            <View className="flex-row items-center">
                                <Image
                                    source={icons.policy}
                                    className="w-7 h-7 mr-4"
                                    resizeMethod="contain"
                                />
                                <Text className="text-lg text-left text-sky-950">Privacy Policy</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default About;



