import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Platform, InteractionManager  } from 'react-native';
import { AntDesign, MaterialIcons, Feather } from '@expo/vector-icons';
import Animated, { withTiming } from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { TouchableWithoutFeedback } from 'react-native';
import Color from 'color';
import { calculateDistance } from '../../utils/geoutils';
import { styles } from './MapUP.styles';
import { COLOR_PALETTE } from '../../constants/constants';

const MarkerPanel = ({
  selectedMarker,
  tempTitle,
  setTempTitle,
  tempPhotos,
  address,
  currentLocation,
  panGesture,
  animatedStyle,
  translateY,
  handleSave,
  handleClosePanel,
  handleAddPhoto,
  handleDeletePhoto,
  handleDeleteMarker,
  setSelectedMarker,
  photoIndex,
  setPhotoIndex,
  photosVisible,
  setPhotosVisible,
  deleteMode,
  setDeleteMode,
  height,
  confirmDeletePhoto,
}) => {
  const [activeDeleteIndex, setActiveDeleteIndex] = useState(null);

  // Обработчик нажатия на свободную область
  const handleBackgroundPress = useCallback(() => {
    setActiveDeleteIndex(null);
    setDeleteMode(false);
  }, []);

  // Рендер фотографий с учетом платформы
  const renderPhotoItem = useCallback(({ item, index }) => {
     const uri = Platform.OS === 'android' 
    ? item.uri.startsWith('file://') ? item.uri : `file://${item.uri}`
    : item.uri;

    return (
      <TouchableOpacity
        onPress={() => {
          if (Platform.OS === 'android') return;
          if (activeDeleteIndex !== null) return;
          setPhotoIndex(index);
          setPhotosVisible(true);
        }}
        onLongPress={() => {
          setActiveDeleteIndex(index);
          setDeleteMode(true);
        }}
        style={styles.photoContainer}
      >
        <Image
          source={{ uri }}
          style={styles.photoThumbnail}
          resizeMode="cover"
          onError={(e) => console.error('Ошибка загрузки:', e.nativeEvent.error)}
        />
        
        {activeDeleteIndex === index && (
          <TouchableOpacity
            style={styles.deleteThumbnailButton}
            onPress={() => {
              confirmDeletePhoto(index);
              setActiveDeleteIndex(null);
            }}
          >
            <Feather name="x-circle" size={24} color="#FF3B30" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }, [activeDeleteIndex, deleteMode]);

  return (
    <GestureDetector gesture={panGesture}>
      <TouchableWithoutFeedback onPress={handleBackgroundPress}>
        <Animated.View style={[styles.panel, animatedStyle]}>
          <View style={styles.panelHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClosePanel}
            >
              <Feather name="chevron-down" size={24} color="#666" />
            </TouchableOpacity>

            <View style={styles.dragHandle} />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => handleSave(selectedMarker)}
            >
              <AntDesign name="check" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <TextInput
              style={styles.titleInput}
              value={tempTitle}
              onChangeText={setTempTitle}
              placeholder="Название метки"
              placeholderTextColor="#8E8E93"
              onFocus={() => (translateY.value = withTiming(-height * 0.62))}
              onBlur={() => (translateY.value = withTiming(-height * 0.45))}
            />

            <Text style={styles.address}>
              {address.includes('Расстояние:') 
                ? address 
                : `Расстояние: ${calculateDistance(
                    currentLocation?.latitude,
                    currentLocation?.longitude,
                    selectedMarker?.coordinate.latitude,
                    selectedMarker?.coordinate.longitude
                  )} м | ${address}`}
            </Text>

            <Text style={styles.sectionTitle}>Цвет маркера</Text>
            <View style={styles.colorPicker}>
              {COLOR_PALETTE.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorButton,
                    {
                      backgroundColor: color,
                      borderColor:
                        selectedMarker.color === color
                          ? Color(color).darken(0.3).hex()
                          : '#E5E5EA',
                    },
                  ]}
                  onPress={() =>
                    setSelectedMarker((prev) => ({ ...prev, color }))
                  }
                />
              ))}
            </View>

            <Text style={styles.sectionTitle}>Фотографии</Text>
            <View style={styles.photoButtons}>
              <TouchableOpacity
                style={styles.photoButton}
                onPress={() => handleAddPhoto('camera')}
              >
                <Feather name="camera" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.photoButton}
                onPress={() => handleAddPhoto('gallery')}
              >
                <Feather name="image" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <FlatList
              horizontal
              data={tempPhotos}
              keyExtractor={(_, i) => i.toString()}
              contentContainerStyle={styles.photosContainer}
              renderItem={renderPhotoItem}
            />

            <TouchableOpacity
              style={styles.deleteMarkerButton}
              onPress={() => handleDeleteMarker(selectedMarker)}
            >
              <MaterialIcons name="delete-outline" size={24} color="#FF3B30" />
              <Text style={styles.deleteMarkerText}>Удалить метку</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </GestureDetector>
  );
};

export default React.memo(MarkerPanel);