import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import { TouchableOpacity, } from 'react-native';
import { Feather } from '@expo/vector-icons';
import MapScreen from './components/MapUP/MapUP';
import MarkerList from './components/MarkerList/MarkerList'; 
import { notificationManager } from './services/notifications';
import { STORAGE_KEY } from './constants/constants';
import useGeocoding from './hooks/useGeocoding';

const Stack = createStackNavigator();

export default function App() {
  const [markers, setMarkers] = React.useState([]);
  const { getAddressFromCoords } = useGeocoding();

  // Загрузка маркеров при запуске
  useEffect(() => {
    const loadMarkers = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue) {
          const loadedMarkers = JSON.parse(jsonValue);
          // Сортируем при загрузке
          const sortedMarkers = loadedMarkers
          .sort((a, b) => b.id.localeCompare(a.id));
          
          // Миграция данных
          const migratedMarkers = await Promise.all(
            loadedMarkers.map(async m => {
              if (m.address) return m;
              return {
                ...m,
                address: await getAddressFromCoords(m.coordinate)
              };
            })
          );
          
          setMarkers(sortedMarkers);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(migratedMarkers));
        }
      } catch (e) {
        console.error('Ошибка загрузки маркеров:', e);
      }
    };
    loadMarkers();
  }, []);

  // Сохранение маркеров при изменении
  useEffect(() => {
    const saveMarkers = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(markers));
      } catch (e) {
        console.error('Ошибка сохранения маркеров:', e);
      }
    };
    saveMarkers();
  }, [markers]);

  // Настройка разрешений и уведомлений
  useEffect(() => {
    const setupPermissions = async () => {
      await notificationManager.requestPermissions();
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Доступ к геолокации запрещен');
      }
      Notifications.addNotificationReceivedListener(notification => {
        console.log('Уведомление получено:', notification);
      });
    };
    setupPermissions();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Map">
        <Stack.Screen
          name="Map"
          options={{ 
            headerShown: false,
            gestureEnabled: false 
          }}
        >
          {props => <MapScreen {...props} markers={markers} setMarkers={setMarkers} />}
        </Stack.Screen>
      
        <Stack.Screen
          name="MarkerList"
          component={MarkerList}
          options={{ 
            title: 'Список меток',
            headerBackTitleVisible: false,
            headerLeft: ({ onPress }) => (
              <TouchableOpacity 
                style={{ marginLeft: 15 }}
                onPress={onPress}
              >
                <Feather name="arrow-left" size={24} color="#007AFF" />
              </TouchableOpacity>
            )
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}