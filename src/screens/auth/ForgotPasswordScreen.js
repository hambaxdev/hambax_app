import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';
import ErrorModal from '../../components/ErrorModal'; // Импортируем модальный компонент для ошибок

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errorCode, setErrorCode] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);

    const handleForgotPassword = async () => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/reset-password-request`, { email });
            setMessage(response.data.message);
            navigation.navigate('ResetCode', { email });
        } catch (error) {
            console.error('Forgot Password error:', error);
            if (error.response) {
                setErrorCode(error.response.status);
                setMessage(error.response.data.message);
            } else {
                setErrorCode(500);
                setMessage('Failed to send reset code.');
            }
            setModalVisible(true);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forgot Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
            />
            <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
                <Text style={styles.buttonText}>Send Reset Code</Text>
            </TouchableOpacity>
            <ErrorModal isVisible={isModalVisible} onClose={() => setModalVisible(false)} errorCode={errorCode} />
            {message && <Text style={styles.message}>{message}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        marginBottom: 30,
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        height: 50,
        width: '100%',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 25,
        marginBottom: 20,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        fontSize: 16,
        color: '#333',
    },
    button: {
        width: '100%',
        backgroundColor: '#e28743',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    message: {
        marginTop: 20,
        color: 'red',
    },
});

export default ForgotPasswordScreen;
