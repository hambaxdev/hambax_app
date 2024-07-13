import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import HomeScreen from '../screens/HomeScreen';
import ScanScreen from '../screens/ScanScreen';
import EventsScreen from '../screens/EventsScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MessagesScreen from '../screens/MessagesScreen';
import SupportScreen from '../screens/SupportScreen';
import PersonalDataScreen from '../screens/userData/PersonalDataScreen';

const Stack = createStackNavigator();

const MainNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="MainTabs">
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Scan" component={ScanScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Events" component={EventsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Statistics" component={StatisticsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Messages" component={MessagesScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Support" component={SupportScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PersonalData" component={PersonalDataScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default MainNavigator;
