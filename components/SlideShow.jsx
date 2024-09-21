import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Audio } from 'expo-av';
import { icons } from '../constants';
import { useKeepAwake } from 'expo-keep-awake';

const SlideShow = ({ posts, slideDuration, numTexts, onComplete, playMusic, selectedAudio }) => {
    const [state, setState] = useState({
        currentSlide: 0,
        timer: slideDuration,
        isPaused: false,
    });
    const [notification, setNotification] = useState(null);
    const [backgroundMusic, setBackgroundMusic] = useState(null);
    useKeepAwake();

    const playNotification = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/sounds/notice.mp3')
        );
        setNotification(sound);

        await sound.playAsync();
    };

    useEffect(() => {
        return notification
            ? () => {
                notification.unloadAsync();
            }
            : undefined;
    }, [notification]);

    useEffect(() => {
        const loadBackgroundMusic = async () => {
            if (playMusic) {
                const { sound } = await Audio.Sound.createAsync(
                    { uri: selectedAudio.audio },
                    { isLooping: true }
                );
                setBackgroundMusic(sound);
                await sound.playAsync();
            }
        };

        loadBackgroundMusic();

        return () => {
            if (backgroundMusic) {
                backgroundMusic.unloadAsync();
            }
        };
    }, [playMusic]);

    useEffect(() => {
        let interval;
        if (!state.isPaused && state.currentSlide < numTexts) {
            interval = setInterval(() => {
                setState(prevState => {
                    if (prevState.timer === 0) {
                        if (prevState.currentSlide + 1 < numTexts) {

                            playNotification(); // Call notification sound

                            return {
                                ...prevState,
                                currentSlide: prevState.currentSlide + 1,
                                timer: slideDuration,
                            };
                        } else {
                            clearInterval(interval);
                            onComplete();

                            if (backgroundMusic) {
                                fadeOutBackgroundMusic();
                            }
                            return prevState;
                        }
                    }
                    return { ...prevState, timer: prevState.timer - 1 };
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [state.isPaused, state.currentSlide, numTexts, slideDuration, onComplete]);

    const fadeOutBackgroundMusic = async () => {
        if (backgroundMusic) {
            let volume = 1.0;
            const fadeInterval = setInterval(async () => {
                if (volume > 0.1) {
                    volume -= 0.1;
                    await backgroundMusic.setVolumeAsync(volume);
                } else {
                    clearInterval(fadeInterval);
                    await backgroundMusic.stopAsync();
                    await backgroundMusic.unloadAsync();
                    setBackgroundMusic(null);
                }
            }, 600); // Adjust the fade duration here
        }
    };

    const handlePause = () => {
        setState(prevState => ({ ...prevState, isPaused: true }));
    };

    const handlePlay = () => {
        setState(prevState => ({ ...prevState, isPaused: false }));
    };

    const handlePrevious = () => {
        if (state.currentSlide > 0) {
            setState(prevState => ({
                ...prevState,
                currentSlide: prevState.currentSlide - 1,
                timer: slideDuration,
            }));
        }
    };

    const handleNext = () => {
        if (state.currentSlide < numTexts - 1) {
            setState(prevState => ({
                ...prevState,
                currentSlide: prevState.currentSlide + 1,
                timer: slideDuration,
            }));
        }
    };

    const handleStop = () => {
        setState({
            currentSlide: 0,
            timer: slideDuration,
            isPaused: false,
        });
        fadeOutBackgroundMusic();
        onComplete(); // Ensure onComplete is called to notify the parent component
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    if (state.currentSlide >= numTexts) {
        return (
            <View className="flex-1 items-center p-4">
                <Text className="text-xl mb-4">Complete</Text>
                <TouchableOpacity onPress={handleStop}>
                    <Text className="text-blue-500">Restart</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onComplete}>
                    <Text className="text-blue-500">Go to Home Now</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className='bg-white justify-center p-4'>
            <Animatable.View
                animation="fadeIn"
                duration={1000}
                className='w-full p-5 rounded-lg border border-b border-orange-400'
            >
                <Text className='text-xl my-2 text-center font-bold'>PRAYER POINT {state.currentSlide + 1}</Text>
                <Text className='text-lg my-2 text-justify'>{posts[state.currentSlide].text}</Text>
                <Text className='text-jutify text-orange-400 text-xl mt-3 italic'>{posts[state.currentSlide].bible_verse}</Text>
                <Text className='text-center font-bold text-orange-400 text-xl mb-3'>{posts[state.currentSlide].bible_quotation}</Text>

                <Text className='text-lg my-2 text-center'>Time remaining: {formatTime(state.timer)} minute(s)</Text>
                <View className='flex-row justify-around w-full mt-5'>

                    <TouchableOpacity className="border border-bg rounded-full w-12 h-12 items-center justify-center" onPress={handlePrevious} disabled={state.currentSlide === 0}>
                        <Image
                            source={icons.previous}
                            className="w-8 h-8 rounded-full"
                            resizeMethod='contain'
                        />
                    </TouchableOpacity>

                    {state.isPaused ? (
                        <TouchableOpacity className="border border-bg rounded-full w-12 h-12 items-center justify-center" onPress={handlePlay}>
                            <Image
                                source={icons.bplay}
                                className="w-8 h-8 rounded-full"
                                resizeMethod='contain'
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity className="border border-bg rounded-full w-12 h-12 items-center justify-center" onPress={handlePause}>
                            <Image
                                source={icons.pause}
                                className="w-8 h-8 rounded-full"
                                resizeMethod='contain'
                            />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity className="border border-bg rounded-full w-12 h-12 items-center justify-center" onPress={handleNext} disabled={state.currentSlide === numTexts - 1}>
                        <Image
                            source={icons.next}
                            className="w-8 h-8 rounded-full"
                            resizeMethod='contain'
                        />
                    </TouchableOpacity>
                    <TouchableOpacity className="border border-bg rounded-full w-12 h-12 items-center justify-center" onPress={handleStop}>
                        <Image
                            source={icons.stop}
                            className="w-8 h-8 rounded-full"
                            resizeMethod='contain'
                        />
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
};

export default SlideShow;
