import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5F5F7'
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    height: 100,
    elevation: 2
  },
  colorStrip: {
    width: 8,
    height: '100%'
  },
  thumbnail: {
    width: 100,
    height: 100,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#F0F0F5',
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E'
  },
  address: {
    color: '#8E8E93',
    fontSize: 12
  },
  distance: {
    color: '#34C759',
    fontSize: 14,
    fontWeight: '500'
  },
  emptyText: {
    textAlign: 'center',
    color: '#8E8E93',
    marginTop: 20
  }
});