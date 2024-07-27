import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EditModal from '../components/EditModal';

const ContentMakerProfile = ({ route, navigation }) => {
    const { t } = useTranslation();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editField, setEditField] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const eventmakerId = route.params?.eventmakerId;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = await AsyncStorage.getItem('accessToken');
                const userId = await AsyncStorage.getItem('userId');

                const response = await axios.get(`${API_URL}/api/eventmaker/profile/check`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data) {
                    setProfile(response.data);
                } else {
                    setProfile({ userId });
                }

                setIsOwner(userId === eventmakerId);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                setProfile({ userId: await AsyncStorage.getItem('userId') });
                setLoading(false);
            }
        };

        fetchProfile();
    }, [eventmakerId]);

    const handleEdit = (field) => {
        setEditField(field);
        setModalVisible(true);
    };

    const handleSave = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            const response = await axios.put(`${API_URL}/api/eventmaker/profile/${profile.userId}`, profile, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProfile(response.data);
            setModalVisible(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#e28743" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: profile.backgroundImage ? `${API_URL}${profile.backgroundImage}` : 'default_image_url' }} style={styles.backgroundImage} />
            <View style={styles.avatarContainer}>
                <Image source={{ uri: profile.avatarImage ? `${API_URL}${profile.avatarImage}` : 'default_avatar_url' }} style={styles.avatarImage} />
            </View>
            {isOwner && (
                <TouchableOpacity onPress={() => setEditing(!editing)} style={styles.editButton}>
                    <Ionicons name="pencil" size={24} color="black" />
                </TouchableOpacity>
            )}
            <View style={styles.infoContainer}>
                <Text style={styles.organizationName}>{profile.organizationName || t('organization_name')}</Text>
                <Text style={styles.description}>{profile.description || t('description')}</Text>
                <View style={styles.socialLinks}>
                    {profile.socialLinks?.facebook && <Ionicons name="logo-facebook" size={24} color="blue" />}
                    {profile.socialLinks?.twitter && <Ionicons name="logo-twitter" size={24} color="skyblue" />}
                    {profile.socialLinks?.instagram && <Ionicons name="logo-instagram" size={24} color="purple" />}
                    {profile.socialLinks?.linkedin && <Ionicons name="logo-linkedin" size={24} color="blue" />}
                </View>
            </View>
            <View style={styles.eventsContainer}>
                <Text style={styles.sectionTitle}>{t('upcoming_events')}</Text>
                <FlatList
                    data={profile.upcomingEvents || []}
                    renderItem={({ item }) => (
                        <EventCard
                            event={item}
                            onPress={() => navigation.navigate('EventDetail', { eventId: item._id })}
                        />
                    )}
                    keyExtractor={(item) => item._id}
                />
            </View>
            <View style={styles.commentsContainer}>
                <Text style={styles.sectionTitle}>{t('comments')}</Text>
                <FlatList
                    data={profile.comments || []}
                    renderItem={({ item }) => (
                        <View style={styles.comment}>
                            <Text style={styles.commentText}>{item.comment}</Text>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
            <EditModal
                visible={modalVisible}
                fields={[editField]}
                data={profile}
                onClose={() => setModalVisible(false)}
                onSave={handleSave}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        width: '100%',
        height: '20%',
    },
    avatarContainer: {
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: [{ translateX: -50 }],
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#fff',
    },
    editButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
        backgroundColor: '#fff',
        borderRadius: 50,
    },
    infoContainer: {
        padding: 20,
        alignItems: 'center',
    },
    organizationName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
    },
    socialLinks: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    eventsContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    commentsContainer: {
        padding: 20,
    },
    comment: {
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        marginBottom: 10,
    },
    commentText: {
        fontSize: 14,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ContentMakerProfile;
