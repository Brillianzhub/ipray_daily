import { StyleSheet } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ScripturesScreen from '../../screens/ScripturesScreen';
import PrayersScreen from '../../screens/PrayersScreen';
import ClearAllScreen from '../../screens/ClearAllScreen';


const Tab = createMaterialTopTabNavigator();

const BookmarkedScreen = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarLabelStyle: { fontSize: 15, fontWeight: 'bold' },
                tabBarActiveTintColor: '#EA540C',
                tabBarInactiveTintColor: '#164E63',
                tabBarIndicatorStyle: { backgroundColor: '#EA540C' },
            }}
        >
            <Tab.Screen name="Scriptures" component={ScripturesScreen} />
            <Tab.Screen name="Prayers" component={PrayersScreen} />
            <Tab.Screen name="ClearAll" component={ClearAllScreen} />
        </Tab.Navigator>
    )
}

export default BookmarkedScreen

const styles = StyleSheet.create({})