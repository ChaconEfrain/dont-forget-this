import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Arrow from "@/constants/icons";
import { type Dispatch, type SetStateAction, useRef, useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import Toast from "react-native-toast-message";
import { LocationI } from "@/lib/provider";
import { createLocationReminder } from "@/lib/location-reminder";
import { useUser } from "@clerk/clerk-expo";

interface State {
	title: string;
  location: string;
	reminder: string | string[];
	listValue: string;
	latitude: number;
	longitude: number;
}

export default function CreateLocationReminder() {

	const { user } = useUser();
	const {currentLocation} = useGlobalContext();

	const [state, setState] = useState<State>({
		title: '',
    location: '',
		reminder: '',
		listValue: '',
		latitude: 0,
		longitude: 0
	});
	const [loading, setLoading] = useState(false);
	const [reminderMode, setReminderMode] = useState<'Texto' | 'Lista'>('Texto');
	const [showModal, setShowModal] = useState(false)
	const reminderRef = useRef<TextInput>(null);
	const titleRef = useRef<TextInput>(null);

	const handleSubmit = async () => {
		if (loading) return;
		if (!state.title.trim()) {
			alert('El título es requerido');
			return;
		}
		if (!state.reminder.toString().trim()) {
			alert('El recordatorio es requerido');
			return;
		}
		if (!state.location.trim()) {
			alert('La ubicación es requerida');
			return;
		}
		if (!user) {
			alert('Debes iniciar sesión para crear un recordatorio');
			return;
		}
		
		setLoading(true);

		const result = await createLocationReminder({
			title: state.title,
			reminder: state.reminder.toString(),
			location: state.location,
			latitude: state.latitude,
			longitude: state.longitude,
			userEmail: user.emailAddresses[0].emailAddress
		})

		if (result) {
			Toast.show({
				type: 'success',
				text1: 'Recordatorio creado con éxito',
				visibilityTime: 5000,
				autoHide: true
			});
			setState({
				title: '',
        location: '',
				reminder: '',
				listValue: '',
				latitude: 0,
				longitude: 0
			});
			reminderRef.current?.blur();
			titleRef.current?.blur();
		} else {
			Toast.show({
				type: 'error',
				text1: 'Error al crear el recordatorio',
			})
		}

		setLoading(false);
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
						<TouchableOpacity onPress={() => {
							setShowModal(true)
							titleRef.current?.blur();
							reminderRef.current?.blur();
						}}>
							<TextInput 
								editable={false}
								className="text-lg font-rubik text-accent border-accent-medium border-[1px] p-4 rounded-lg"
								placeholder="Calle..."
								value={state.location.length > 35 ? state.location.slice(0, 35) + '...' : state.location}
								onPressIn={() => {
									setShowModal(true)
									titleRef.current?.blur();
									reminderRef.current?.blur();
								}}
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
					disabled={loading}
				>
					<Text className="text-white text-lg font-rubik-medium text-center">
					{loading ? 'Creando recordatorio...' : 'Crear recordatorio'}
					</Text>
				</TouchableOpacity>
			</ScrollView>
			{showModal &&
			 <MapsModal 
				showModal={showModal} 
				setShowModal={setShowModal} 
				currentLocation={currentLocation} 
				setState={setState}
			/>}
		</SafeAreaView>
	)
}

interface ModalProps {
	showModal: boolean;
	setShowModal: Dispatch<SetStateAction<boolean>>;
	currentLocation: LocationI | undefined;
	setState: Dispatch<SetStateAction<State>>;
}

function MapsModal({showModal, setShowModal, currentLocation, setState}: ModalProps) {

	const mapRef = useRef<MapView>(null);
	const searchRef = useRef<GooglePlacesAutocompleteRef>(null);
	const [region, setRegion] = useState<Region>()

	return (
		<View className="">
      <Modal
				className=""
        animationType="slide"
        transparent={false}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
					<View className="">
						<GooglePlacesAutocomplete
							ref={searchRef}
							debounce={300}
							styles={{
								textInputContainer: {
									position: 'absolute',
									top: 20,
									left: '5%',
									zIndex: 1,
									width: '90%',
								},
								listView: {
									width: '90%',
									backgroundColor: 'white',
									position: 'absolute',
									top: 60,
									left: '5%',
									zIndex: 1,
								},
								row: {
									backgroundColor: 'white',
									width: '100%'
								}
							}}
							isRowScrollable={false}
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
							      latitudeDelta: 0.005,
							      longitudeDelta: 0.005,
							    });
			
							    // Mover el mapa a la nueva ubicación
							    mapRef.current?.animateToRegion({
							      latitude: lat,
							      longitude: lng,
							      latitudeDelta: 0.005,
							      longitudeDelta: 0.005,
							    });

									setState((state) => ({
							      ...state,
							      location: data.description,
							      latitude: lat,
							      longitude: lng,
							    }));

							  }
							}}
							onFail={(error) => console.error(error)}
							query={{
								key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!,
								language: 'es',
							}}
						/>
						</View>
          <View className="flex-1">
						{!currentLocation ? <ActivityIndicator/> :
            <MapView
							ref={mapRef}
              style={{ flex: 1 }}
              initialRegion={currentLocation}
              provider={PROVIDER_GOOGLE}
              onPoiClick={(e) => {
								console.log(e)
                // set region
								setRegion({
									latitude: e.nativeEvent.coordinate.latitude,
									longitude: e.nativeEvent.coordinate.longitude,
									latitudeDelta: 0.005,
									longitudeDelta: 0.005,
								});

								mapRef.current?.animateToRegion({
									latitude: e.nativeEvent.coordinate.latitude,
									longitude: e.nativeEvent.coordinate.longitude,
									latitudeDelta: 0.005,
									longitudeDelta: 0.005,
								});

								searchRef.current?.setAddressText(e.nativeEvent.name);
								searchRef.current?.blur()

								setState((state) => ({
									...state,
									location: e.nativeEvent.name,
									latitude: e.nativeEvent.coordinate.latitude,
									longitude: e.nativeEvent.coordinate.longitude,
								}));
              }}
							onPress={e => {
								console.log(e.nativeEvent)
								setRegion({
									latitude: e.nativeEvent.coordinate.latitude,
									longitude: e.nativeEvent.coordinate.longitude,
									latitudeDelta: 0.005,
									longitudeDelta: 0.005,
								});

								mapRef.current?.animateToRegion({
									latitude: e.nativeEvent.coordinate.latitude,
									longitude: e.nativeEvent.coordinate.longitude,
									latitudeDelta: 0.005,
									longitudeDelta: 0.005,
								});

								searchRef.current?.setAddressText(`${e.nativeEvent.coordinate.latitude}, ${e.nativeEvent.coordinate.longitude}`);
								searchRef.current?.blur();

								setState((state) => ({
									...state,
									location: `${e.nativeEvent.coordinate.latitude}, ${e.nativeEvent.coordinate.longitude}`,
									latitude: e.nativeEvent.coordinate.latitude,
									longitude: e.nativeEvent.coordinate.longitude,
								}))
							}}
            >
							{region && 
								<Marker
									coordinate={{
										latitude: region.latitude,
										longitude: region.longitude,
									}}
								/>
							}
            </MapView>
						}
          </View>
					<TouchableOpacity
						className="bg-primary p-4 rounded-lg w-[90%] absolute bottom-6 left-[5%]"
						onPress={() => {
							setShowModal(false);
						}}
					>
						<Text className="text-white text-lg font-rubik-medium text-center">
							Confirmar ubicación
						</Text>
					</TouchableOpacity>
      </Modal>
    </View>
	)
}