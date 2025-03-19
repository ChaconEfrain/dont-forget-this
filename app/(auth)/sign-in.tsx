import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from '@/assets/images/icon.png';
import google from '@/assets/images/google.png';
import { useAuth, useSSO } from "@clerk/clerk-expo";
import { useCallback, useEffect } from "react";
import * as WebBrowser from 'expo-web-browser'
import { signIn } from "@/lib/clerk";

export const useWarmUpBrowser = () => {
    useEffect(() => {
        // Preloads the browser for Android devices to reduce authentication load time
        // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
        void WebBrowser.warmUpAsync()
        return () => {
            // Cleanup: closes browser when component unmounts
            void WebBrowser.coolDownAsync()
        }
    }, [])
}

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession()

export default function SignIn() {

    useWarmUpBrowser()

    // Use the `useSSO()` hook to access the `startSSOFlow()` method
    const { isLoaded } = useAuth();
    const { startSSOFlow } = useSSO()

    const handleSignIn = useCallback(async () => await signIn(startSSOFlow), [isLoaded])

    return (
        <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="flex flex-col items-center justify-center h-screen gap-6">
                    <Image source={logo} resizeMode="contain" className="size-80" />
                    <View className="flex items-center justify-center gap-8">
                        <Text className="text-2xl font-rubik">
                            Bienvenido a{" "}
                            <Text className="text-primary font-rubik-semibold">
                                No lo olvides!
                            </Text>
                        </Text>
                        <View className="flex items-center justify-center gap-3">
                            <Text className="text-xl font-rubik">
                                Inicia sesión con Google
                            </Text>
                            <TouchableOpacity onPress={handleSignIn} className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-2 px-4">
                                <View className="flex flex-row items-center justify-center gap-2">
                                    <Image source={google} resizeMode="contain" className="size-10" />
                                    <Text className="text-xl font-rubik-medium">Continuar con Google</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}