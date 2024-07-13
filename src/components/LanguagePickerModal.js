import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, Alert } from 'react-native';
import axios from '../utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const LanguagePickerModal = ({ visible, onClose, onSelectLanguage }) => {
    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(null);

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const token = await AsyncStorage.getItem('accessToken');
                const response = await axios.get(`${API_URL}/api/user/languages`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setLanguages(response.data);
            } catch (error) {
                console.error('Failed to fetch languages:', error);
                Alert.alert('Error', 'Failed to fetch languages. Please try again.');
            }
        };

        fetchLanguages();
    }, []);

    const handleLanguageChange = async (language_code) => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            await axios.put(`${API_URL}/api/user/language`, { language_code }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSelectedLanguage(language_code);
            // Сохраните выбранный язык в AsyncStorage для дальнейшего использования в приложении
            await AsyncStorage.setItem('selectedLanguage', language_code);
            onSelectLanguage(language_code);
            onClose();
        } catch (error) {
            console.error('Failed to update language:', error);
            Alert.alert('Error', 'Failed to update language. Please try again.');
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Select Language</Text>
                    <FlatList
                        data={languages}
                        keyExtractor={(item) => item.code}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.languageButton,
                                    selectedLanguage === item.code
                                ]}
                                onPress={() => handleLanguageChange(item.code)}
                            >
                                <Text style={styles.languageText}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        height: '85%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    languageButton: {
        paddingVertical: 15,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    languageText: {
        fontSize: 16,
    },
    closeButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        color: '#e28743',
    },
});

export default LanguagePickerModal;
