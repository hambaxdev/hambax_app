// src/screens/FeedScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FeedScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Лента</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default FeedScreen;
