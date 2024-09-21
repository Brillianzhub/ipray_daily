import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import GlobalProvider from '../context/GlobalProvider'
import NotificationProvider from '../context/NotificationContext';
import BibleProvider from '../context/BibleContext';



SplashScreen.preventAutoHideAsync();


const IprayLayout = () => {

  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error])

  if (!fontsLoaded && !error) return null;

  return (
    <GlobalProvider>
      <BibleProvider>
        <NotificationProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(others)" options={{ headerShown: false }} />
            <Stack.Screen
              name="search/[query]"
              options={{
                title: 'Search',
                headerTitleAlign: 'center',
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon
                    icon={icons.create}
                    color={color}
                    name="Groups"
                    focused={focused}
                  />
                ),
              }}

            />
          </Stack>
        </NotificationProvider>
      </BibleProvider>
    </GlobalProvider>

  )
}

export default IprayLayout;
