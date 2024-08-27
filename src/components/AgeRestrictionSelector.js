import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Text } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';

const AgeRestrictionSelector = ({ selectedAgeRestriction, onSelectAgeRestriction }) => {
  const [ageRestrictions, setAgeRestrictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgeRestrictions = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/age-restriction`);
        setAgeRestrictions(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error loading age restrictions');
        setLoading(false);
      }
    };

    fetchAgeRestrictions();
  }, []);

  const handleSelect = (restrictionId) => {
    // Если элемент уже выбран, сбрасываем выбор
    if (selectedAgeRestriction === restrictionId) {
      onSelectAgeRestriction(null);
    } else {
      onSelectAgeRestriction(restrictionId);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#e28743" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {ageRestrictions.map((restriction) => (
        <TouchableOpacity
          key={restriction._id}
          onPress={() => handleSelect(restriction._id)}
          style={[
            styles.imageContainer,
            selectedAgeRestriction === restriction._id && styles.selectedImageContainer,
          ]}
        >
          <Image
            source={{ uri: `${API_URL}/api/image?path=${encodeURIComponent(restriction.imageUrl)}` }}
            style={styles.image}
            cachePolicy="memory-disk" // Кэширование изображений
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  imageContainer: {
    padding: 5,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedImageContainer: {
    borderColor: '#e28743',
  },
  image: {
    width: 50,
    height: 50,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  errorContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  errorText: {
    color: 'red',
  },
});

export default AgeRestrictionSelector;
