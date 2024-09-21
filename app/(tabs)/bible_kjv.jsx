import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import BibleBooksScreen from '../../screens/BibleBooksScreen';
import BibleChaptersScreen from '../../screens/BibleChaptersScreen';
import BibleTextRenderScreen from '../../screens/BibleTextRenderScreen';
import BibleVersesScreen from '../../screens/BibleVersesScreen';

const Stack = createStackNavigator();

const Book = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="BibleBooksScreen"
                component={BibleBooksScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="BibleChaptersScreen"
                component={BibleChaptersScreen}

            />
            <Stack.Screen
                name="BibleVersesScreen"
                component={BibleVersesScreen}
            />
            <Stack.Screen
                name="BibleTextRenderScreen"
                component={BibleTextRenderScreen}
            />

        </Stack.Navigator>
    )
}

export default Book

const styles = StyleSheet.create({})