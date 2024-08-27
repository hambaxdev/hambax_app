import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import IntroScreen from '../screens/introduction/IntroScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterUserScreen from '../screens/auth/RegisterUserScreen';
import RegisterEventmakerScreen from '../screens/auth/RegisterEventmakerScreen';
import HomeScreen from '../screens/HomeScreen';
import ScanScreen from '../screens/ScanScreen';
import EventsScreen from '../screens/EventsScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MessagesScreen from '../screens/MessagesScreen';
import SupportScreen from '../screens/SupportScreen';
import EmailVerificationScreen from '../screens/auth/EmailVerificationScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import ResetCodeScreen from '../screens/auth/ResetCodeScreen';
import PersonalDataScreen from '../screens/userData/PersonalDataScreen';
import { API_URL } from '@env';
import CreateEventScreen from '../screens/CreateEventScreen';
import EditEventScreen from '../screens/EditEventScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';
import OrganizationScreen from '../screens/OrganizationScreen';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import BackButton from '../components/BackButton'; // Импортируем BackButton

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const linking = {
    prefixes: ['hambax://', 'https://*.hambax.com'],
    config: {
        screens: {
            Home: 'home',
            Onboarding: {
                screens: {
                    Reauth: 'onboarding/reauth',
                    Complete: 'onboarding/complete'
                }
            },
        },
    },
};

// Нижнее меню
const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Organization') {
                        iconName = focused ? 'business' : 'business-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#2f95dc',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Organization" component={OrganizationScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    const navigationRef = useRef();

    const refreshAccessToken = async () => {
        try {
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            if (refreshToken) {
                const response = await axios.post(`${API_URL}/api/auth/refresh-token`, { token: refreshToken });
                const { accessToken, refreshToken: newRefreshToken } = response.data;
                await AsyncStorage.setItem('accessToken', accessToken);
                await AsyncStorage.setItem('refreshToken', newRefreshToken);
                return accessToken;
            }
            return null;
        } catch (error) {
            console.error('Failed to refresh access token:', error);
            return null;
        }
    };

    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('accessToken');
            if (token) {
                try {
                    const response = await axios.get(`${API_URL}/api/user/profile`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.status === 200) {
                        navigationRef.current?.reset({
                            index: 0,
                            routes: [{ name: 'Home' }],
                        });
                    }
                } catch (error) {
                    const newToken = await refreshAccessToken();
                    if (newToken) {
                        navigationRef.current?.reset({
                            index: 0,
                            routes: [{ name: 'Home' }],
                        });
                    } else {
                        navigationRef.current?.reset({
                            index: 0,
                            routes: [{ name: 'Intro' }],
                        });
                    }
                }
            } else {
                navigationRef.current?.reset({
                    index: 0,
                    routes: [{ name: 'Intro' }],
                });
            }
        };
        checkToken();
    }, []);

    return (
        <NavigationContainer ref={navigationRef} linking={linking}>
            <Stack.Navigator
                initialRouteName="Intro"
                screenOptions={({ navigation, route }) => ({
                    headerLeft: () =>
                        route.name !== 'Home' && route.name !== 'Organization' ? (
                            <BackButton onPress={() => navigation.goBack()} />
                        ) : null,
                    headerStyle: { backgroundColor: '#e28743' }, // Добавляем цвет фона для заголовка
                    headerTintColor: '#fff', // Цвет текста в заголовке
                })}
            >
                <Stack.Screen name="Intro" component={IntroScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="RegisterUser" component={RegisterUserScreen} options={{ headerShown: false }} />
                <Stack.Screen name="RegisterEventmaker" component={RegisterEventmakerScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ResetCode" component={ResetCodeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Home" component={BottomTabNavigator} options={{ headerShown: false }} />
                <Stack.Screen name="Scan" component={ScanScreen} />
                <Stack.Screen name="Events" component={EventsScreen} />
                <Stack.Screen name="Statistics" component={StatisticsScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="PersonalData" component={PersonalDataScreen} />
                <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
                <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
                <Stack.Screen name="EditEvent" component={EditEventScreen} />
                <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
                <Stack.Screen name="OrganizationScreen" component={OrganizationScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
