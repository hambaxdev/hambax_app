// src/components/BackButton.js

import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { BackArrowIcon } from '../assets'; // Предполагаем, что у вас есть иконка стрелки назад

const BackButton = ({ onPress, style, iconStyle }) => {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            <Image source={BackArrowIcon} style={[styles.icon, iconStyle]} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 40,
        height: 40,
        backgroundColor: '#e28743',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 20,
        height: 20,
        tintColor: '#fff',
    },
});

export default BackButton;
