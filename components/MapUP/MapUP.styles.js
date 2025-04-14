import { StyleSheet, Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // Основной контейнер экрана
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  // Стили для карты
  map: {
    flex: 1,
  },
  // Контейнер для маркера на карте
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Стиль самого маркера (иконка)
  markerPin: {
    borderRadius: 20,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  // Кнопка добавления нового маркера
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#007AFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  // Панель редактирования маркера (выдвижная)
   panel: {
    position: 'absolute',
    height: height * 0.75,
    bottom: -height * 0.75,
    zIndex: 2,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 20,
    // Адаптация для планшетов
    ...(width >= 768 && height >= 768 && {
      left: 20,
      right: undefined,
      height: height * 0.40,
      bottom: -height * 0.75,
      width: 430,
      maxWidth: 430,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
    }),
  },
  // Ручка для dragging панели
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#D1D1D6',
    borderRadius: 25,
    marginTop: -35,
    marginHorizontal: 16,
  },
  // Шапка панели редактирования
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 30,
    marginBottom: 8,
  },
  // Кнопка закрытия панели
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Кнопка сохранения изменений
  saveButton: {
    backgroundColor: '#34C759',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Основное содержимое панели
  content: {
    flex: 1,
    paddingHorizontal: 8,
  },
  // Поле ввода названия метки
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
    paddingVertical: 10,
  },
  // Текст с адресом метки
  address: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 24,
  },
  // Заголовки секций в панели
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  // Контейнер для выбора цвета
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginBottom: 20,
  },
  // Кнопка выбора цвета
  colorButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
  },
  // Контейнер для кнопок добавления фото
  photoButtons: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  // Кнопка добавления фото
  photoButton: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#007AFFCC',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  // Контейнер для превью фотографий
  photosContainer: {
    paddingBottom: 10,
    marginBottom: 15,
  },
  // Контейнер для фотографии
  photoContainer: {
    position: 'relative',
    marginRight: 12,
  },
  // Превью фотографии
  photoThumbnail: {
    width: 145,
    height: 145,
    borderRadius: 12,
    backgroundColor: '#F0F0F5',
  },
  // Кнопка удаления фото из превью
  deleteThumbnailButton: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 4,
    elevation: 3,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  // Кнопка удаления маркера
  deleteMarkerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    marginTop: 'auto',
  },
  // Текст кнопки удаления маркера
  deleteMarkerText: {
    color: '#FF3B30',
    marginLeft: 8,
    fontWeight: '500',
    fontSize: 16,
  },
  // Модальное окно просмотра фото
  photoModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    zIndex: 9999, 
    elevation: 9999
  },
  // Полноразмерное фото в модалке
  fullPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    backgroundColor: 'black', // Фон для артефактов
  },
  // Кнопка удаления фото в просмотре
  deletePhotoButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    backgroundColor: 'rgba(255,59,48,0.9)',
    borderRadius: 30,
    padding: 14,
  },
  // Кнопка закрытия просмотра фото
  closePhotoButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 25,
    padding: 10,
  },
  // Контейнер поисковой панели
  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  // Иконка поиска в свернутом состоянии
  searchIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  // Развернутая поисковая панель
  searchExpanded: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  // Поле ввода поисковика
  searchInput: {
    flex: 1,
    height: 40,
    marginHorizontal: 8,
    fontSize: 16,
    color: '#1C1C1E',
    right: 10,
  },
  // Кнопка выполнения поиска
  searchActionButton: {
    width: 80,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#20B2AA',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    position: 'absolute',
    right: 3,
  },
  // Кнопка закрытия поисковика
  closeSearchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    right: 10,
  },
  userMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  userMarkerInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starButton: {
    position: 'absolute',
    right:  20,
    zIndex: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 25,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    bottom:  90, 
  },
  contextMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  contextMenu: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    gap: 15,
    zIndex: 1000,
  },
  contextMenuItem: {
    padding: 8,
    backgroundColor: '#F5F5F7',
    borderRadius: 8,
  },
});