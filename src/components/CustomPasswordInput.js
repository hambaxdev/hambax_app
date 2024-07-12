// components/CustomPasswordInput.js

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomPasswordInput = ({ placeholder, value, onChangeText, error, secureTextEntry, toggleShowPassword }) => {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#aaa"
                secureTextEntry={secureTextEntry}
                value={value}
                onChangeText={onChangeText}
            />
            <TouchableOpacity onPress={toggleShowPassword} style={styles.icon}>
                <Ionicons name={secureTextEntry ? 'eye-off' : 'eye'} size={24} color="gray" />
            </TouchableOpacity>
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        height: 50,
        width: '100%',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        fontSize: 16,
        color: '#333',
    },
    icon: {
        position: 'absolute',
        right: 20,
        top: 15,
    },
    error: {
        color: 'red',
        marginTop: 5,
    },
});

export default CustomPasswordInput;
