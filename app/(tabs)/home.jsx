import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FavoritesScreen from '../../screens/FavoritesScreen';
import CategoriesScreen from '../../screens/CategoriesScreen';

const Tab = createMaterialTopTabNavigator();

const Prayer = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 15, fontWeight: 'bold' },
        tabBarActiveTintColor: '#EA540C',
        tabBarInactiveTintColor: '#164E63',
        tabBarIndicatorStyle: { backgroundColor: '#EA540C' },
      }}
    >
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
    </Tab.Navigator>
  );
}

export default Prayer;
