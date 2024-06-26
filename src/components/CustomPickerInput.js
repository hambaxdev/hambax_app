import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomPickerInput = ({ placeholder, value, onPress, error }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.input, error && styles.inputError]}
                onPress={onPress}
            >
                <Text style={[styles.pickerText, !value && styles.placeholderText]}>
                    {value || placeholder}
                </Text>
            </TouchableOpacity>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 10,
    },
    input: {
        height: 50,
        width: '100%',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    pickerText: {
        fontSize: 16,
        color: '#333',
    },
    placeholderText: {
        color: '#aaa',
    },
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        marginTop: 5,
        fontSize: 14,
    },
});

export default CustomPickerInput;
