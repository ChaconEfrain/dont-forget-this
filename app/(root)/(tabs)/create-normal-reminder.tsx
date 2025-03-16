import { Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Arrow from "@/constants/icons";
import { useRef, useState } from "react";
import { createNormalReminder } from "@/lib/normal-reminder";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import Toast from "react-native-toast-message";

interface State {
	datetime: Date | undefined;
	title: string;
	reminder: string | string[];
	listValue: string;
	dateSelected: boolean;
	timeSelected: boolean;
}

export default function CreateNormalReminder() {

	const {user} = useGlobalContext();

	const [state, setState] = useState<State>({
		datetime: undefined,
		title: '',
		reminder: '',
		listValue: '',
		dateSelected: false,
		timeSelected: false,
	});
	// const [time, setTime] = useState<number>();
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showTimePicker, setShowTimePicker] = useState(false);
	const [reminderMode, setReminderMode] = useState<'Texto' | 'Lista'>('Texto');
	const reminderRef = useRef<TextInput>(null);
	const titleRef = useRef<TextInput>(null);

	const toggleDatePicker = () => {
		reminderRef.current?.blur();
		titleRef.current?.blur();
		setShowDatePicker(!showDatePicker);
	};

	const toggleTimePicker = () => {
		reminderRef.current?.blur();
		titleRef.current?.blur();
		setShowTimePicker(!showTimePicker);
	};

	const onDateChange = (e: DateTimePickerEvent, selectedDate: Date | undefined) => {
		console.log(new Date(selectedDate!).toLocaleString())
		if (showDatePicker && e.type === 'set' && selectedDate) {
			setState({
				...state,
				datetime: selectedDate,
				dateSelected: true,
			});
			toggleDatePicker()
		} else if (showTimePicker && e.type === 'set' && selectedDate) {
			setState({
				...state,
				datetime: selectedDate,
				timeSelected: true,
			});
			toggleTimePicker()
		} else if (e.type === 'dismissed') {
			showDatePicker && toggleDatePicker();
			showTimePicker && toggleTimePicker();
		}
	};

	const handleSubmit = async () => {
		if (!state.title.trim()) {
			alert('El título es requerido');
			return;
		}
		if (!state.datetime) {
			alert('La fecha es requerida');
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

		// set datetime to user's local timezone
		const datetime = new Date(state.datetime.getTime() - state.datetime.getTimezoneOffset() * 60000)

		const result = await createNormalReminder(state.title, datetime, state.reminder.toString(), user.email);

		if (result) {
			Toast.show({
				type: 'success',
				text1: 'Recordatorio creado con éxito',
				visibilityTime: 3000,
				autoHide: true
			});
			setState({
				datetime: undefined,
				title: '',
				reminder: '',
				listValue: '',
				dateSelected: false,
				timeSelected: false,
			});
			reminderRef.current?.blur();
			titleRef.current?.blur();
		} else {
			Toast.show({
				type: 'error',
				text1: 'Error al crear el recordatorio',
			})
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
						<Text className="text-accent text-lg font-rubik-medium">Fecha</Text>
						{showDatePicker && (
								<DateTimePicker
									value={state.datetime ?? new Date()}
									mode="date"
									display="default"
									onChange={onDateChange}
								/>
							)						
						}
						<TouchableOpacity onPress={toggleDatePicker}>
							<TextInput 
								editable={false}
								className="text-lg font-rubik text-accent border-accent-medium border-[1px] p-4 rounded-lg"
								placeholder={new Date().toLocaleDateString('es-MX', {
									weekday: 'long',
									month: 'long',
									day: 'numeric',
								})}
								value={state.dateSelected ? state.datetime?.toLocaleDateString('es-MX', {
									weekday: 'long',
									month: 'long',
									day: 'numeric',
								}) : ''}
								onPressIn={toggleDatePicker}
							/>
						</TouchableOpacity>
					</View>
					<View className="gap-2">
						<Text className="text-accent text-lg font-rubik-medium">Hora</Text>
						{showTimePicker && (
								<DateTimePicker
									value={state.datetime ?? new Date()}
									mode="time"
									display="default"
									onChange={onDateChange}
								/>
							)						
						}
						<TouchableOpacity onPress={toggleTimePicker}>
							<TextInput 
								editable={false}
								className="text-lg font-rubik text-accent border-accent-medium border-[1px] p-4 rounded-lg"
								placeholder={new Date().toLocaleTimeString('es-MX', {
									hour: 'numeric',
									minute: 'numeric',
									hour12: true,
								})}
								value={state.datetime && state.timeSelected ? new Date(state.datetime).toLocaleTimeString('es-MX', {
									hour: 'numeric',
									minute: 'numeric',
									hour12: true,
								}) : ''}
								onPressIn={toggleTimePicker}
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