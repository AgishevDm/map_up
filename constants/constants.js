// constants/constants.js
import { Dimensions } from 'react-native';

export const LOCATION_TASK_NAME = 'background-location-task';
export const PROXIMITY_THRESHOLD = 100;
export const STORAGE_KEY = '@map_markers';
export const PANEL_HEIGHT_RATIO = 0.62;

export const COLOR_PALETTE = [
  '#FF3B30',
  '#FFCC00',
  '#34C759',
  '#AF52DE',
  '#007AFF',
  '#FF69B4',
  '#00CED1',
  '#030303',
];

export const getWindowDimensions = () => ({
  height: Dimensions.get('window').height,
  width: Dimensions.get('window').width,
});