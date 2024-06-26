import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useTranslation } from 'react-i18next';

const Phase1 = ({ email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, errors, handleNextPhase }) => {
    const { t } = useTranslation();
    return (
        <>
            <Text style={styles.title}>{t('registration_phase_1')}</Text>
            <CustomInput
                placeholder={t('email')}
                value={email}
                onChangeText={setEmail}
                error={errors.email}
            />
            <CustomInput
                placeholder={t('password')}
                value={password}
                onChangeText={setPassword}
                error={errors.password}
                secureTextEntry
            />
            <CustomInput
                placeholder={t('password_confirmation')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={errors.confirmPassword}
                secureTextEntry
            />
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
});

export default Phase1;
