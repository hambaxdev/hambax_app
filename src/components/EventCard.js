import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { API_URL } from '@env';
import { useTranslation } from 'react-i18next';

const EventCard = ({ event, onLongPress, onPress }) => {
    const { t } = useTranslation();
    console.log( `${API_URL}/api/images?path=${encodeURIComponent(event.imageUrl)}` );

    return (
        <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
            <View style={styles.card}>
            <Image source={{ uri: `${API_URL}/api/image?path=${encodeURIComponent(event.imageUrl)}` }} style={styles.image} />
                <View style={styles.info}>
                    <Text style={styles.name}>{event.name}</Text>
                    <Text style={styles.date}>{new Date(event.date).toLocaleDateString()}</Text>
                    <Text style={styles.description}>{event.description}</Text>
                    <Text style={styles.address}>{`${event.address}, ${event.city}, ${event.country}, ${event.zipcode}`}</Text>
                    <Text style={styles.price}>{`${event.price}€`}</Text>
                    {event.ticketCountLimited && <Text style={styles.ticketCount}>{`${t('tickets')}: ${event.ticketCount}`}</Text>}
                    <Text style={styles.landingPageLink}>
                        {`${API_URL}/landing/${event._id}`}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginVertical: 10,
        marginHorizontal: 20,
    },
    image: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    info: {
        padding: 15,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    date: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        marginBottom: 10,
    },
    address: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 10,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    ticketCount: {
        fontSize: 14,
        color: 'gray',
    },
    landingPageLink: {
        color: 'blue',
        marginTop: 10,
    },
});

export default EventCard;
