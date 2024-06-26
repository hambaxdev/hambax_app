import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';
import { SignUpImg } from '../../assets';
import CustomInput from '../../components/CustomInput';
import { useTranslation } from 'react-i18next';

const RegisterUserScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});

    const handleRegister = async () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = t('email_required');
        }
        if (!password) {
            newErrors.password = t('password_required');
        }
        if (password !== confirmPassword) {
            newErrors.confirmPassword = t('password_mismatch');
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await axios.post(`${API_URL}/api/auth/register`, {
                email,
                password,
            });
            navigation.navigate('EmailVerification');
        } catch (error) {
            console.error('Registration error:', error);
            alert(t(error.response.data));
        }
    };

    return (
        <View style={styles.container}>
            <Image source={SignUpImg} style={styles.logo} />
            <Text style={styles.title}>{t('register')}</Text>
            <CustomInput
                placeholder={t('email')}
                value={email}
                onChangeText={setEmail}
                error={errors.email}
            />
            <CustomInput
                placeholder={t('password')}
                value={password}
                onChangeText={setPassword}
                error={errors.password}
                secureTextEntry
            />
            <CustomInput
                placeholder={t('password_confirmation')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={errors.confirmPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>{t('register_btn')}</Text>
            </TouchableOpacity>
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.footerText}>{t('already_registered')}</Text>
                </TouchableOpacity>
            </View>
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
    logo: {
        width: 300,
        height: 200,
        marginBottom: 20,
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
    footer: {
        marginTop: 20,
        alignItems: 'center',
    },
    footerText: {
        color: '#e28743',
        fontSize: 14,
        marginTop: 10,
    },
});

export default RegisterUserScreen;
