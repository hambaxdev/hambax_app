import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { API_URL } from '@env';

const ScanScreen = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);

        console.log(data);
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/api/ticket/validate-ticket`,
                { qrHash: data },
                { headers: { 'x-access-token': token } }
            );

            response.data.message
            setMessage(t(response.data.message));

            if (response.data.status === 'fail' || response.data.active === 0) {
                setShowError(true);
            } else {
                setShowSuccess(true);
            }
        } catch (error) {
            console.error('Error scanning QR code:', error);
            setShowError(true);
        }
    };

    const handleNextScan = () => {
        setShowError(false);
        setShowSuccess(false);
        setScanned(false);
        setMessage('');
    };

    if (hasPermission === null) {
        return <Text>{t('cam_permission_request')}</Text>;
    }
    if (hasPermission === false) {
        return <Text>{t('no_access_to_camera')}</Text>;
    }

    return (
        <View style={styles.container}>
            {showError ? (
                <View style={[styles.overlay, styles.errorContainer]}>
                    <Text style={styles.errorText}>{t('error')}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <TouchableOpacity style={styles.button} onPress={handleNextScan}>
                        <Text style={styles.buttonText}>{t('scan_next')}</Text>
                    </TouchableOpacity>
                </View>
            ) : showSuccess ? (
                <View style={[styles.overlay, styles.successContainer]}>
                    <Text style={styles.successText}>{t('sucecss')}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <TouchableOpacity style={styles.button} onPress={handleNextScan}>
                        <Text style={styles.buttonText}>{t('scan_next')}</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={StyleSheet.absoluteFillObject}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        backgroundColor: 'red',
    },
    errorText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    successContainer: {
        backgroundColor: 'green',
    },
    successText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    message: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        color: 'white',
    },
    instruction: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ScanScreen;
