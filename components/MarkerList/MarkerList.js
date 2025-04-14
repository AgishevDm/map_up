// MarkerList.js
import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { calculateDistance } from '../../utils/geoutils';
import { styles } from './MarkerList.styles';

export default function MarkerList() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const currentLocation = params?.currentLocation || null;
  const markers = params?.markers || [];

  // Сортируем маркеры по ID в обратном порядке
  const sortedMarkers = React.useMemo(() => {
    return (params?.markers || [])
      .slice()
      .sort((a, b) => b.id.localeCompare(a.id));
  }, [params?.markers]);

  // Обработчик нажатия на элемент списка(маркер)
  const handlePressMarker = (marker) => {
    navigation.navigate('Map', { 
      focusMarker: {
        ...marker,
        coordinate: { 
          latitude: marker.coordinate.latitude,
          longitude: marker.coordinate.longitude
        }
      }
    });
  };
  
 // Рендер фото
  const renderPhoto = (photos) => {
    if (!photos || photos.length === 0) {
      return (
        <View style={styles.photoPlaceholder}>
          <Feather name="image" size={32} color="#E5E5EA" />
        </View>
      );
    }
    return (
      <Image 
        source={{ uri: photos[0].uri }} 
        style={styles.thumbnail} 
      />
    );
  };

  const renderListItem = ({ item }) => {
    // Проверяем и форматируем координаты
    const lat = item.coordinate?.latitude || 0;
    const lon = item.coordinate?.longitude || 0;
    
    return (
       <TouchableOpacity 
        onPress={() => handlePressMarker(item)}
        activeOpacity={0.7}
      >
      <View style={styles.listItem}>
        <View style={[styles.colorStrip, { 
          backgroundColor: item.color || '#FF3B30' 
        }]} />
        {renderPhoto(item.photos)}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{item.title || 'Без названия'}</Text>
        
          <Text style={styles.address}>
            {typeof item.address === 'string' 
              ? item.address 
              : 'Адрес не доступен'}
          </Text>

          <Text style={styles.distance}>
            {currentLocation 
              ? `${calculateDistance(
                  currentLocation.latitude,
                  currentLocation.longitude,
                  lat,
                  lon
                )} м`
              : '—'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={sortedMarkers}
      renderItem={renderListItem}
      keyExtractor={item => item.id?.toString()}
      contentContainerStyle={styles.container}
      ListEmptyComponent={
        <Text style={styles.emptyText}>Нет сохраненных меток</Text>
      }
    />
  );
}