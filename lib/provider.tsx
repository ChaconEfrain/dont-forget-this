import React, { createContext, ReactNode, useEffect, useState } from "react";
import { getCurrentUser } from "./appwrite";
import { useAppwrite } from "../hooks/useAppwrite";
import { Alert } from "react-native";
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

export interface GlobalContextType {
  isLogged: boolean;
  user: User | null;
  loading: boolean;
  currentLocation: LocationI | undefined;
  refetch: (newParams?: Record<string, string | number>) => Promise<void>;
}

export interface User {
  $id: string;
  name: string;
  email: string;
  avatar: string;
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

  const {
    data: user,
    loading,
    refetch,
  } = useAppwrite({
    fn: getCurrentUser,
  });

  const isLogged = !!user;

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
        isLogged,
        user,
        currentLocation,
        loading,
        refetch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;