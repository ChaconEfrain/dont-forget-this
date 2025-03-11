import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import bell from '@/assets/images/bell.png';
import { Notes, Pin } from "@/constants/icons";

export default function Index() {

  const {user} = useGlobalContext();

  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="p-4 flex-1">
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row gap-2 items-center">
            <Image source={{ uri: user?.avatar }} className="size-16 rounded-full" />
            <View>
              <Text className="font-rubik-light text-base">{new Date().toLocaleDateString()}</Text>
              <Text className="font-rubik-medium text-xl text-primary">Hola, {user?.name.split(' ')[0]}!</Text>
            </View>
          </View>
          <View>
            <TouchableOpacity>
              <Image source={bell} className="size-6" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="mt-4">
          <View className="flex flex-row items-center gap-1">
            <Text className="font-rubik-medium text-xl text-dark">
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
                <View className="bg-white rounded-lg overflow-hidden shadow-sm border border-border w-64 h-48 mr-4">
                  <View className="p-4">
                  <View className="border-b-[1px] border-dark/60 pb-2 mb-2">
                    <Text className="font-rubik-medium text-xl text-dark">
                      Home depot
                    </Text>
                    <Text className="font-rubik text-dark/60 text-sm">
                      15/03/2025
                    </Text>
                  </View>
                  <ScrollView showsVerticalScrollIndicator={false} className="h-24">
                    <Text className="font-rubik text-dark">
                      Recuerda comprar una escoba, un recogedor y no sé qué más
                      Recuerda comprar una escoba, un recogedor y no sé qué más
                      Recuerda comprar una escoba, un recogedor y no sé qué más
                      Recuerda comprar una escoba, un recogedor y no sé qué más
                      Recuerda comprar una escoba, un recogedor y no sé qué más
                      Recuerda comprar una escoba, un recogedor y no sé qué más
                    </Text>
                  </ScrollView>
                  </View>
                  <View className="h-1 w-full bg-primary absolute bottom-0" />
                </View>
              )
            }}
          />
        </View>
        <View className="mt-8 flex-1">
          <View>
            <View className="flex flex-row gap-1 items-center">
              <Text className="font-rubik-medium text-xl text-dark">
                Crea un nuevo recordatorio
              </Text>
              <Pin width={24} height={24} stroke="#001d3f" strokeWidth={1.5} />
            </View>
            <Text className="font-rubik-light text-lg text-dark">
              Selecciona una ubicación en el mapa o utiliza el buscador para continuar
            </Text>
          </View>
          <View className="flex-1">
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: 21,
                longitude: -90,
                latitudeDelta: 1,
                longitudeDelta: 1,
              }}
              provider={PROVIDER_GOOGLE}
              onPoiClick={(e) => {
                console.log(e.nativeEvent);
              }}
            >
              {/* <Marker
                coordinate={{ latitude: 20.9678, longitude: -89.6247 }}
                title="Parque Zoológico del Centenario"
                // onPress={handleMarkerPress}
              /> */}
            </MapView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}