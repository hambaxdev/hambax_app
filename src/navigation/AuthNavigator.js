import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterUserScreen from '../screens/auth/RegisterUserScreen';
import RegisterEventmakerScreen from '../screens/auth/RegisterEventmakerScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import ResetCodeScreen from '../screens/auth/ResetCodeScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
    console.log('authnav');
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RegisterUser" component={RegisterUserScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RegisterEventmaker" component={RegisterEventmakerScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ResetCode" component={ResetCodeScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default AuthNavigator;
