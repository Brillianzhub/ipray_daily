import { Image, Text, View, StatusBar, TouchableOpacity, DrawerLayoutAndroid, StyleSheet } from 'react-native';
import React, { useRef, useState } from 'react';
import { Tabs } from 'expo-router';
import { icons } from '../../constants';
import useNavigationView from '../../lib/useNavigationView';
import { router } from 'expo-router';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { useNotification } from '../../context/NotificationContext';
import { useBibleContext } from '../../context/BibleContext';
import { Ionicons } from '@expo/vector-icons';


const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text
        className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  const drawer = useRef(null);
  const navigationView = useNavigationView();
  const navigation = useNavigation();
  const { unreadNotifications } = useNotification();

  const {
    books, chapters, verses, selectedBook, setSelectedBook,
    selectedChapter, setSelectedChapter, selectedVersion, setSelectedVersion, selectedVerse,
    setSelectedVerse, selectedBookId, setSelectedBookId,
  } = useBibleContext();



  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'KJV', value: 'KJV' },
    { label: 'AMP', value: 'AMP' },
    { label: 'NIV', value: 'NIV' }

  ]);


  const navigateTo = (route) => {
    router.replace(route);
  };

  const openDrawer = () => {
    if (drawer.current) {
      drawer.current.openDrawer();
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <DrawerLayoutAndroid
        ref={drawer}
        drawerWidth={300}
        drawerPosition="left"
        renderNavigationView={navigationView}
      >
        <Tabs
          screenOptions={{
            swipeEnabled: true,
            tabBarShowLabel: false,
            tabBarActiveTintColor: '#FFA001',
            tabBarInactiveTintColor: '#CDCDE0',
            tabBarStyle: {
              backgroundColor: '#161622',
              borderTopWidth: 1,
              borderTopColor: '#232533',
              height: 84,
            },
            headerStyle: {
              backgroundColor: '#FFF',
            },
            headerTintColor: '#161622',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableOpacity onPress={openDrawer} style={{ marginRight: 16 }}>
                <Image
                  source={icons.sidebar}
                  style={{ width: 24, height: 24, marginLeft: 20 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 14 }}>
                <TouchableOpacity onPress={() => navigateTo('/profile')} style={{ marginRight: 10 }}>
                  <Image
                    source={icons.profile}
                    style={{ width: 24, height: 24 }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateTo('/notifications')} style={{ marginRight: 16 }}>
                  <Image
                    source={icons.notifications}
                    style={{ width: 24, height: 24, marginLeft: 8 }}
                    resizeMode="contain"
                  />
                  {unreadNotifications && (
                    <View style={styles.notificationDotOnIcon} />
                  )}
                </TouchableOpacity>
              </View>
            ),
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.home}
                  color={color}
                  name="Home"
                  focused={focused}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="prayer_start"
            options={{
              title: 'Prayers',
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.start}
                  color={color}
                  name="Prayers"
                  focused={focused}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="bible_kjv"
            options={{
              title: selectedBook
                ? `${selectedBook.name}${selectedChapter ? ` ${selectedChapter.number}` : ''}`
                : 'Bible',

              headerLeft: () =>
                selectedBook ? (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedBook(null);
                      setSelectedChapter(null);
                      setSelectedVerse(null);
                    }}
                    style={styles.backButton}
                  >
                    <Ionicons name="arrow-back" size={24} color="black" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={openDrawer} style={{ marginRight: 16 }}>
                    <Image
                      source={icons.sidebar}
                      style={{ width: 24, height: 24, marginLeft: 20 }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ),

              headerRight: () => (
                <View style={styles.dropdownContainer}>
                  <DropDownPicker
                    open={open}
                    value={selectedVersion}
                    items={items}
                    setOpen={setOpen}
                    setValue={setSelectedVersion}
                    setItems={setItems}
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownStyle}
                  />
                </View>
              ),
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.book}
                  color={color}
                  name="Bible"
                  focused={focused}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="schedule_prayer"
            options={{
              title: 'Schedule Event',
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.plan}
                  color={color}
                  name="Schedule"
                  focused={focused}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="join_group"
            options={{
              title: 'Community',
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.team}
                  color={color}
                  name="Community"
                  focused={focused}
                />
              ),
            }}
          />
        </Tabs>
      </DrawerLayoutAndroid>
    </>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    width: 90,
    marginRight: 15,
    marginTop: 5
  },
  dropdown: {
    backgroundColor: '#fafafa',
    minHeight: 30
  },
  dropdownStyle: {
    backgroundColor: '#fafafa',
  },
  notificationDot: {
    position: 'absolute',
    top: 2,
    right: -6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
  },
  notificationDotOnIcon: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  backButton: {
    marginLeft: 20,
  },

})
export default TabsLayout;
