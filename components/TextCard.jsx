import React, { useRef, useState } from 'react';
import { Image, Text, TouchableOpacity, View, Share, Alert, StyleSheet } from 'react-native';
import { icons } from '../constants';
import * as Speech from 'expo-speech';
import * as Clipboard from 'expo-clipboard';
import { useGlobalContext } from "../context/GlobalProvider";
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

const TextCard = ({ text: { text, bible_verse, category: { title } } }) => {
    const [isTextHighlighted, setIsTextHighlighted] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const { user } = useGlobalContext();
    const viewShotRef = useRef();

    const toggleSpeech = (text, bible_verse) => {
        if (isSpeaking) {
            Speech.stop();
            setIsSpeaking(false);
        } else {
            setIsSpeaking(true);
            const combinedText = `${text}\n\n${bible_verse}`;
            Speech.speak(combinedText, {
                rate: 0.85,
                pitch: 1.02,
                volume: 1.0,
                onDone: () => setIsSpeaking(false),
                onStopped: () => setIsSpeaking(false),
            });
        }
    };

    const handleCopy = async () => {
        try {
            const combinedText = `${text}\n\n${bible_verse}`;
            await Clipboard.setStringAsync(combinedText);
            Alert.alert("Text copied to clipboard");
        } catch (error) {
            Alert.alert("Error", "Failed to copy to clipboard.");
        }
    };

    const handleFavorite = async () => {
        Alert.alert("Feature not available yet", "This feature is under development and will be available soon!")
    }

    const handleShare = async () => {
        const shareOptions = {
            message: `Daily Prayer\n\n${text}\n\nIPRAY DAILY`,
        };

        try {
            await Share.share(shareOptions);
        } catch (error) {
            console.log('Error sharing:', error);
            Alert.alert('Error', 'Unable to share the content.');
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

    const handleTextPress = () => {
        setIsTextHighlighted(!isTextHighlighted);
    };

    return (
        <View style={styles.container}>
            <View style={styles.categoryContainer}>
                <View style={styles.categoryDot} />
                <Text style={styles.categoryText}>
                    Category: {title}
                </Text>
            </View>

            <TouchableOpacity onPress={handleTextPress}>
                <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }} style={[styles.captureView, isTextHighlighted && styles.highlightedCaptureView]}>
                    {isTextHighlighted && (
                        <Text style={styles.header}>Daily Bible Prayer</Text>
                    )}
                    <View style={[styles.textContainer, isTextHighlighted && styles.highlightedTextContainer]}>
                        <Text style={styles.text}>
                            {text} {'- '}
                            <Text style={styles.italicText}>
                                {bible_verse}
                            </Text>
                        </Text>
                    </View>
                    {isTextHighlighted && (
                        <Text style={styles.footer}>IPray Daily{' \n'}
                            <Text className="text-sm font-primary py-4">App available @PlayStore</Text>
                        </Text>
                    )}
                </ViewShot>
            </TouchableOpacity>

            {isTextHighlighted && (
                <View style={styles.actionContainer}>
                    <ActionIcon icon={icons.favrite} onPress={handleFavorite} />
                    {/* <ActionIcon icon={icons.share} onPress={handleShare} /> */}
                    <ActionIcon icon={icons.copy} onPress={handleCopy} />
                    <ActionIcon icon={isSpeaking ? icons.pause : icons.bplay} onPress={() => toggleSpeech(text, bible_verse)} />
                    <ActionIcon icon={icons.share} onPress={captureAndShare} />
                </View>
            )}
        </View>
    );
};

const ActionIcon = ({ icon, onPress }) => (
    <TouchableOpacity style={styles.actionIconContainer} onPress={onPress}>
        <Image source={icon} style={styles.actionIcon} resizeMode='contain' />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 48,
    },
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        width: '100%',
        paddingBottom: 8
    },
    categoryDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderColor: '#0288d1',
        borderWidth: 1,
        marginRight: 8,
    },
    categoryText: {
        color: '#0288d1',
        fontWeight: '600',
        fontSize: 14,
        textTransform: 'uppercase',
    },
    captureView: {
        paddingHorizontal: 5,
        paddingVertical: 10,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        width: '100%',
        alignItems: 'center',
        textAlign: 'justify',
    },
    highlightedCaptureView: {
        // borderColor: '#0288d1',
        // borderWidth: 2,
    },
    header: {
        fontSize: 24,
        color: '#d84315',
        textAlign: 'center',
        marginBottom: 0,
        fontWeight: 'bold',
        paddingTop: 8
    },
    textContainer: {
        width: '100%',
        borderRadius: 10,
        marginTop: 0,
        padding: 10,
        backgroundColor: '#ffffff',
    },
    highlightedTextContainer: {
        // backgroundColor: '#f0f0f0',
    },
    text: {
        fontSize: 20,
        color: '#333',
        textAlign: 'justify',
        // marginTop: 5,
    },
    italicText: {
        fontSize: 20,
        color: '#E2680D',
        fontStyle: 'italic',
    },
    footer: {
        fontSize: 18,
        color: '#00796b',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 10,
        fontWeight: 'bold',
        paddingBottom: 0
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 12,
    },
    actionIconContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        borderColor: '#ffa726',
        borderWidth: 2,
        borderRadius: 12,
    },
    actionIcon: {
        width: 24,
        height: 24,
    },
});

export default TextCard;
