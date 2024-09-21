import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, Share } from 'react-native';
import React from 'react';
import { icons } from '../constants';
import { useRouter } from 'expo-router';

const useNavigationView = () => {
    const router = useRouter();

    const handleShare = async () => {
        const shareOptions = {
            message: "IPray Daily amazing Prayer & Bible app: https://play.google.com/store/apps/details?id=com.brillianzhub.ipray",
        };

        try {
            await Share.share(shareOptions);
        } catch (error) {
            console.log('Error sharing:', error);
            Alert.alert('Error', 'Unable to share the content.');
        }
    };

    const navigateTo = (route) => {
        router.replace(route);
    };

    const navigationView = () => (
        <View style={styles.container}>
            <View style={styles.header}>
                {/* Free empty space */}
            </View>
            <View style={styles.caption}>
                <Text style={styles.captionText}>IPRAY DAILY</Text>
            </View>
            <View style={styles.menuContainer}>
                <MenuItem
                    onPress={() => navigateTo('/bookmark')}
                    icon={icons.bookmark}
                    text="Bookmark"
                    backgroundColor="#FFF7ED"
                />
                <MenuItem
                    onPress={() => navigateTo('/about')}
                    icon={icons.about}
                    text="About"
                    backgroundColor="#FFFFFF"
                />
                <MenuItem
                    onPress={() => navigateTo('/join_us')}
                    icon={icons.team}
                    text="Join Our Prayer Meeting"
                    backgroundColor="#FFF7ED"
                />
                <MenuItem
                    onPress={() => navigateTo('/remove_ads')}
                    icon={icons.fund}
                    text="Support us"
                    backgroundColor="#FFFFFF"
                />
                <MenuItem
                    onPress={() => navigateTo('/rate_us')}
                    icon={icons.rate_us}
                    text="Rate this App"
                    backgroundColor="#FFF7ED"
                    borderRadius='8'
                />
                <MenuItem
                    onPress={handleShare}
                    icon={icons.share}
                    text="Share the App"
                    backgroundColor="#FFFFFF"
                />
                <MenuItem
                    onPress={() => navigateTo('/settings')}
                    icon={icons.settings}
                    text="Settings"
                    backgroundColor="#FFF7ED"
                />
            </View>
            <View style={styles.footer}>
                {/* Free empty space */}
            </View>
        </View>
    );

    const MenuItem = ({ onPress, icon, text, backgroundColor }) => (
        <TouchableOpacity onPress={onPress} style={[styles.menuItem, { backgroundColor }]}>
            <Image source={icon} style={styles.icon} resizeMethod='contain' />
            <Text style={styles.menuItemText}>{text}</Text>
        </TouchableOpacity>
    );

    return navigationView;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    header: {
        flex: 1
    },
    caption: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#0C4A6E',
        width: '100%'

    },
    captionText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FB923C',
        textAlign: 'left',
        paddingHorizontal: 16,
    },
    menuContainer: {
        flex: 4,
        borderColor: '#FFFFFF',
        borderWidth: 1,
        width: '100%'
    },
    menuItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderBottomColor: '#FFFFFF',
        borderBottomWidth: 1,
        width: '100%',
    },
    menuItemText: {
        fontSize: 18,
        fontWeight: 'normal',
        paddingHorizontal: 16,
    },
    icon: {
        width: 24,
        height: 24,
    },
    footer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
});

export default useNavigationView;
