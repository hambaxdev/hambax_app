// src/navigation/AppNavigator.js

import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const Stack = createStackNavigator();

const AppNavigator = () => {
    const navigationRef = useRef();

    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                navigationRef.current?.navigate('Home');
            } else {
                navigationRef.current?.navigate('Intro');
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
                <Stack.Screen name="Scan" component={ScanScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Events" component={EventsScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Statistics" component={StatisticsScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Messages" component={MessagesScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Support" component={SupportScreen} options={{ headerShown: false }} />
                <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
