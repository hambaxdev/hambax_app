// src/components/EditEventForm.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Switch, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';

const EditEventForm = ({ eventId, navigation }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        name: '',
        description: '',
        address: '',
        city: '',
        country: '',
        zipcode: '',
        price: '',
        ticketCountLimited: false,
        ticketCount: '',
        date: new Date(),
        image: null,
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [retry, setRetry] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const token = await AsyncStorage.getItem('accessToken');
                const response = await axios.get(`${API_URL}/api/events/${eventId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const event = response.data;
                setForm({
                    name: event.name,
                    description: event.description,
                    address: event.address,
                    city: event.city,
                    country: event.country,
                    zipcode: event.zipcode,
                    price: event.price.toString(),
                    ticketCountLimited: event.ticketCountLimited,
                    ticketCount: event.ticketCount ? event.ticketCount.toString() : '',
                    date: new Date(event.date),
                    image: event.imageUrl ? `${API_URL}${event.imageUrl}` : null,
                });
                setLoading(false);
            } catch (error) {
                setError(t('fetch_event_error'));
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventId]);

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
            setForm({ ...form, image: uri });
        } else {
            Alert.alert(t('error'), t('failed_pick_image'));
        }
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || form.date;
        setShowDatePicker(false);
        setForm({ ...form, date: currentDate });
    };

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async () => {
        if (!form.name || !form.description || !form.address || !form.city || !form.country || !form.zipcode || !form.price) {
            Alert.alert(t('error'), t('fill_all_fields'));
            return;
        }

        setUploading(true);
        console.log('submitted');

        let attempts = 0;
        const maxAttempts = 5;

        while (attempts < maxAttempts) {
            try {
                const token = await AsyncStorage.getItem('accessToken');
                const formData = new FormData();
                formData.append('name', form.name);
                formData.append('description', form.description);
                formData.append('address', form.address);
                formData.append('city', form.city);
                formData.append('country', form.country);
                formData.append('zipcode', form.zipcode);
                formData.append('price', form.price);
                formData.append('ticketCountLimited', form.ticketCountLimited);
                formData.append('ticketCount', form.ticketCountLimited ? form.ticketCount : null);
                formData.append('date', form.date.toISOString());

                if (form.image && !form.image.startsWith('http')) {
                    const localUri = form.image;
                    const filename = localUri.split('/').pop();
                    const match = /\.(\w+)$/.exec(filename);
                    const type = match ? `image/${match[1]}` : `image`;

                    formData.append('image', { uri: localUri, name: filename, type });
                }

                console.log('FormData being sent:', formData);

                const response = await axios.put(`${API_URL}/api/events/update/${eventId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.status === 200) {
                    Alert.alert(t('success'), t('event_updated_successfully'));
                    setUploading(false);
                    navigation.goBack();
                    return;
                } else {
                    attempts += 1;
                    console.log(`Attempt ${attempts} failed`);
                }
            } catch (error) {
                attempts += 1;
                console.log(`Attempt ${attempts} failed with error:`, error.message);
            }
        }

        setUploading(false);
        Alert.alert(t('error'), t('update_event_failed_attempts'));
    };

    useEffect(() => {
        if (retry) {
            handleSubmit();
        }
    }, [retry]);

    if (loading || uploading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#e28743" />
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
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{t('edit_event')}</Text>

            <TextInput
                style={styles.input}
                placeholder={t('name')}
                value={form.name}
                onChangeText={(value) => handleChange('name', value)}
            />
            <TextInput
                style={styles.input}
                placeholder={t('description')}
                value={form.description}
                onChangeText={(value) => handleChange('description', value)}
                multiline
            />
            <TextInput
                style={styles.input}
                placeholder={t('address')}
                value={form.address}
                onChangeText={(value) => handleChange('address', value)}
            />
            <TextInput
                style={styles.input}
                placeholder={t('city')}
                value={form.city}
                onChangeText={(value) => handleChange('city', value)}
            />
            <TextInput
                style={styles.input}
                placeholder={t('country')}
                value={form.country}
                onChangeText={(value) => handleChange('country', value)}
            />
            <TextInput
                style={styles.input}
                placeholder={t('zipcode')}
                value={form.zipcode}
                onChangeText={(value) => handleChange('zipcode', value)}
            />
            <TextInput
                style={styles.input}
                placeholder={t('price')}
                value={form.price}
                onChangeText={(value) => handleChange('price', value)}
                keyboardType="numeric"
            />

            <View style={styles.switchContainer}>
                <Text>{t('limit_tickets')}</Text>
                <Switch
                    value={form.ticketCountLimited}
                    onValueChange={(value) => handleChange('ticketCountLimited', value)}
                />
            </View>

            {form.ticketCountLimited && (
                <TextInput
                    style={styles.input}
                    placeholder={t('ticket_count')}
                    value={form.ticketCount}
                    onChangeText={(value) => handleChange('ticketCount', value)}
                    keyboardType="numeric"
                />
            )}

            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <TextInput
                    style={styles.input}
                    placeholder={t('event_date')}
                    value={form.date.toLocaleDateString()}
                    editable={false}
                />
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={form.date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            <TouchableOpacity onPress={handlePickImage} style={styles.imagePicker}>
                {form.image ? (
                    <Image source={{ uri: form.image }} style={styles.image} />
                ) : (
                    <Text>{t('select_image')}</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>{t('update_event')}</Text>
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
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
});

export default EditEventForm;
