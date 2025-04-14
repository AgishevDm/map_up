import React, { useCallback } from 'react';
import { Modal, View, TouchableOpacity, FlatList, Image, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from './MapUP.styles';

const PhotoMod = ({
  visible,
  photos,
  photoIndex,
  flatListRef,
  onDelete,
  onClose,
  windowWidth,
}) => {
  // Обработка URI для Android
  const getUri = useCallback((uri) => {
    if (Platform.OS === 'android') {
      return uri.startsWith('file://') ? uri : `file://${uri}`;
    }
    return uri;
  }, []);

  // Рендер фото с оптимизацией
  const renderItem = useCallback(({ item }) => {
    return (
      <View style={{ width: windowWidth }}>
        <Image
          source={{ uri: getUri(item.uri) }}
          style={styles.fullPhoto}
          resizeMode="contain"
          progressiveRenderingEnabled={true} 
          fadeDuration={0} 
          onLoadStart={() => console.log('Start loading image')}
          onLoadEnd={() => console.log('Image loaded')}
        />
      </View>
    );
  }, [windowWidth]);

  return (
    <Modal  visible={visible}
      transparent
      animationType="none" 
      statusBarTranslucent={true}
      hardwareAccelerated
      onRequestClose={onClose}>
        <View style={styles.photoModal}>
          <FlatList
            ref={flatListRef}
            horizontal
            pagingEnabled
            data={photos}
            initialScrollIndex={photoIndex}
            keyExtractor={(item, index) => `photo_${index}_${item.uri}`}
            getItemLayout={(data, index) => ({
              length: windowWidth,
              offset: windowWidth * index,
              index,
            })}
            windowSize={1} 
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            removeClippedSubviews={true}
            renderItem={renderItem}
          />

          <TouchableOpacity
            style={styles.deletePhotoButton}
            onPress={onDelete}
          >
            <Feather name="trash-2" size={32} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closePhotoButton}
            onPress={onClose}
          >
            <Feather name="x" size={24} color="white" />
          </TouchableOpacity>
        </View>
    </Modal>
  );
};

export default React.memo(PhotoMod);