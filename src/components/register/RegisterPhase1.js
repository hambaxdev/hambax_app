import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons'; // Предполагаем, что используется expo, для использования значков
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const Phase1 = ({ email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, errors, handleNextPhase }) => {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <>
            <Text style={styles.title}>{t('registration_phase_1')}</Text>
            <CustomInput
                placeholder={t('email')}
                value={email}
                onChangeText={setEmail}
                error={errors.email}
            />
            <View style={styles.inputContainer}>
                <CustomInput
                    placeholder={t('password')}
                    value={password}
                    onChangeText={setPassword}
                    error={errors.password}
                    secureTextEntry={!showPassword}
                    style={styles.passwordInput}
                />
                <TouchableOpacity onPress={toggleShowPassword} style={styles.icon}>
                    <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
                </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
                <CustomInput
                    placeholder={t('password_confirmation')}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    error={errors.confirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    style={styles.passwordInput}
                />
                <TouchableOpacity onPress={toggleShowConfirmPassword} style={styles.icon}>
                    <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
                </TouchableOpacity>
            </View>
            <CustomButton title={t('continue')} onPress={handleNextPhase} />
        </>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        marginBottom: 30,
        fontWeight: 'bold',
        color: '#333',
    },
    inputContainer: {
        position: 'relative',
        width: '100%',
        marginBottom: 10,
    },
    passwordInput: {
        paddingRight: 40, // Оставляем место для значка глаза
    },
    icon: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{ translateY: -18 }],
    },
});

export default Phase1;
