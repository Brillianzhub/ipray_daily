import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";

const AuthLayout = () => {

  const handleBackPress = () => {
    router.replace('/home');
  };

  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: true,
            title: "Sign In",
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableOpacity onPress={handleBackPress}>
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: true,
            title: "Sign Up",
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableOpacity onPress={handleBackPress}>
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
            ),
          }}
        />
      </Stack>

      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
    </>
  );
};

export default AuthLayout;
