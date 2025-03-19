import { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useFonts } from "expo-font";
import { Redirect, Slot, SplashScreen } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import bell from '@/assets/images/bell.png';
import '@/app/global.css';

export default function RootLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const [fontsLoaded] = useFonts({
    "Rubik-Bold": require("../../assets/fonts/Rubik-Bold.ttf"),
    "Rubik-ExtraBold": require("../../assets/fonts/Rubik-ExtraBold.ttf"),
    "Rubik-Light": require("../../assets/fonts/Rubik-Light.ttf"),
    "Rubik-Medium": require("../../assets/fonts/Rubik-Medium.ttf"),
    "Rubik-Regular": require("../../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-SemiBold": require("../../assets/fonts/Rubik-SemiBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded && isLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoaded]);

  if (!fontsLoaded || !isLoaded) {
    return null;
  }


  if (!isSignedIn) {
    return <Redirect href={'/sign-in'} />
  }

  return (
    <>
      <Header />
      <Slot />
    </>
  )
}

function Header() {
  const { user } = useUser();
  return (
    <View className="flex flex-row items-center justify-between p-4 bg-white">
      <View className="flex flex-row gap-2 items-center">
        <Image source={{ uri: user?.imageUrl }} className="size-16 rounded-full" />
        <View>
          <Text className="font-rubik-light text-base">{new Date().toLocaleDateString("es-MX", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}</Text>
          <View className="flex flex-row">
            <Text className="font-rubik-medium text-xl text-accent">
              Buenos días,{' '}
            </Text>
            <Text className="font-rubik-medium text-xl text-primary">
              {user?.firstName}!
            </Text>
          </View>
        </View>
      </View>
      <View>
        <TouchableOpacity>
          <Image source={bell} className="size-6" />
        </TouchableOpacity>
      </View>
    </View>
  )
}