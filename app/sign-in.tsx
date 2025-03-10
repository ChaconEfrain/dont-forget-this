import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from '@/assets/images/icon.png';
import google from '@/assets/images/google.png';
import { login } from "@/lib/appwrite";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { Redirect } from "expo-router";

export default function SignIn() {

    const { refetch, isLogged, loading } = useGlobalContext();

    if (!loading && isLogged) return <Redirect href="/" />;

    const handleLogin = async () => {
        const result = await login();
        console.log(result)
        if (result) {
          refetch();
        } else {
          Alert.alert("Error", "Failed to login");
        }
      };

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
                        <TouchableOpacity onPress={handleLogin} className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-2 px-4">
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