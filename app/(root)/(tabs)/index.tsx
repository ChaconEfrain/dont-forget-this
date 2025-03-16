import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MapPin, Notes, Pin } from "@/constants/icons";
import { router } from "expo-router";
import "react-native-get-random-values";

export default function Index() {

  // const [region, setRegion] = useState({
  //   latitude: 37.78825,
  //   longitude: -122.4324,
  //   latitudeDelta: 0.0922,
  //   longitudeDelta: 0.0421,
  // });

  // const mapRef = useRef<MapView>(null);

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView className="px-4 pb-4">
          <View className="flex gap-3 mt-2">
            <View className="flex flex-row gap-1 items-center">
              <Text className="font-rubik-medium text-xl text-accent">
                Crea un nuevo recordatorio
              </Text>
            </View>
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
          {/* <GooglePlacesAutocomplete
            placeholder="Buscar ubicación"
            fetchDetails={true}
            onPress={(data, details = null) => {
              console.log('data --> ', data)
              if (details) {
                console.log('details --> ', details.geometry)
                const { lat, lng } = details.geometry.location;
                setRegion({
                  latitude: lat,
                  longitude: lng,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                });
    
                // Mover el mapa a la nueva ubicación
                mapRef.current?.animateToRegion({
                  latitude: lat,
                  longitude: lng,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                });
              }
            }}
            onFail={(error) => console.error(error)}
            query={{
              key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!,
              language: 'es',
            }}
          /> */}
          {/* <View>
            <MapView
              ref={mapRef}
              style={{ flex: 1 }}
              region={region}
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
            </MapView>
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}