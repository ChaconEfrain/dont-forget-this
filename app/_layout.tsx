import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@/cache";
import '@/app/global.css';
import Toast from "react-native-toast-message";
import GlobalProvider from "@/lib/provider";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey!}>
      <GlobalProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
      </GlobalProvider>
    </ClerkProvider>
  )
}