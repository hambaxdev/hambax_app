import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { API_URL } from '@env';
import { DefaultAvatar } from '../assets';
import { useTranslation } from 'react-i18next';
import LanguagePickerModal from '../components/LanguagePickerModal';

const SettingsScreen = () => {
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [languageModalVisible, setLanguageModalVisible] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await AsyncStorage.getItem('accessToken');
                const response = await fetch(`${API_URL}/api/user/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                const text = await response.text();
                console.log('Server response:', text);
    
                if (!response.ok) {
                    console.error('Server responded with:', text);
                    throw new Error('Failed to fetch user data');
                }
    
                const data = JSON.parse(text);
                setUserData(data);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };
    
        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleNavigation = (screen) => {
        navigation.navigate(screen);
    };

    const handleImagePick = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Permission to access the media library is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;

            try {
                const token = await AsyncStorage.getItem('accessToken');

                const uploadResult = await FileSystem.uploadAsync(`${API_URL}/api/user/upload-avatar`, uri, {
                    httpMethod: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                    fieldName: 'avatar',
                });

                if (uploadResult.status !== 200) {
                    console.error('Failed to upload avatar, server responded with:', uploadResult.body);
                    Alert.alert('Error', 'Failed to upload avatar. Please try again.');
                    return;
                }

                const response = JSON.parse(uploadResult.body);

                setUserData((prevData) => ({
                    ...prevData,
                    avatar: response.avatarUrl,
                }));
            } catch (error) {
                console.error('Failed to upload avatar:', error);
                Alert.alert('Error', 'Failed to upload avatar. Please try again.');
            }
        } else {
            console.error('Image URI is null or image picker was cancelled');
            Alert.alert('Error', 'Failed to pick image. Please try again.');
        }
    };

    const handleSelectLanguage = async (language) => {
        i18n.changeLanguage(language);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerContainer}>

                {/* Заголовок настроек */}
                <Text style={styles.header}>{t('settings')}</Text>
            </View>

            <View style={styles.profileContainer}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={userData?.avatar ? { uri: `${API_URL}/api/image?path=${encodeURIComponent(userData.avatar)}` } : DefaultAvatar}
                        style={styles.avatar}
                        cachePolicy="immutable"
                    />
                    <TouchableOpacity style={styles.editIcon} onPress={handleImagePick}>
                        <Ionicons name="pencil" size={20} color="white" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.name}>{userData?.firstName} {userData?.lastName}</Text>
                <Text style={styles.email}>{userData?.email}</Text>
            </View>

            <Text style={styles.sectionTitle}>{t('menu_header_account_settings')}</Text>
            <TouchableOpacity style={styles.item} onPress={() => handleNavigation('PersonalData')}>
                <Text style={styles.itemText}>{t('menu_personal_data')}</Text>
                <Ionicons name="chevron-forward" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={() => handleNavigation('NotificationSettings')}>
                <Text style={styles.itemText}>{t('menu_notification')}</Text>
                <Ionicons name="chevron-forward" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={() => setLanguageModalVisible(true)}>
                <Text style={styles.itemText}>{t('menu_language')}</Text>
                <Ionicons name="chevron-forward" size={20} color="black" />
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>{t('menu_header_help')}</Text>
            <TouchableOpacity style={styles.item} onPress={() => handleNavigation('PrivacyPolicy')}>
                <Text style={styles.itemText}>{t('menu_privacy')}</Text>
                <Ionicons name="chevron-forward" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={() => handleNavigation('TermsConditions')}>
                <Text style={styles.itemText}>{t('menu_terms')}</Text>
                <Ionicons name="chevron-forward" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={() => handleNavigation('FAQHelp')}>
                <Text style={styles.itemText}>{t('menu_faq')}</Text>
                <Ionicons name="chevron-forward" size={20} color="black" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={[styles.itemText, styles.logoutButtonText]}>Logout</Text>
            </TouchableOpacity>

            <LanguagePickerModal
                visible={languageModalVisible}
                onClose={() => setLanguageModalVisible(false)}
                onSelectLanguage={handleSelectLanguage}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingTop: 40,
        backgroundColor: '#f5f5f5',
    },

    headerContainer: {
        flexDirection: 'row', // Располагаем кнопку и заголовок в одну линию
        alignItems: 'center', // Центрируем элементы по вертикали
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1, // Заголовок занимает оставшееся пространство
        textAlign: 'center', // Центрируем заголовок в доступном пространстве
    },
   
    profileContainer: {
        alignItems: 'center',
        marginBottom: 30,
        position: 'relative',
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#e28743',
        borderRadius: 15,
        padding: 5,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 16,
        color: 'gray',
    },
    sectionTitle: {
        fontSize: 16,
        color: 'gray',
        marginVertical: 10,
        marginLeft: 20,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    itemText: {
        fontSize: 16,
        color: 'black',
    },
    logoutButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#ff4d4d',
    },
});

export default SettingsScreen;
