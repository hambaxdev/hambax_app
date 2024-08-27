import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EditModal from '../../components/EditModal';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const PersonalDataScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editFields, setEditFields] = useState([]);
    const [editModalVisible, setEditModalVisible] = useState(false);

    const fetchData = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            const response = await axios.get(`${API_URL}/api/user/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setData(response.data);
            setLoading(false);
        } catch (error) {
            setError(t('fetch_error'));
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (fields) => {
        setEditFields(fields);
        setEditModalVisible(true);
    };

    const handleSave = async () => {
        fetchData(); // Обновляем данные после сохранения
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#e28743" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerContainer}>
                {/* Заголовок экрана */}
                <Text style={styles.header}>{t('personal_info')}</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.sectionTitle}>{t('personal_info')}</Text>
                    <TouchableOpacity onPress={() => handleEdit(['firstName', 'lastName', 'citizenship'])}>
                        <Ionicons name="pencil" size={20} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.label}>{t('name')}:</Text>
                    <Text style={styles.value}>{data.firstName}</Text>
                    <Text style={styles.label}>{t('last_name')}:</Text>
                    <Text style={styles.value}>{data.lastName}</Text>
                    <Text style={styles.label}>{t('citizenship')}:</Text>
                    <Text style={styles.value}>{data.citizenship}</Text>
                </View>
            </View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.sectionTitle}>{t('address')}</Text>
                    <TouchableOpacity onPress={() => handleEdit(['address.country', 'address.city', 'address.zipCode', 'address.streetName'])}>
                        <Ionicons name="pencil" size={20} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.label}>{t('country')}:</Text>
                    <Text style={styles.value}>{data.address?.country}</Text>
                    <Text style={styles.label}>{t('city')}:</Text>
                    <Text style={styles.value}>{data.address?.city}</Text>
                    <Text style={styles.label}>{t('zip_code')}:</Text>
                    <Text style={styles.value}>{data.address?.zipCode}</Text>
                    <Text style={styles.label}>{t('street')}:</Text>
                    <Text style={styles.value}>{data.address?.streetName}</Text>
                </View>
            </View>

            <EditModal
                visible={editModalVisible}
                fields={editFields}
                data={data}
                onClose={() => setEditModalVisible(false)}
                onSave={handleSave}
                apiEndpoint={`/api/user/update-profile`}
                requestMethod="PUT"
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingVertical: 50,
        paddingHorizontal: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 40,
        marginTop: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1, // Заголовок занимает оставшееся пространство
        textAlign: 'center', // Центрируем заголовок
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    cardContent: {
        paddingHorizontal: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        marginTop: 10,
    },
    value: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
});

export default PersonalDataScreen;
