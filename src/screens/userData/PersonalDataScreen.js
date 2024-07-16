import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EditModal from '../../components/EditModal'; // Импортируем новый компонент модального окна

const PersonalDataScreen = () => {
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
            setError('Failed to fetch data');
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
            <Text style={styles.header}>Личная информация</Text>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.sectionTitle}>Личная информация</Text>
                    <TouchableOpacity onPress={() => handleEdit(['firstName', 'lastName', 'citizenship'])}>
                        <Ionicons name="pencil" size={20} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.label}>Имя:</Text>
                    <Text style={styles.value}>{data.firstName}</Text>
                    <Text style={styles.label}>Фамилия:</Text>
                    <Text style={styles.value}>{data.lastName}</Text>
                    <Text style={styles.label}>Гражданство:</Text>
                    <Text style={styles.value}>{data.citizenship}</Text>
                </View>
            </View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.sectionTitle}>Адрес</Text>
                    <TouchableOpacity onPress={() => handleEdit(['country', 'city', 'zipCode', 'streetName'])}>
                        <Ionicons name="pencil" size={20} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.label}>Страна:</Text>
                    <Text style={styles.value}>{data.country}</Text>
                    <Text style={styles.label}>Город:</Text>
                    <Text style={styles.value}>{data.city}</Text>
                    <Text style={styles.label}>Почтовый индекс:</Text>
                    <Text style={styles.value}>{data.zipCode}</Text>
                    <Text style={styles.label}>Улица:</Text>
                    <Text style={styles.value}>{data.streetName}</Text>
                </View>
            </View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.sectionTitle}>Организация</Text>
                    <TouchableOpacity onPress={() => handleEdit(['organizationName', 'taxNumber', 'address', 'phone', 'website'])}>
                        <Ionicons name="pencil" size={20} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.label}>Название:</Text>
                    <Text style={styles.value}>{data.organizationName}</Text>
                    <Text style={styles.label}>Налоговый номер:</Text>
                    <Text style={styles.value}>{data.taxNumber}</Text>
                    <Text style={styles.label}>Адрес:</Text>
                    <Text style={styles.value}>{data.address}</Text>
                    <Text style={styles.label}>Телефон:</Text>
                    <Text style={styles.value}>{data.phone}</Text>
                    <Text style={styles.label}>Веб-сайт:</Text>
                    <Text style={styles.value}>{data.website}</Text>
                </View>
            </View>

            <EditModal
                visible={editModalVisible}
                fields={editFields}
                data={data}
                onClose={() => setEditModalVisible(false)}
                onSave={handleSave}
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
