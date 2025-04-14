import * as Location from 'expo-location';
import { formatAddress } from '../utils/geoutils';

export default function useGeocoding() {
  const getAddressFromCoords = async (coordinate) => {
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync(coordinate);
      return formatAddress(reverseGeocode[0], coordinate);
    } catch (error) {
      console.error('Geocoding error:', error);
      return `${coordinate.latitude.toFixed(6)}, ${coordinate.longitude.toFixed(6)}`;
    }
  };

  return { getAddressFromCoords };
}
