import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import '@/app/global.css';
import { logout } from "@/lib/appwrite";
import { useGlobalContext } from "@/hooks/useGlobalContext";

export default function Index() {
  const {refetch} = useGlobalContext();
  const handleLogout = async () => {
    await logout();
    refetch();
  }
  return (
    <SafeAreaView>
      <Text className="text-3xl font-bold text-center">helloo laura</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Text>Salir</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
