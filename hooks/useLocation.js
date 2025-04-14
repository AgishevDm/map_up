import { useState, useEffect, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { notificationManager } from '../services/notifications';
import { calculateDistance } from '../utils/geoutils';
import { LOCATION_TASK_NAME, PROXIMITY_THRESHOLD } from '../constants/constants';

export default function useLocations(markers, selectedMarker) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [address, setAddress] = useState('');
  const markersRef = useRef(markers);

  // Обновляем ref при изменении markers
  useEffect(() => { markersRef.current = markers;}, [markers]);

  // Функция проверки приближения
  const checkProximity = useCallback((userCoords) => {
    markersRef.current.forEach(marker => {
      const distance = calculateDistance(
        userCoords.latitude,
        userCoords.longitude,
        marker.coordinate.latitude,
        marker.coordinate.longitude
      );

      if (distance <= PROXIMITY_THRESHOLD) {
        notificationManager.triggerNotification(
          marker.id,
          'Приближение к метке',
          `Вы в ${Math.round(distance)}м от "${marker.title}"`
        );
      }
    });
  }, []);

  // Логика отслеживания местоположения
  useEffect(() => {
    let locationSubscription;
    
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        
        const location = await Location.getCurrentPositionAsync({ 
          enableHighAccuracy: true 
        });
        
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 5,
            timeInterval: 1000,
          },
          (newLocation) => {
            setCurrentLocation(newLocation.coords);
            checkProximity(newLocation.coords);
          }
        );
      } catch (error) {
        console.error('Ошибка получения местоположения:', error);
      }
    };

    getLocation();
    return () => locationSubscription?.remove();
  }, [checkProximity]);

  // Обновление расстояния до выбранного маркера
  useEffect(() => {
    if (!selectedMarker || !currentLocation) return;
    
    const interval = setInterval(() => {
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        selectedMarker.coordinate.latitude,
        selectedMarker.coordinate.longitude
      );
      
      setAddress(prev => 
        prev.replace(/Расстояние: \d+ м \|/, `Расстояние: ${distance} м |`)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedMarker, currentLocation]);

  // Фоновая задача отслеживания
  useEffect(() => {
    const handleLocationUpdate = ({ data, error }) => {
      if (error) {
        console.error('Ошибка фонового отслеживания:', error);
        return;
      }
      if (data?.locations) {
        const lastLocation = data.locations[data.locations.length - 1];
        checkProximity(lastLocation.coords);
      }
    };

    // Регистрация фоновой задачи
    TaskManager.defineTask(LOCATION_TASK_NAME, handleLocationUpdate);

    const startBackgroundTracking = async () => {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
      if (!isRegistered) {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,
          distanceInterval: 10,
          showsBackgroundLocationIndicator: true,
        });
      }
    };

    startBackgroundTracking();
    return () => Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  }, [checkProximity]);

  return { currentLocation, address, setAddress };
}