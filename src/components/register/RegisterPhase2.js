import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useTranslation } from 'react-i18next';

const Phase2 = ({ firstName, setFirstName, lastName, setLastName, citizenship, setCitizenship, errors, handleNextPhase }) => {
    const { t } = useTranslation();
    return (
        <>
            <Text style={styles.title}>{t('registration_phase_2')}</Text>
            <CustomInput
                placeholder={t('first_name')}
                value={firstName}
                onChangeText={setFirstName}
                error={errors.firstName}
            />
            <CustomInput
                placeholder={t('last_name')}
                value={lastName}
                onChangeText={setLastName}
                error={errors.lastName}
            />
            <CustomInput
                placeholder={t('citizenship')}
                value={citizenship}
                onChangeText={setCitizenship}
                error={errors.citizenship}
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

export default Phase2;
