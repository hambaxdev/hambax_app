import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';
import CustomPasswordInput from '../../components/CustomPasswordInput';
import { validatePassword } from '../../utils/validation';

const ResetPasswordScreen = ({ route, navigation }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { email, code } = route.params;
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(true);
    const [showConfirmPassword, setShowConfirmPassword] = useState(true);

    const toggleShowPassword = () => setShowPassword(!showPassword);
    const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const handleResetPassword = async () => {
        const validationErrors = validatePassword(newPassword, confirmPassword);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/api/auth/reset-password`, { email, code, newPassword });
            setMessage(response.data);
            navigation.navigate('Login');
        } catch (error) {
            console.error('Reset Password error:', error);
            setMessage('Failed to reset password.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Введите новый пароль</Text>
            <CustomPasswordInput
                placeholder="Новый пароль"
                value={newPassword}
                onChangeText={setNewPassword}
                error={errors.password}
                secureTextEntry={showPassword}
                toggleShowPassword={toggleShowPassword}
            />
            <CustomPasswordInput
                placeholder="Подтвердите новый пароль"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={errors.confirmPassword}
                secureTextEntry={showConfirmPassword}
                toggleShowPassword={toggleShowConfirmPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                <Text style={styles.buttonText}>Сбросить пароль</Text>
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

export default ResetPasswordScreen;
