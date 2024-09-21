import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';

const AnimatedText = ({ textChunks }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [currentChunkIndex, setCurrentChunkIndex] = React.useState(0);

    useEffect(() => {
        const animateText = () => {
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(() => {
                setTimeout(() => {
                    animatedValue.setValue(0);
                    setCurrentChunkIndex((prevIndex) => (prevIndex + 1) % textChunks.length);
                }, 5000);
            });
        };

        animateText();
    }, [currentChunkIndex]);

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [100, 0],
    });

    return (
        <View>
            <Animated.View style={{ transform: [{ translateX }] }}>
                <Text className="text-base text-orange-700 italic">{textChunks[currentChunkIndex]}</Text>
            </Animated.View>
        </View>
    );
};

export default AnimatedText;
