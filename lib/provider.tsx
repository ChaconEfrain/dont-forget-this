import React, { createContext, ReactNode, useEffect, useState } from "react";
import { Alert } from "react-native";
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

export interface GlobalContextType {
  currentLocation: LocationI | undefined;
}

export interface LocationI {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {

  const [currentLocation, setCurrentLocation] = useState<LocationI | undefined>()

  useEffect(() => {
    (async () => {
      // Pedir permisos de ubicación
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      const { status: notificationStatus } = await Notifications.requestPermissionsAsync();

      if (locationStatus !== 'granted' || backgroundStatus !== 'granted' || notificationStatus !== 'granted') {
        Alert.alert('Permisos requeridos', 'Debes otorgar permisos de ubicación y notificaciones.');
        return;
      }

      // Obtener ubicación del usuario
      const userLocation = await Location.getCurrentPositionAsync();
      setCurrentLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    })();
  }, [])

  return (
    <GlobalContext.Provider
      value={{
        currentLocation,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;