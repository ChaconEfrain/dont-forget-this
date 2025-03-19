import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MapPin, Notes, Pin } from "@/constants/icons";
import { router } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { getLocationsReminders } from "@/lib/location-reminder";
import { LocationReminder, NormalReminder } from "@/types/reminder";
import { getNormalReminders } from "@/lib/normal-reminder";
import "react-native-get-random-values";

export default function Index() {

  const { isLoaded } = useAuth();
  const { user } = useUser();
  const [locationReminders, setLocationReminders] = useState<LocationReminder[] | null>()
  const [normalReminders, setNormalReminders] = useState<NormalReminder[] | null>()

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/(auth)/sign-in');
    }

    const getReminders = async () => {
      const [locationRemindersData, normalRemindersData] = await Promise.all([
        getLocationsReminders(user!.emailAddresses[0].emailAddress),
        getNormalReminders(user!.emailAddresses[0].emailAddress),
      ]);

      setLocationReminders(locationRemindersData);
      setNormalReminders(normalRemindersData);
    }

    getReminders();

  }, [])

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView className="px-4 pb-4">
          <View className="flex gap-3 mt-2">
              <Text className="font-rubik-medium text-xl text-accent">
                Crea un nuevo recordatorio
              </Text>
            <View className="flex gap-2">
              <TouchableOpacity
                onPress={() => {
                  router.push('/create-normal-reminder');
                }}
              >
                <View className="flex flex-row items-center gap-2 rounded bg-primary-light px-4 py-6">
                  <View className="bg-primary-medium rounded-full p-3">
                    <Pin width={20} height={20} stroke="#fe8b48" strokeWidth={1.5} />
                  </View>
                  <Text className="font-rubik-medium text-lg text-primary">
                    Simple
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  router.push('/create-location-reminder');
                }}
              >
                <View className="flex flex-row items-center gap-2 rounded bg-accent-light px-4 py-6">
                    <View className="bg-accent-medium rounded-full p-3">
                      <MapPin width={20} height={20} stroke="#001d3f" strokeWidth={1.5} />
                    </View>
                    <Text className="font-rubik-medium text-lg text-accent">
                      Ubicación
                    </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        <View className="mt-6">
          <Text className="font-rubik-medium text-xl text-accent">
            Tus recordatorios simples
          </Text>
          <FlatList 
            data={normalReminders}
            keyExtractor={(item) => item.$id}
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            className="mt-4"
            renderItem={({item}) => {
              const date = new Date(item.datetime)
              const localeDate = date.getTime() + date.getTimezoneOffset() * 60000
              return (
                <View className="bg-primary-light rounded-lg overflow-hidden shadow-sm border w-64 mr-4">
                  <View className="p-6 gap-1">
                    <Text className="font-rubik-medium text-xl text-primary">
                      {item.title}
                    </Text>
                    <Text className="font-rubik text-accent/60 text-sm">
                      {`${new Date(localeDate).toLocaleDateString()}, ${new Date(localeDate).toLocaleTimeString('es-MX', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                      })}`}
                    </Text>
                  </View>
                  <View className="w-1 h-full bg-primary absolute left-0" />
                  <View className="absolute right-2 top-2">
                    <Pin width={20} height={20} stroke="#fe8b48" strokeWidth={1.5} />
                  </View>
                </View>
              )
            }}
          />
        </View>
        <View className="mt-6">
          <Text className="font-rubik-medium text-xl text-accent">
            Tus recordatorios de ubicación
          </Text>
          <FlatList 
            data={locationReminders}
            keyExtractor={(item) => item.$id}
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            className="mt-4"
            renderItem={({item}) => {
              return (
                <View className="bg-accent-light rounded-lg overflow-hidden shadow-sm border w-64 mr-4">
                  <View className="p-6 gap-1">
                    <Text className="font-rubik-medium text-xl text-accent">
                      {item.title}
                    </Text>
                    <Text numberOfLines={1} className="font-rubik text-accent/60 text-sm">
                      {item.location_name}
                    </Text>
                  </View>
                  <View className="w-1 h-full bg-accent absolute left-0" />
                  <View className="absolute right-2 top-2">
                    <MapPin width={20} height={20} stroke="#001d3f" strokeWidth={1.5} />
                  </View>
                </View>
              )
            }}
          />
          </View>
      </ScrollView>
    </SafeAreaView>
  );
}