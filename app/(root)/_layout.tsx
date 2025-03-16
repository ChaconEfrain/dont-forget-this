import { useGlobalContext } from "@/hooks/useGlobalContext";
import { Redirect, Slot } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Toast from 'react-native-toast-message';
import bell from '@/assets/images/bell.png';
import { User } from "@/lib/provider";

export default function AppLayout() {
  const { isLogged, user } = useGlobalContext();

  if (!isLogged) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <>
      <Header user={user} />
      <Slot />
      {/* 24px font size on toast text */}
      <Toast />
    </>
  );
}

function Header({user}: {user: User | null}) {
  return (
    <View className="flex flex-row items-center justify-between p-4 bg-white">
      <View className="flex flex-row gap-2 items-center">
      <Image source={{ uri: user?.avatar }} className="size-16 rounded-full" />
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
              {user?.name.split(' ')[0]}!
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