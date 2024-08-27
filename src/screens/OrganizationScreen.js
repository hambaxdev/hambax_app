import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Alert, Linking, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image'; // Импортируем Image из expo-image
import defaultBackground from '../assets/defaultBackground.png';
import defaultAvatar from '../assets/defaultAvatar.png';
import EditModal from '../components/EditModal';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const OrganizationScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [organization, setOrganization] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [backgroundImage, setBackgroundImage] = useState(defaultBackground);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const response = await axios.get(`${API_URL}/api/organization/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        setOrganization(data.organization);
        setEvents(data.upcomingEvents);

        if (data.avatar) {
          setAvatar(`${API_URL}/api/image?path=${encodeURIComponent(data.avatar)}`);
        }

        if (data.backgroundImage) {
          setBackgroundImage(`${API_URL}/api/image?path=${encodeURIComponent(data.backgroundImage)}`);
        }
      } catch (error) {
        console.error('Error fetching organization:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, []);

  const handleEditAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const uploadResult = await FileSystem.uploadAsync(`${API_URL}/api/organization/upload-avatar`, result.uri, {
          httpMethod: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: 'avatar',
        });

        if (uploadResult.status !== 200) {
          console.error('Failed to upload avatar:', uploadResult.body);
          Alert.alert('Error', 'Failed to upload avatar. Please try again.');
          return;
        }

        const response = JSON.parse(uploadResult.body);
        setAvatar(`${API_URL}/api/image?path=${encodeURIComponent(response.avatar)}`);
      } catch (error) {
        console.error('Failed to upload avatar:', error);
        Alert.alert('Error', 'Failed to upload avatar. Please try again.');
      }
    }
  };

  const handleEditBackground = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const uploadResult = await FileSystem.uploadAsync(`${API_URL}/api/organization/upload-background`, selectedAsset.uri, {
          httpMethod: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: 'backgroundImage',
        });

        if (uploadResult.status !== 200) {
          console.error('Failed to upload background image:', uploadResult.body);
          Alert.alert('Error', 'Failed to upload background image. Please try again.');
          return;
        }

        const response = JSON.parse(uploadResult.body);
        setBackgroundImage(`${API_URL}/api/image?path=${encodeURIComponent(response.backgroundImage)}`);
      } catch (error) {
        console.error('Failed to upload background image:', error);
        Alert.alert('Error', 'Failed to upload background image. Please try again.');
      }
    }
  };

  const handleEditInfo = () => {
    setIsEditModalVisible(true);
  };

  const openSocialLink = (url) => {
    if (url) {
      Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
    }
  };

  const navigateToEditEvent = (eventId) => {
    navigation.navigate('EditEvent', { eventId });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Text>{t('loading')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={typeof backgroundImage === 'string' && backgroundImage.startsWith('http') ? { uri: backgroundImage } : backgroundImage}
          style={styles.backgroundImage}
          cachePolicy="memory-disk" // Кэширование изображения
        />
        <TouchableOpacity style={styles.editIconBackground} onPress={handleEditBackground}>
          <Icon name="edit" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.avatarContainer}>
          <Image
            source={typeof avatar === 'string' && avatar.startsWith('http') ? { uri: avatar } : avatar}
            style={styles.avatar}
            cachePolicy="memory-disk" // Кэширование изображения
          />
          <TouchableOpacity style={styles.editIconAvatar} onPress={handleEditAvatar}>
            <Icon name="edit" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <TouchableOpacity style={styles.editIconInfo} onPress={handleEditInfo}>
          <Icon name="edit" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.organizationName}>{organization.organizationName}</Text>
        
        
        <Text style={styles.organizationDescription}>{organization.description}</Text>
        <View style={styles.socialLinksContainer}>
          {organization.socialLinks?.facebook && (
            <TouchableOpacity onPress={() => openSocialLink(organization.socialLinks.facebook)} style={styles.socialIcon}>
              <FontAwesome name="facebook" size={24} color="#3b5998" />
            </TouchableOpacity>
          )}
          {organization.socialLinks?.instagram && (
            <TouchableOpacity onPress={() => openSocialLink(organization.socialLinks.instagram)} style={styles.socialIcon}>
              <FontAwesome name="instagram" size={24} color="#E1306C" />
            </TouchableOpacity>
          )}
          {organization.socialLinks?.twitter && (
            <TouchableOpacity onPress={() => openSocialLink(organization.socialLinks.twitter)} style={styles.socialIcon}>
              <FontAwesome name="twitter" size={24} color="#1DA1F2" />
            </TouchableOpacity>
          )}
          {organization.socialLinks?.linkedin && (
            <TouchableOpacity onPress={() => openSocialLink(organization.socialLinks.linkedin)} style={styles.socialIcon}>
              <FontAwesome name="linkedin" size={24} color="#0077b5" />
            </TouchableOpacity>
          )}
          {organization.socialLinks?.youtube && (
            <TouchableOpacity onPress={() => openSocialLink(organization.socialLinks.youtube)} style={styles.socialIcon}>
              <FontAwesome name="youtube" size={24} color="#FF0000" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.eventsContainer}>
        <Text style={styles.eventsTitle}>{t('upcomingEvents')}</Text>
        {events.length > 0 ? (
          events.map((event) => (
            <TouchableOpacity key={event._id} onPress={() => navigateToEditEvent(event._id)}>
              <View style={styles.eventCard}>
                <Image
                  source={{ uri: `${API_URL}/api/image?path=${encodeURIComponent(event.imageUrl)}` }}
                  style={styles.eventImage}
                  cachePolicy="memory-disk"
                />
                <View style={styles.eventContent}>
                  <Text style={styles.eventName}>{event.name}</Text>
                  <Text style={styles.eventDescription}>{event.description}</Text>
                  <Text style={styles.eventDate}>
                    {t('date')}: {new Date(event.date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.eventPrice}>
                    {t('price')}: {event.price} EUR
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noEventsText}>{t('noUpcomingEvents')}</Text>
        )}
      </View>

      <EditModal
        visible={isEditModalVisible}
        fields={['description', 'socialLinks.facebook', 'socialLinks.instagram', 'socialLinks.twitter', 'socialLinks.linkedin', 'socialLinks.youtube']}
        data={organization}
        onClose={() => setIsEditModalVisible(false)}
        onSave={(updatedData) => {
          setOrganization((prevData) => ({
            ...prevData,
            description: updatedData.description || prevData.description,
            socialLinks: {
              ...prevData.socialLinks,
              ...updatedData.socialLinks,
            },
          }));
        }}
        apiEndpoint={`/api/organization/${organization.userId}`}
        requestMethod="PUT"
      />
    </ScrollView>
  );
};

// Добавление стилей для новых элементов
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    height: 250,
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  editIconBackground: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 20,
  },
  avatarContainer: {
    position: 'absolute',
    bottom: -50,
    left: '50%',
    transform: [{ translateX: -50 }],
    width: 100,
    height: 100,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    borderColor: '#fff',
    borderWidth: 4,
  },
  editIconAvatar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFA500',
    padding: 5,
    borderRadius: 15,
  },
  infoContainer: {
    padding: 20,
    marginTop: 60,
  },
  editIconInfo: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  organizationName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  organizationInfo: {
    fontSize: 16,
    marginBottom: 5,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  organizationDescription: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  socialLinksContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  socialIcon: {
    marginRight: 15,
  },
  eventsContainer: {
    padding: 20,
  },
  eventsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventCard: {
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 150,
  },
  eventContent: {
    padding: 10,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  eventDate: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  eventPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  noEventsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#777',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OrganizationScreen;
