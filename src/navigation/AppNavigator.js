import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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
import BottomTabNavigator from './BottomTabNavigator';
import { API_URL } from '@env';

const Stack = createStackNavigator();

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
                            routes: [{ name: 'MainTabs' }],
                        });
                    }
                } catch (error) {
                    const newToken = await refreshAccessToken();
                    if (newToken) {
                        navigationRef.current?.reset({
                            index: 0,
                            routes: [{ name: 'MainTabs' }],
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
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator initialRouteName="Intro">
                <Stack.Screen name="Intro" component={IntroScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="RegisterUser" component={RegisterUserScreen} options={{ headerShown: false }} />
                <Stack.Screen name="RegisterEventmaker" component={RegisterEventmakerScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ResetCode" component={ResetCodeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Scan" component={ScanScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Events" component={EventsScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Statistics" component={StatisticsScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Messages" component={MessagesScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Support" component={SupportScreen} options={{ headerShown: false }} />
                <Stack.Screen name="PersonalData" component={PersonalDataScreen} options={{ headerShown: false }} />
                <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} options={{ headerShown: false }} />
                <Stack.Screen name="MainTabs" component={BottomTabNavigator} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
