import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MapPin, Notes, Pin } from "@/constants/icons";
import { router } from "expo-router";
import "react-native-get-random-values";

export default function Index() {

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
          <View className="flex flex-row items-center gap-1">
            <Text className="font-rubik-medium text-xl text-accent">
              Tus últimos recordatorios
            </Text>
            <Notes width={24} height={24} stroke="#001d3f" strokeWidth={1.5} />
          </View>
          <FlatList 
            data={[1,2,3,4]}
            keyExtractor={(item) => item.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            className="mt-4"
            renderItem={({item}) => {
              return (
                <View className="bg-white rounded-lg overflow-hidden shadow-sm border border-border w-64 h-44 mr-4">
                  <View className="p-4">
                  <View className="border-b-[1px] border-accent/60 pb-2 mb-2">
                    <Text className="font-rubik-medium text-xl text-accent">
                      Home depot
                    </Text>
                    <Text className="font-rubik text-accent/60 text-sm">
                      Fecha límite: 15/03/2025
                    </Text>
                  </View>
                  <ScrollView showsVerticalScrollIndicator={false} className="h-24">
                    <Text className="font-rubik text-accent">
                      • Escoba
                    </Text>
                    <Text className="font-rubik text-accent">
                      • Recogedor
                    </Text>
                    <Text className="font-rubik text-accent">
                      • Lavadora
                    </Text>
                    <Text className="font-rubik text-accent">
                      • Escoba
                    </Text>
                    <Text className="font-rubik text-accent">
                      • Escoba
                    </Text>
                    <Text className="font-rubik text-accent mb-4">
                      • Escoba
                    </Text>
                  </ScrollView>
                  </View>
                  <View className="h-1 w-full bg-primary absolute bottom-0" />
                </View>
              )
            }}
          />
        </View>
        <View className="mt-8">
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}