import { Image, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { icons } from '../../constants'


const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text className={`${focused ? 'font-psemibold' :
        'font-pregular'} text-xs`} style={{ color: color }}>
        {name}
      </Text>
    </View>
  )
}


const TabsLayout = () => {

  return (
    <>

      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 84,
          }
        }}
      >
        <Tabs.Screen
          name='home'
          options={{
            title: "Prayers",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Prayers"
                focused={focused}
              />
            )
          }}
        />

        <Tabs.Screen
          name='prayer_start'
          options={{
            title: "Start Prayer",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.start}
                color={color}
                name="Start Prayer"
                focused={focused}
              />
            )
          }}
        />

        <Tabs.Screen
          name='bible_kjv'
          options={{
            title: "Bible",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.book}
                color={color}
                name="Bible"
                focused={focused}
              />
            )
          }}
        />

        <Tabs.Screen
          name='schedule_prayer'
          options={{
            title: "Plan Prayer",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.plan}
                color={color}
                name="Plan Prayer"
                focused={focused}
              />
            )
          }}
        />
        <Tabs.Screen
          name='join_group'
          options={{
            title: "Join Group",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.create}
                color={color}
                name="Groups"
                focused={focused}
              />
            )
          }}
        />
      </Tabs>
    </>

  );
};

export default TabsLayout;


