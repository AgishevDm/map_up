import { useCallback } from 'react';
import { Alert } from 'react-native';
import useGeocoding from './useGeocoding';
import { withTiming } from 'react-native-reanimated';

export default function useMarker({
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
    setTempTitle,
    setTempPhotos,
    selectedMarker
  }) {

  const { getAddressFromCoords } = useGeocoding();

  // Проверка изменений в метке
  const hasChanges = useCallback((originalMarker) => {
    return (
      tempTitle !== originalMarker.title ||
      selectedMarker.color !== originalMarker.color ||
      JSON.stringify(tempPhotos.map(p => p.uri)) !== 
      JSON.stringify(originalMarker.photos.map(p => p.uri))
    );
  }, [tempTitle, tempPhotos, selectedMarker?.color]);

  // Проверка несохраненных изменений
  const checkUnsavedChanges = useCallback(async (currentMarker) => {
    if (!currentMarker) return true;
    
    const originalMarker = markers.find(m => m.id === currentMarker.id);
    if (!originalMarker) return true;

    if (!hasChanges(originalMarker)) return true;

    return new Promise((resolve) => {
      Alert.alert(
        'Несохраненные изменения',
        'Сохранить изменения текущей метки?',
        [
          { text: 'Не сохранять', onPress: () => resolve(false) },
          { text: 'Сохранить', onPress: () => resolve(true) },
          { text: 'Отмена', style: 'cancel', onPress: () => resolve(null) }
        ]
      );
    });
  }, [hasChanges, markers]);

  // Переключение между метками
  const switchMarker = useCallback(async (newMarker) => {
    if (selectedMarker?.id === newMarker.id) return;

    const result = await checkUnsavedChanges(selectedMarker);
    
    if (result === null) return; 
    if (result) await handleSave(selectedMarker);
    
    // Восстанавливаем оригинальные данные если не сохраняли
    if (!result && selectedMarker && !selectedMarker.isNew) {
      const original = markers.find(m => m.id === selectedMarker.id);
      setSelectedMarker(original);
    }

    // Удаляем несохраненные новые метки
    if (!result && selectedMarker?.isNew) {
      setMarkers(prev => prev.filter(m => m.id !== selectedMarker.id));
    }

    // Устанавливаем новую метку
    setSelectedMarker(newMarker);
    setTempTitle(newMarker.title);
    setTempPhotos([...newMarker.photos]);
    translateY.value = withTiming(-height * 0.45);
  }, [selectedMarker, checkUnsavedChanges, handleSave, markers, setMarkers]);

  // Основная функция создания метки
  const createMarker = useCallback(async (coordinate) => {
    if (selectedMarker) {
      const isNew = selectedMarker.isNew;
      const original = isNew ? null : markers.find(m => m.id === selectedMarker.id);
      
      // Проверка необходимости сохранения
      const needSave = isNew || (original && hasChanges(original));

      if (needSave) {
        const result = await new Promise(resolve => {
          Alert.alert(
            'Несохраненные изменения',
            'Сохранить текущую метку перед созданием новой?',
            [
              { text: 'Сохранить', onPress: () => resolve(true) },
              { text: 'Не сохранять', onPress: () => resolve(false) },
              { text: 'Отмена', style: 'cancel', onPress: () => resolve(null) }
            ]
          );
        });

        if (result === null) return; // Отмена
        if (result) await handleSave(selectedMarker);
        if (!result && isNew) {
          setMarkers(prev => prev.filter(m => m.id !== selectedMarker.id));
        }
      }
    }

    // Создание новой метки
    const newMarker = {
      coordinate,
      id: Date.now().toString(),
      photos: [],
      title: 'Новый маркер',
      color: '#FF3B30',
      isNew: true
    };

    // Сброс состояний
    setTempTitle(newMarker.title);
    setTempPhotos([]);
    setSelectedMarker(newMarker);
    setMarkers(prev => [newMarker, ...prev]);

    // Обновление адреса
    try {
      const address = await getAddressFromCoords(coordinate);      
      setAddress( address);
    } catch (error) {
      setAddress(`${coordinate.latitude.toFixed(6)}, ${coordinate.longitude.toFixed(6)}`);
    }

    translateY.value = withTiming(-height * 0.62);
  }, [selectedMarker, markers,getAddressFromCoords, hasChanges, handleSave, setMarkers, setSelectedMarker]);

  // Сохранение маркера
  const handleSave = useCallback(async (selectedMarker) => {
    if (!selectedMarker) return;

    // Получение адреса
    const address = await getAddressFromCoords(selectedMarker.coordinate);

    const updatedMarker = {
      ...selectedMarker,
      title: tempTitle,
      photos: tempPhotos,
      address,
      isNew: false
    };

    setMarkers(prev => prev.map(m => m.id === updatedMarker.id ? updatedMarker : m));
    translateY.value = withTiming(0);
    setSelectedMarker(null);
  }, [tempTitle, tempPhotos, getAddressFromCoords, currentLocation, notificationManager, setMarkers, setSelectedMarker]);

  // Удаление маркера
  const handleDeleteMarker = useCallback((selectedMarker) => {
    Alert.alert('Удалить маркер', 'Вы уверены?', [
      { text: 'Отмена' },
      {
        text: 'Удалить',
        onPress: () => {
          notificationManager.cancelNotification(selectedMarker.id);
          setMarkers(prev => prev.filter(m => m.id !== selectedMarker.id));
          translateY.value = withTiming(0);
          setSelectedMarker(null);
        }
      },
    ]);
  }, [setMarkers, notificationManager, setSelectedMarker]);


  // Создание маркера текущего местоположения
  const createCurrentLocationMarker = useCallback(async () => {
    if (!currentLocation) return;
    return createMarker(currentLocation, true);
  }, [currentLocation, createMarker]);  

  return {
    createMarker,
    createCurrentLocationMarker,
    handleSave,
    handleDeleteMarker,
    switchMarker
  };
}