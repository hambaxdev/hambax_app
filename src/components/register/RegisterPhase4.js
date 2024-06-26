import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useTranslation } from 'react-i18next';

const Phase4 = ({ organizationName, setOrganizationName, taxNumber, setTaxNumber, address, setAddress, phone, setPhone, website, setWebsite, errors, handleRegister }) => {
    const { t } = useTranslation();
    return (
        <>
            <Text style={styles.title}>{t('registration_phase_4')}</Text>
            <CustomInput
                placeholder={t('organization_name')}
                value={organizationName}
                onChangeText={setOrganizationName}
                error={errors.organizationName}
            />
            <CustomInput
                placeholder={t('tax_number')}
                value={taxNumber}
                onChangeText={setTaxNumber}
                error={errors.taxNumber}
            />
            <CustomInput
                placeholder={t('organization_address')}
                value={address}
                onChangeText={setAddress}
                error={errors.address}
            />
            <CustomInput
                placeholder={t('phone_number')}
                value={phone}
                onChangeText={setPhone}
                error={errors.phone}
            />
            <CustomInput
                placeholder={t('website')}
                value={website}
                onChangeText={setWebsite}
                error={errors.website}
            />
            <CustomButton title={t('register_btn')} onPress={handleRegister} />
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

export default Phase4;

