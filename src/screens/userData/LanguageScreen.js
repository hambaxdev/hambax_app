// LanguageScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from '../utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
    // Добавьте больше языков, если необходимо
];

const LanguageScreen = () => {
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserLanguage = async () => {
            try {
                const token = await AsyncStorage.getItem('accessToken');
                const response = await axios.get(`${API_URL}/api/user/language`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSelectedLanguage(response.data.language);
            } catch (error) {
                console.error('Failed to fetch user language:', error);
            }
        };

        fetchUserLanguage();
    }, []);

    const handleLanguageChange = async (language) => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            await axios.put(`${API_URL}/api/user/language`, { language }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSelectedLanguage(language);
            // Сохраните выбранный язык в AsyncStorage для дальнейшего использования в приложении
            await AsyncStorage.setItem('selectedLanguage', language);
            // Покажите сообщение об успехе и вернитесь на предыдущий экран
            Alert.alert('Success', 'Language updated successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error('Failed to update language:', error);
            Alert.alert('Error', 'Failed to update language. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Language</Text>
            {languages.map((lang) => (
                <TouchableOpacity
                    key={lang.code}
                    style={[
                        styles.languageButton,
                        selectedLanguage === lang.code && styles.selectedLanguageButton
                    ]}
                    onPress={() => handleLanguageChange(lang.code)}
                >
                    <Text style={styles.languageText}>{lang.label}</Text>
                </TouchableOpacity>
            ))}
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
        fontWeight: 'bold',
        marginBottom: 30,
    },
    languageButton: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 25,
        marginBottom: 10,
        alignItems: 'center',
    },
    selectedLanguageButton: {
        backgroundColor: '#e28743',
    },
    languageText: {
        fontSize: 16,
    },
});

export default LanguageScreen;
