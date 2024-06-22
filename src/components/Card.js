// src/components/Card.js

import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';

const Card = ({ icon, text, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Image source={icon} style={styles.cardIcon} />
            <Text style={styles.cardText}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '45%',
        height: 150,
        backgroundColor: '#f2f2f2',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        marginHorizontal: 5,
        zIndex: 2,
    },
    cardIcon: {
        width: 50,
        height: 50,
        marginBottom: 10,
    },
    cardText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },
});

export default Card;
