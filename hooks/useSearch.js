import { useState } from 'react';
import { Alert, Keyboard } from 'react-native';
import * as Location from 'expo-location';

export default function useSearch({ mapRef, createMarker }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchExpanded, setSearchExpanded] = useState(false);

  const handleSearch = async () => {
    try {
      if (!searchQuery.trim()) return;
      
      const results = await Location.geocodeAsync(searchQuery);
      if (results.length === 0) {
        Alert.alert('Ошибка', 'Адрес не найден');
        return;
      }

      const { latitude, longitude } = results[0];
      const coordinate = {
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      mapRef.current?.animateToRegion(coordinate, 1000);
      createMarker(coordinate);
      
      setSearchQuery('');
      setSearchExpanded(false);
      Keyboard.dismiss();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось выполнить поиск');
      console.error('Search error:', error);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    searchExpanded,
    setSearchExpanded,
    handleSearch
  };
}