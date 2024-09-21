import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Dimensions,
    Animated,
    Image,
    Alert,
    TouchableWithoutFeedback
} from 'react-native';
import { icons } from "../constants"
import * as Speech from 'expo-speech';
import * as Clipboard from 'expo-clipboard';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

import useBookmarks from '../lib/useBookmarks'


const PrayerModal = ({ isVisible, onClose, item, onSwipeLeft, onSwipeRight }) => {

    const { width } = Dimensions.get('window');
    const [pan, setPan] = React.useState(new Animated.ValueXY());
    const [isSpeaking, setIsSpeaking] = useState(false);
    const viewShotRef = useRef();


    const { isBookmarked, handleBookmarkToggle } = useBookmarks(item.id);

    const handleSwipe = (direction) => {
        Animated.timing(pan, {
            toValue: { x: direction === 'left' ? -width : width, y: 0 },
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            pan.setValue({ x: 0, y: 0 });
            direction === 'left' ? onSwipeLeft() : onSwipeRight();
        });
    };

    const toggleSpeech = (text, bible_verse, bible_quotation) => {
        if (isSpeaking) {
            Speech.stop();
            setIsSpeaking(false);
        } else {
            setIsSpeaking(true);
            const combinedText = `${text}\n\n${bible_verse}\n\n${bible_quotation}`;
            Speech.speak(combinedText, {
                rate: 0.85,
                pitch: 1.02,
                volume: 1.0,
                onDone: () => setIsSpeaking(false),
                onStopped: () => setIsSpeaking(false),
            });
        }
    };

    const captureAndShare = async () => {
        try {
            const uri = await viewShotRef.current.capture();
            await Sharing.shareAsync(uri);
        } catch (error) {
            console.error('Error capturing or sharing the image: ', error);
        }
    };


    const handleCopy = async () => {
        try {
            const combinedText = `${item.text}\n\n${item.bible_verse}`;
            await Clipboard.setStringAsync(combinedText);
            Alert.alert("Text copied to clipboard");
        } catch (error) {
            Alert.alert("Error", "Failed to copy to clipboard.");
        }
    };


    const handleBackgroundPress = () => {
        onClose();
    };

    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={isVisible}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalBackground}
                activeOpacity={1}
                onPress={handleBackgroundPress}
            >
                <Animated.View
                    style={[{ transform: pan.getTranslateTransform() }]}
                    onStartShouldSetResponder={() => true}
                    onTouchStart={(e) => e.stopPropagation()}
                >
                    <ViewShot
                        ref={viewShotRef}
                        options={{ format: 'png', quality: 0.9 }}
                        style={styles.modalContainer}
                    >
                        <View className="flex-row justify-between item-center mb-2">
                            <View className="bg-orange-400 item-center p-1 px-3 rounded-md">
                                <Text className="text-white font-bold text-sm text-center">Prayer - {item.category.title}</Text>
                            </View>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>X</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.text}>{item.text}</Text>
                        <Text style={styles.verse}>
                            <Text style={styles.italic}>{item.bible_quotation}</Text>{" "}
                            {item.bible_verse}{" "}

                        </Text>
                        <View className="bg-orange-400 w-1/3 item-left p-1 px-3 rounded-md mt-3">
                            <Text className="text-white font-bold text-sm text-center">IPray Daily</Text>
                        </View>
                    </ViewShot>

                </Animated.View>

                <TouchableWithoutFeedback>
                    <View style={styles.bottomPortion}>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.swipeButton1}
                                onPress={() => handleSwipe('right')}
                            >
                                <Image
                                    source={icons.previous}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.swipeButton}
                                onPress={handleBookmarkToggle}
                            >
                                <Image
                                    source={isBookmarked ? icons.favriteFilled : icons.favrite}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.swipeButton}
                                onPress={captureAndShare}
                            >
                                <Image
                                    source={icons.share}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.swipeButton}
                                onPress={handleCopy}
                            >
                                <Image
                                    source={icons.copy}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.swipeButton}
                                onPress={() => toggleSpeech(item.text, item.bible_verse, item.bible_quotation)}
                            >
                                {isSpeaking ? (
                                    <Image
                                        source={icons.pause}
                                        resizeMode="contain"
                                    />
                                ) : (
                                    <Image
                                        source={icons.bplay}
                                        resizeMode="contain"
                                    />
                                )}
                            </TouchableOpacity>


                            <TouchableOpacity
                                style={styles.swipeButton1}
                                onPress={() => handleSwipe('left')}
                            >
                                <Image
                                    source={icons.next}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        // height: '60%',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: '90%',
        padding: 20,
        backgroundColor: '#f7f5f0',
        borderRadius: 10,
    },
    closeButton: {
        alignItems: 'flex-end',
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red',
    },
    text: {
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'justify',
    },
    verse: {
        fontSize: 18,
        color: 'rgb(249, 115, 22)',
        textAlign: 'justify',
    },
    italic: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,

        // marginTop: 10,
    },
    swipeButton: {
        padding: 10,
        borderRadius: 5,
    },
    swipeButton1: {
        padding: 10,
        borderRadius: 5,
    },

    bottomPortion: {
        width: '90%',
        height: '8%',
        backgroundColor: '#f7f5f0',
        justifyContent: 'center',
        marginTop: 15,
        borderRadius: 10
    },

});

export default PrayerModal;
