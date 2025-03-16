import { Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Arrow from "@/constants/icons";
import { useRef, useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import Toast from "react-native-toast-message";

interface State {
	title: string;
  latitude: number;
	reminder: string | string[];
	listValue: string;
}

export default function CreateLocationReminder() {

	const {user} = useGlobalContext();

	const [state, setState] = useState<State>({
		title: '',
    latitude: 0,
		reminder: '',
		listValue: '',
	});
	const [reminderMode, setReminderMode] = useState<'Texto' | 'Lista'>('Texto');
	const reminderRef = useRef<TextInput>(null);
	const titleRef = useRef<TextInput>(null);

	const handleSubmit = async () => {
		if (!state.title.trim()) {
			alert('El título es requerido');
			return;
		}
		if (!state.reminder.toString().trim()) {
			alert('El recordatorio es requerido');
			return;
		}
		if (!user) {
			alert('Debes iniciar sesión para crear un recordatorio');
			return;
		}
  }

	return (
		<SafeAreaView className="bg-white flex-1">
			<ScrollView className="px-4 pb-4 mt-2 flex-1" keyboardShouldPersistTaps='handled'>
				<View className="flex flex-row items-center gap-2 border-accent-medium border-b-[1px] pb-4">
					<TouchableOpacity
						onPress={() => {
								router.back();
						}}
					>
					<Arrow width={24} height={24} stroke="#001d3f" strokeWidth={1.5} />
					</TouchableOpacity>
					<Text className="text-accent text-xl font-rubik-medium">Nuevo recordatorio</Text>
				</View>
				<View className="mt-4 gap-4 flex-1">
					<View className="gap-2">
						<Text className="text-accent text-lg font-rubik-medium">Título</Text>
						<TextInput 
							ref={titleRef}
							className="text-lg font-rubik text-accent border-accent-medium border-[1px] p-4 rounded-lg"
							placeholder="Lista de supermercado"
							value={state.title}
							onChangeText={(text) => setState({
								...state,
								title: text,
							})}
						/>
					</View>
          <View className="gap-2">
						<Text className="text-accent text-lg font-rubik-medium">Ubicación</Text>
						<TouchableOpacity>
							<TextInput 
								editable={false}
								className="text-lg font-rubik text-accent border-accent-medium border-[1px] p-4 rounded-lg"
								placeholder="Calle..."
								value={''}
							/>
						</TouchableOpacity>
					</View>
					<View className="gap-2">
						<View className="flex-row justify-between items-center">
							<Text className="text-accent text-lg font-rubik-medium">Recordatorio</Text>
							<View className="flex-row gap-2 items-center">
								<TouchableOpacity
									className={`${reminderMode === 'Texto' ? 'bg-primary-highlight' : 'bg-primary-light'} px-4 py-1 rounded-lg`}
									onPress={() => {
										setReminderMode('Texto')
										setState({
											...state,
											reminder: '',
										})
									}}
								>
									<Text className={`${reminderMode === 'Texto' ? 'font-rubik-medium' : 'font-rubik'} text-accent`}>Texto</Text>
								</TouchableOpacity>
								<TouchableOpacity
									className={`${reminderMode === 'Lista' ? 'bg-primary-highlight' : 'bg-primary-light'} px-4 py-1 rounded-lg`}
									onPress={() => {
										setReminderMode('Lista')
										setState({
											...state,
											reminder: '',
										})
									}}
								>
									<Text className={`${reminderMode === 'Lista' ? 'font-rubik-medium' : 'font-rubik'} text-accent`}>Lista</Text>
								</TouchableOpacity>
							</View>
						</View>
						{reminderMode === 'Texto' && 
							<TextInput 
								className="text-lg font-rubik text-accent border-accent-medium border-[1px] px-4 pt-4 h-28 rounded-lg"
								placeholder="Escribe tu recordatorio"
								multiline={true}
								numberOfLines={4}
								textAlignVertical="top"
								value={state.reminder as string}
								onChangeText={(text) => setState({
									...state,
									reminder: text,
								})}
							/>
						}
						{reminderMode === 'Lista' &&
							<View>
								<View className="flex-row gap-2 items-center">
									<TextInput 
										ref={reminderRef}
										className="text-lg font-rubik flex-1 text-accent border-accent-medium border-[1px] p-4 rounded-lg"
										placeholder="Escribe tu recordatorio"
										value={state.listValue}
										onChangeText={(text) => setState({
											...state,
											listValue: text,
										})}
									/>
									<Pressable
										onPress={() => {
											reminderRef.current?.blur();
											if (!state.listValue.trim()) {
												setState({
													...state,
													listValue: '',
												});
												return;
											}
											setState({
												...state,
												reminder: [...(state.reminder as string[]), state.listValue],
												listValue: '',
											})
										}}
										className="bg-accent py-4 px-8 rounded-lg"
									>
										<Text className="text-white font-rubik-medium text-center">Agregar</Text>
									</Pressable>
								</View>
								<View className="flex-row flex-wrap gap-3 mt-2">
									{state.reminder.length > 0 && (state.reminder as string[]).map((item, i) => (
										<View 
											key={`${i} - ${item}`}
											className="bg-accent-light rounded-full px-4 py-1"
										>
											<Text
												className="text-accent font-rubik-medium"
											>
												{item.trim()}
											</Text>
											<Pressable
												onPress={() => {
													setState({
														...state,
														reminder: (state.reminder as string[]).filter((_, index) => index !== i),
													})
												}}
												className="absolute -top-2 right-0"
											>
												<Text className="text-xl font-rubik-medium text-accent">x</Text>
											</Pressable>
										</View>
									))}
								</View>
							</View>
						}
					</View>
				</View>
				<TouchableOpacity
					className="bg-primary p-4 rounded-lg mt-6"
					onPress={handleSubmit}
				>
					<Text className="text-white text-lg font-rubik-medium text-center">
						Crear recordatorio
					</Text>
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
	)
}