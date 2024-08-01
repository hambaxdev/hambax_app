import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';

const EmailVerificationScreen = ({ route, navigation }) => {
    const { t } = useTranslation();
    const { onboardingUrl } = route.params;

    const handleOnboarding = () => {
        if (onboardingUrl) {
            Linking.openURL(onboardingUrl);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('verification_email_sent')}</Text>
            <Text style={styles.message}>{t('please_check_email')}</Text>
            {onboardingUrl && (
                <TouchableOpacity style={styles.button} onPress={handleOnboarding}>
                    <Text style={styles.buttonText}>{t('complete_onboarding')}</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>{t('back_to_login')}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        width: '100%',
        backgroundColor: '#e28743',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default EmailVerificationScreen;
