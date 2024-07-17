import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from '../utils/axiosInstance';
import { API_URL } from '@env';
import EventCard from '../components/EventCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const EventsScreen = ({ navigation }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEvents = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            const response = await axios.get(`${API_URL}/api/events/user-events`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEvents(response.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch events');
            setLoading(false);
        }
    };

    const deleteEvent = async (eventId) => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            await axios.delete(`${API_URL}/api/events/${eventId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEvents(events.filter(event => event._id !== eventId));
        } catch (error) {
            Alert.alert('Error', 'Failed to delete event');
        }
    };

    const handleLongPress = (eventId) => {
        Alert.alert(
            'Delete Event',
            'Are you sure you want to delete this event?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteEvent(eventId) }
            ],
            { cancelable: true }
        );
    };

    useFocusEffect(
        useCallback(() => {
            fetchEvents();
        }, [])
    );

    const renderItem = ({ item }) => (
        <EventCard 
            event={item} 
            onLongPress={() => handleLongPress(item._id)} 
            onPress={() => navigation.navigate('EditEvent', { eventId: item._id })}
        />
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#e28743" />
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <FlatList
                    contentContainerStyle={styles.listContainer}
                    data={events}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                />
            )}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('CreateEvent')}
            >
                <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
    listContainer: {
        paddingTop: 20, // Добавлен отступ сверху для списка
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#e28743',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
});

export default EventsScreen;
