import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import axios from '../utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import CountryPickerModal from './CountryPickerModal';
import { useTranslation } from 'react-i18next';

const EditModal = ({ visible, fields, data, onClose, onSave, apiEndpoint, requestMethod = 'PUT' }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({});
    const [initialData, setInitialData] = useState({});
    const [isCountryPickerVisible, setIsCountryPickerVisible] = useState(false);

    useEffect(() => {
        if (fields.length > 0 && data) {
            const initialFormData = {};
            fields.forEach(field => {
                const keys = field.split('.');
                let value = data;
                keys.forEach(key => {
                    value = value ? value[key] : '';
                });
                initialFormData[field] = value;
            });
            setFormData(initialFormData);
            setInitialData(initialFormData);
        }
    }, [fields, data]);

    const handleChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const handleCountrySelect = (countryName) => {
        handleChange('address.country', countryName); 
        setIsCountryPickerVisible(false); 
    };

    const handleSave = async () => {
        const changedFields = {};
        for (const field in formData) {
            if (formData[field] !== initialData[field]) {
                const keys = field.split('.');
                let obj = changedFields;
                keys.forEach((key, index) => {
                    if (index === keys.length - 1) {
                        obj[key] = formData[field];
                    } else {
                        obj = obj[key] = obj[key] || {};
                    }
                });
            }
        }

        if (Object.keys(changedFields).length === 0) {
            Alert.alert(t('no_changes'), t('no_fields_changed'));
            onClose();
            return;
        }

        try {
            const token = await AsyncStorage.getItem('accessToken');
            const response = await axios({
                method: requestMethod,
                url: `${API_URL}${apiEndpoint}`,
                data: changedFields,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                onSave(changedFields);
                onClose();
            } else {
                console.error('Unexpected server response:', response);
                Alert.alert(t('error'), t('update_profile_failed'));
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
            if (error.response) {
                console.error('Server response:', error.response.data);
                Alert.alert(t('error'), `${t('update_profile_failed')}: ${error.response.data}`);
            } else {
                Alert.alert(t('error'), t('update_profile_failed_try_again'));
            }
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
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        <Text style={styles.title}>{t('edit_information')}</Text>
                        {fields.map((field) => (
                            <View key={field} style={styles.inputContainer}>
                                <Text style={styles.label}>{t(field.split('.').join('_'))}:</Text>
                                {field === 'address.country' ? (
                                    <TouchableOpacity onPress={() => setIsCountryPickerVisible(true)}>
                                        <TextInput
                                            style={styles.input}
                                            value={formData[field]}
                                            editable={false}
                                        />
                                    </TouchableOpacity>
                                ) : (
                                    <TextInput
                                        style={styles.input}
                                        value={formData[field]}
                                        onChangeText={(value) => handleChange(field, value)}
                                    />
                                )}
                            </View>
                        ))}
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>{t('save')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.closeButtonText}>{t('close')}</Text>
                        </TouchableOpacity>
                    </ScrollView>
                    <CountryPickerModal
                        visible={isCountryPickerVisible}
                        onClose={() => setIsCountryPickerVisible(false)}
                        onSelectCountry={handleCountrySelect}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        height: '85%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        width: '100%',
        padding: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
    },
    saveButton: {
        backgroundColor: '#e28743',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    saveButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
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

export default EditModal;
