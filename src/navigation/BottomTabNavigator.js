// src/navigation/BottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import EventsScreen from '../screens/EventsScreen';
import FeedScreen from '../screens/FeedScreen';
import ContentMakerProfileScreen from '../screens/ContentMakerProfileScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Feed') {
                        iconName = focused ? 'list' : 'list-outline';
                    } else if (route.name === 'EventmakerHome') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Home') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    // Можно вернуть любой компонент здесь!
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#e28743',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Feed" component={FeedScreen} options={{ title: 'Лента', headerShown: false  }} />
            <Tab.Screen name="EventmakerHome" component={ContentMakerProfileScreen} options={{ title: 'Ивентмейкер', headerShown: false  }} />
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Домашняя', headerShown: false  }} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
