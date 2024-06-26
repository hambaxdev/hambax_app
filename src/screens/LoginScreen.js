import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import { SignUpImg } from '../assets';
import { useTranslation } from 'react-i18next';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
    }, []);

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            await AsyncStorage.setItem('token', response.data.token);
            navigation.replace('Home');
        } catch (error) {
            if (error.response) {
                console.error('Login error response data:', error.response.data);
                console.error('Login error response status:', error.response.status);
                console.error('Login error response headers:', error.response.headers);
            } else if (error.request) {
                console.error('Login error request:', error.request);
            } else {
                console.error('Login error message:', error.message);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Image source={SignUpImg} style={styles.logo} />
            <Text style={styles.title}>Добро пожаловать</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Пароль"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Войти</Text>
            </TouchableOpacity>
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.navigate('RegisterUser')}>
                    <Text style={styles.footerText}>Создать новый аккаунт</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('RegisterEventmaker')}>
                    <Text style={styles.footerText}>Зарегистрироваться как организатор</Text>
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

export default LoginScreen;
