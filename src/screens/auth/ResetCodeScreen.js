import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';

const ResetCodeScreen = ({ route, navigation }) => {
    const { email } = route.params;
    const [code, setCode] = useState(['', '', '', '']);
    const [message, setMessage] = useState('');
    const inputs = useRef([]);

    const handleVerifyCode = async () => {
        const fullCode = code.join('');
        try {
            const response = await axios.post(`${API_URL}/api/auth/verify-reset-code`, { email, code: fullCode });
            setMessage(response.data);
            navigation.navigate('ResetPassword', { email, code: fullCode });
        } catch (error) {
            console.error('Verify Reset Code error:', error);
            setMessage('Invalid or expired reset code.');
        }
    };

    const handleChangeText = (text, index) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);
        if (text && index < inputs.current.length - 1) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter Reset Code</Text>
            <View style={styles.codeContainer}>
                {code.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={ref => inputs.current[index] = ref}
                        style={styles.input}
                        value={digit}
                        onChangeText={text => handleChangeText(text, index)}
                        onKeyPress={e => handleKeyPress(e, index)}
                        keyboardType="numeric"
                        maxLength={1}
                    />
                ))}
            </View>
            <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
                <Text style={styles.buttonText}>Verify Code</Text>
            </TouchableOpacity>
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
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        width: '80%',
    },
    input: {
        height: 50,
        width: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        textAlign: 'center',
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

export default ResetCodeScreen;
