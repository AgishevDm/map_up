import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Alert, TextInput, TouchableOpacity, Text, Dimensions, Modal, FlatList, Image, useWindowDimensions, Keyboard, KeyboardAvoidingView, Platform,} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { AntDesign, MaterialIcons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import MarkerPanel from './MarkerPanel';
import PhotoMod from './PhotoMod';
import MapSearch from './MapSearch';
import { notificationManager } from '../../services/notifications';
import useLocations from '../../hooks/useLocation';
import usePhotos from '../../hooks/usePhotos';
import useMarker from '../../hooks/useMarker';
import useSearch from '../../hooks/useSearch';
import { formatAddress, calculateDistance } from '../../utils/geoutils';
import { styles } from './MapUP.styles';

const { height, width } = Dimensions.get('window');

export default function MapScreen({ markers, setMarkers }) {
  const mapRef = useRef(null);
  const route = useRoute();
  const flatListRef = useRef(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [tempTitle, setTempTitle] = useState('');
  const { currentLocation, address, setAddress } = useLocations( markers, selectedMarker );
  const translateY = useSharedValue(0);
  const contextY = useSharedValue(0);
  const windowWidth = useWindowDimensions().width;
  const navigation = useNavigation();

  const {tempPhotos, setTempPhotos, photoIndex, setPhotoIndex, photosVisible, 
  setPhotosVisible, deleteMode, setDeleteMode, handleAddPhoto, confirmDeletePhoto, handleDeletePhoto,} = usePhotos();

  const { createMarker, createCurrentLocationMarker, handleSave, handleDeleteMarker, switchMarker,} 
  = useMarker({
    markers,
    setMarkers,
    currentLocation,
    setAddress,
    notificationManager,
    tempPhotos,
    tempTitle,
    translateY,
    height,
    setSelectedMarker,
    selectedMarker,
    setTempTitle,
    setTempPhotos,
  });

  const {searchQuery, setSearchQuery, searchExpanded, setSearchExpanded, handleSearch,} = useSearch({ mapRef, createMarker });
 // Перемещение из списка к метке
  useEffect(() => {
    const focusMarker = route.params?.focusMarker;
    
    if (focusMarker) {
      const fullMarker = markers.find(m => m.id === focusMarker.id);
      
      if (fullMarker) {
        mapRef.current?.animateToRegion({
          latitude: fullMarker.coordinate.latitude,
          longitude: fullMarker.coordinate.longitude,
          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
        }, 1000);

        // Обновляем состояние после анимации
        setTimeout(() => {
          handleMarkerPress(fullMarker);
          navigation.setParams({ focusMarker: null }); 
        }, 500);
      }
    }
  }, [route.params?.focusMarker, markers]);

  // Обработка нажатия на маркер
  const handleMarkerPress = async (marker) => {
    if (selectedMarker?.id === marker.id) return;
    await switchMarker(marker);

    setSelectedMarker(marker);
    setTempTitle(marker.title);
    setTempPhotos(marker.photos);

    try {
      const reverseGeocode = await Location.reverseGeocodeAsync(
        marker.coordinate
      );
      const formattedAddress = formatAddress( reverseGeocode[0], marker.coordinate );
      if (currentLocation) {
        const distance = calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          marker.coordinate.latitude,
          marker.coordinate.longitude
        );
        setAddress(`Расстояние: ${distance} м | ${formattedAddress}`);
      } else {
        setAddress(formattedAddress);
      }
    } catch (error) {
      console.error('Ошибка получения адреса:', error);
      setAddress(
        `${marker.coordinate.latitude.toFixed(
          6
        )}, ${marker.coordinate.longitude.toFixed(6)}`
      );
    }
    translateY.value = withTiming(-height * 0.60);
  };

  // Анимация панели
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Обработка длительного нажатия
  const handleLongPress = (e) => {
    createMarker(e.nativeEvent.coordinate);
  };

  // Жесты для управления панелью
  const panGesture = Gesture.Pan()
    .onStart(() => {
      contextY.value = translateY.value;
    })
    .onUpdate((e) => {
      const newY = e.translationY + contextY.value;
      translateY.value = Math.max(
        -height * 0.75,
        Math.min(newY, -height * 0.12)
      ); //не выше 62 не ниже 12% экрана
    });

  // Закрытие панели с проверкой изменений
  const handleClosePanel = useCallback(() => {
    const originalMarker = markers.find((m) => m.id === selectedMarker.id);

    const hasChanges =
      tempTitle !== originalMarker.title ||
      selectedMarker.color !== originalMarker.color ||
      JSON.stringify(tempPhotos) !== JSON.stringify(originalMarker.photos);

    if (hasChanges || selectedMarker.isNew) {
      Alert.alert(
        selectedMarker.isNew ? 'Сохранение маркера' : 'Сохранение изменений',
        selectedMarker.isNew
          ? 'Хотите сохранить новый маркер?'
          : 'Хотите сохранить изменения?',
        [
          {
            text: 'Нет',
            onPress: () => {
              if (selectedMarker.isNew) {
                setMarkers((prev) =>
                  prev.filter((m) => m.id !== selectedMarker.id)
                );
              } else {
                // Восстанавливаем исходные значения
                setSelectedMarker(originalMarker);
              }
              translateY.value = withTiming(0);
              setSelectedMarker(null);
            },
          },
          {
            text: 'Да',
            onPress: () => {
              handleSave(selectedMarker);
              translateY.value = withTiming(0);
            },
          },
        ]
      );
    } else {
      translateY.value = withTiming(0);
      setSelectedMarker(null);
    }
  }, [tempTitle, tempPhotos, selectedMarker, markers, handleSave, setMarkers]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.select({
        ios: 0,
        android: 50,
        web: 0,
      })}>

      <MapSearch 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchExpanded={searchExpanded}
        setSearchExpanded={setSearchExpanded}
        handleSearch={handleSearch}
      />
      
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={
          currentLocation
            ? {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }
            : undefined
        }
        onLongPress={handleLongPress}>

        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
            flat={true}
            rotation={currentLocation.heading || 0}>
            <Animated.View
              style={[
                styles.userMarker,
                {
                  transform: [{ rotate: `${currentLocation.heading}deg` }],
                },
              ]}>
              <MaterialIcons name="navigation" size={28} color="#007AFF" />
            </Animated.View>
          </Marker>
        )}

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            onPress={() => handleMarkerPress(marker)}
          >
            <View style={styles.markerContainer}>
              <View style={[
                styles.markerPin,
                {
                  backgroundColor: selectedMarker?.id === marker.id 
                    ? marker.color 
                    : `${marker.color}50`,
                },
              ]}>
                <Feather
                  name="map-pin"
                  size={24}
                  color={marker.color === '#FFFFFF' ? '#FF3B30' : 'white'}
                  style={styles.markerIcon}
                />
              </View>
            </View>
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={createCurrentLocationMarker}>
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity>

      {selectedMarker && (
        <MarkerPanel
          selectedMarker={selectedMarker}
          tempTitle={tempTitle}
          setTempTitle={setTempTitle}
          tempPhotos={tempPhotos}
          address={address}
          currentLocation={currentLocation}
          panGesture={panGesture}
          animatedStyle={animatedStyle}
          translateY={translateY}
          handleSave={handleSave}
          handleClosePanel={handleClosePanel}
          handleAddPhoto={handleAddPhoto}
          handleDeletePhoto={handleDeletePhoto}
          handleDeleteMarker={handleDeleteMarker}
          setSelectedMarker={setSelectedMarker}
          photoIndex={photoIndex}
          setPhotoIndex={setPhotoIndex}
          photosVisible={photosVisible}
          setPhotosVisible={setPhotosVisible}
          deleteMode={deleteMode}
          setDeleteMode={setDeleteMode}
          height={height}
          windowWidth={windowWidth}
          flatListRef={flatListRef}
          confirmDeletePhoto={confirmDeletePhoto}
        />
      )}

      <PhotoMod
        visible={photosVisible}
        photos={tempPhotos}
        photoIndex={photoIndex}
        flatListRef={flatListRef}
        onDelete={() => confirmDeletePhoto(photoIndex)}
        onClose={() => {
          setPhotosVisible(false);
          setPhotoIndex(0);
        }}
        windowWidth={windowWidth}
      />
 
      <TouchableOpacity
        style={styles.starButton}
        onPress={() =>
          navigation.navigate('MarkerList', {
            markers: markers
              .filter(m => !m.isNew)
              .map(m => ({
                ...m,
                coordinate: { 
                  latitude: m.coordinate.latitude,
                  longitude: m.coordinate.longitude
                }
              })),
            currentLocation: currentLocation ? { 
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude
            } : null
          })
        }>
        <Feather name="star" size={28} color="#FFD700" />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}