import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Switch, Image, Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import AgeRestrictionSelector from '../components/AgeRestrictionSelector';

const CreateEventScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [price, setPrice] = useState('');
    const [ticketCountLimited, setTicketCountLimited] = useState(false);
    const [ticketCount, setTicketCount] = useState('');
    const [date, setDate] = useState(new Date());
    const [image, setImage] = useState(null);
    const [selectedAgeRestriction, setSelectedAgeRestriction] = useState(null);
    const [isDateTimePickerVisible, setDateTimePickerVisibility] = useState(false);

    const showDateTimePicker = () => {
        setDateTimePickerVisibility(true);
    };

    const hideDateTimePicker = () => {
        setDateTimePickerVisibility(false);
    };

    const handleDateTimeConfirm = (selectedDate) => {
        setDate(selectedDate);
        hideDateTimePicker();
    }

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(t('permission_required'), t('permission_media_library'));
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setImage(uri);
        } else {
            Alert.alert(t('error'), t('failed_pick_image'));
        }
    };

    const handleCreateEvent = async () => {
        if (!name || !description || !address || !city || !country || !zipcode || !price) {
            Alert.alert(t('error'), t('fill_all_fields'));
            return;
        }

        try {
            const token = await AsyncStorage.getItem('accessToken');
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('location', location);
            formData.append('address', address);
            formData.append('city', city);
            formData.append('country', country);
            formData.append('zipcode', zipcode);
            formData.append('price', price);
            formData.append('ticketCountLimited', ticketCountLimited);
            formData.append('ticketCount', ticketCountLimited ? ticketCount : null);
            formData.append('date', date.toISOString());
            formData.append('ageRestrictionId', selectedAgeRestriction);

            if (image) {
                const localUri = image;
                const filename = localUri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image`;

                formData.append('image', { uri: localUri, name: filename, type });
            }

            const response = await axios.post(`${API_URL}/api/events/create`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                Alert.alert(t('success'), t('event_created_successfully'));
                navigation.goBack();
            } else {
                Alert.alert(t('error'), t('create_event_failed'));
            }
        } catch (error) {
            if (error.response) {
                Alert.alert(t('error'), `${t('create_event_failed')}: ${error.response.data}`);
            } else {
                Alert.alert(t('error'), t('create_event_retry'));
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{t('create_event')}</Text>

            <TextInput
                style={styles.input}
                placeholder={t('name')}
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder={t('description')}
                value={description}
                onChangeText={setDescription}
                multiline
            />
            <TextInput
                style={styles.input}
                placeholder={t('address')}
                value={address}
                onChangeText={setAddress}
            />
            <TextInput
                style={styles.input}
                placeholder={t('location')}
                value={location}
                onChangeText={setLocation}
            />
            <TextInput
                style={styles.input}
                placeholder={t('city')}
                value={city}
                onChangeText={setCity}
            />
            <TextInput
                style={styles.input}
                placeholder={t('country')}
                value={country}
                onChangeText={setCountry}
            />
            <TextInput
                style={styles.input}
                placeholder={t('zipcode')}
                value={zipcode}
                onChangeText={setZipcode}
            />
            <TextInput
                style={styles.input}
                placeholder={t('price')}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
            />

            {/* Компонент выбора возрастного ограничения */}
            <AgeRestrictionSelector
                selectedAgeRestriction={selectedAgeRestriction}
                onSelectAgeRestriction={(value) => setSelectedAgeRestriction(value)}
            />

            <View style={styles.switchContainer}>
                <Text>{t('limit_tickets')}</Text>
                <Switch
                    value={ticketCountLimited}
                    onValueChange={(value) => setTicketCountLimited(value)}
                />
            </View>

            {ticketCountLimited && (
                <TextInput
                    style={styles.input}
                    placeholder={t('ticket_count')}
                    value={ticketCount}
                    onChangeText={setTicketCount}
                    keyboardType="numeric"
                />
            )}

            <TouchableOpacity onPress={showDateTimePicker}>
                <TextInput
                    style={styles.input}
                    placeholder={t('event_date')}
                    value={date.toLocaleString()} // Формат с датой и временем
                    editable={false}
                />
            </TouchableOpacity>

            <DateTimePickerModal
                isVisible={isDateTimePickerVisible}
                mode="datetime" // Используем datetime
                onConfirm={handleDateTimeConfirm}
                onCancel={hideDateTimePicker}
            />

            <TouchableOpacity onPress={handlePickImage} style={styles.imagePicker}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.image} />
                ) : (
                    <Text>{t('select_image')}</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleCreateEvent}>
                <Text style={styles.buttonText}>{t('create_event')}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        paddingTop: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 15,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    imagePicker: {
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    button: {
        backgroundColor: '#e28743',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default CreateEventScreen;
