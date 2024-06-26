import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import CustomPickerInput from '../../components/CustomPickerInput';
import { useTranslation } from 'react-i18next';

const Phase3 = ({ country, setCountry, setCountryModalVisible, city, setCity, zipCode, setZipCode, streetName, setStreetName, errors, handleNextPhase }) => {
    const { t } = useTranslation();
    return (
        <>
            <Text style={styles.title}>{t('registration_phase_3')}</Text>
            <CustomPickerInput
                placeholder={t('select_country')}
                value={country}
                onPress={() => setCountryModalVisible(true)}
                error={errors.country}
            />
            {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
            <CustomInput
                placeholder={t('city')}
                value={city}
                onChangeText={setCity}
                error={errors.city}
            />
            <CustomInput
                placeholder={t('zip_code')}
                value={zipCode}
                onChangeText={setZipCode}
                error={errors.zipCode}
            />
            <CustomInput
                placeholder={t('street_house_number')}
                value={streetName}
                onChangeText={setStreetName}
                error={errors.streetName}
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
    errorText: {
        color: 'red',
        marginTop: 5,
        fontSize: 14,
    },
});

export default Phase3;
