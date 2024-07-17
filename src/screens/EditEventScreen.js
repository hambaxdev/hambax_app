import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Switch, Image, ActivityIndicator } from 'react-native';
import axios from '../utils/axiosInstance';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

const EditEventScreen = ({ route, navigation }) => {
    const { eventId } = route.params;
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
        image: null
    });
    const [showDatePicker, setShowDatePicker] = useState(false);

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
                setError('Failed to fetch event');
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventId]);

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Permission to access the media library is required!');
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
            Alert.alert('Error', 'Failed to pick image. Please try again.');
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
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

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

            const response = await axios.put(`${API_URL}/api/events/update/${eventId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                Alert.alert('Success', 'Event updated successfully');
                navigation.goBack();
            } else {
                Alert.alert('Error', 'Failed to update event');
            }
        } catch (error) {
            if (error.response) {
                Alert.alert('Error', `Failed to update event: ${error.response.data}`);
            } else {
                Alert.alert('Error', 'Failed to update event. Please try again.');
            }
        }
    };

    if (loading) {
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
            <Text style={styles.title}>Edit Event</Text>

            <TextInput
                style={styles.input}
                placeholder="Name"
                value={form.name}
                onChangeText={(value) => handleChange('name', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={form.description}
                onChangeText={(value) => handleChange('description', value)}
                multiline
            />
            <TextInput
                style={styles.input}
                placeholder="Address"
                value={form.address}
                onChangeText={(value) => handleChange('address', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="City"
                value={form.city}
                onChangeText={(value) => handleChange('city', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Country"
                value={form.country}
                onChangeText={(value) => handleChange('country', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Zipcode"
                value={form.zipcode}
                onChangeText={(value) => handleChange('zipcode', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Price"
                value={form.price}
                onChangeText={(value) => handleChange('price', value)}
                keyboardType="numeric"
            />

            <View style={styles.switchContainer}>
                <Text>Limit Tickets</Text>
                <Switch
                    value={form.ticketCountLimited}
                    onValueChange={(value) => handleChange('ticketCountLimited', value)}
                />
            </View>

            {form.ticketCountLimited && (
                <TextInput
                    style={styles.input}
                    placeholder="Ticket Count"
                    value={form.ticketCount}
                    onChangeText={(value) => handleChange('ticketCount', value)}
                    keyboardType="numeric"
                />
            )}

            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <TextInput
                    style={styles.input}
                    placeholder="Event Date"
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
                    <Text>Select Image</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Update Event</Text>
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

export default EditEventScreen;
