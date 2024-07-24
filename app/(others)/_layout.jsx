import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";


const OtherLayout = () => {
    return (
        <>
            <Stack>
                <Stack.Screen
                    name="profile"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="bookmark"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="about"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="join_us"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="remove_ads"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="rate_us"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="manage_groups"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="settings"
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>


            <StatusBar backgroundColor="#161622" style="light" />
        </>
    );
};

export default OtherLayout;
