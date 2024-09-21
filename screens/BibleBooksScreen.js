import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import OldTestamentBooks from '../screens/OldTestamentBooks';
import NewTestamentBooks from '../screens/NewTestamentBooks'

const Tab = createMaterialTopTabNavigator();


const BibleBooksScreen = () => {

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarLabelStyle: { fontSize: 15, fontWeight: 'bold' },
                tabBarActiveTintColor: '#EA540C',
                tabBarInactiveTintColor: '#164E63',
                tabBarIndicatorStyle: { backgroundColor: '#EA540C' },
            }}
        >
            <Tab.Screen
                name="OldTestamentBooks"
                component={OldTestamentBooks}
                options={{ title: 'Old Testament' }}
            />
            <Tab.Screen
                name="NewTestamentBooks"
                component={NewTestamentBooks}
                options={{ title: 'New Testament' }}
            />
        </Tab.Navigator>
    )
}

export default BibleBooksScreen

const styles = StyleSheet.create({})