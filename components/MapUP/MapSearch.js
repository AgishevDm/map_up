import React from 'react';
import { View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from './MapUP.styles';

export default function MapSearch({
  searchQuery,
  setSearchQuery,
  searchExpanded,
  setSearchExpanded,
  handleSearch
}) {
  
  return (
    <View style={styles.searchContainer}>
      {searchExpanded ? (
        <View style={styles.searchExpanded}>
          <TouchableOpacity
            style={styles.closeSearchButton}
            onPress={() => {
              setSearchExpanded(false);
              setSearchQuery('');
              Keyboard.dismiss();
            }}>
            <Feather name="x" size={24} color="#666" />
          </TouchableOpacity>

          <TextInput
            style={styles.searchInput}
            placeholder="Введите адрес..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
            onSubmitEditing={handleSearch}
          />

          <TouchableOpacity
            style={styles.searchActionButton}
            onPress={handleSearch}>
            <Feather name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.searchIconButton}
          onPress={() => setSearchExpanded(true)}>
          <Feather name="search" size={24} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );
}