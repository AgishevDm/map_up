import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function usePhotos() {
  const [tempPhotos, setTempPhotos] = useState([]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [photosVisible, setPhotosVisible] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  // Добавление фото
  const handleAddPhoto = async (type) => {
    try {
      let result;
      if (type === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Доступ запрещён',
            'Необходимо разрешение для использования камеры'
          );
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          quality: 1,
          allowsEditing: false,
        });
      } else {
        // Запрос разрешения для галереи
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Доступ запрещён',
            'Необходимо разрешение для доступа к галерее'
          );
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          quality: 1,
        });
      }
      if (!result.canceled) {
        const newPhotos = result.assets.map((a) => ({
          uri: a.uri,
        }));
        setTempPhotos((prev) => [...newPhotos, ...prev]);
      }
    } catch (error) {
      handleError('Ошибка добавления фото:', error);
    }
  };

  // Удаление фото
  const confirmDeletePhoto = (index) => {
    Alert.alert('Удаление фото', 'Вы действительно хотите удалить фото?', [
      { text: 'Нет' },
      { text: 'Да', onPress: () => handleDeletePhoto(index) },
    ]);
  };

  const handleDeletePhoto = (index) => {
    const newPhotos = tempPhotos.filter((_, i) => i !== index);
    setTempPhotos(newPhotos);
    
    if (photoIndex >= newPhotos.length) {
      setPhotoIndex(prev => Math.max(0, prev - 1));
    }
    
    if (newPhotos.length === 0) {
      setPhotosVisible(false);
    }
  };

  return {
    tempPhotos,
    setTempPhotos,
    photoIndex,
    setPhotoIndex,
    photosVisible,
    setPhotosVisible,
    deleteMode,
    setDeleteMode,
    handleAddPhoto,
    confirmDeletePhoto,
    handleDeletePhoto
  };
}