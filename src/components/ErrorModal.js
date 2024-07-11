// components/ErrorModal.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

const ErrorModal = ({ isVisible, onClose, errorCode }) => {
    const getMessage = () => {
        switch (errorCode) {
            case 409:
                return "Такой пользователь уже существует";
            case 401:
                return "Неправильный логин или пароль";
            case 400:
                return "Пожалуйста, заполните все поля";
            case 500:
                return "Произошла ошибка на сервере. Пожалуйста, попробуйте позже";
            default:
                return "Произошла неизвестная ошибка";
        }
    };

    return (
        <Modal isVisible={isVisible} onBackdropPress={onClose}>
            <View style={styles.modalContent}>
                <Text style={styles.message}>{getMessage()}</Text>
                <TouchableOpacity onPress={onClose} style={styles.button}>
                    <Text style={styles.buttonText}>Закрыть</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#e28743',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default ErrorModal;
