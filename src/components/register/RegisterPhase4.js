import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckBox } from 'react-native-elements';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useTranslation } from 'react-i18next';
import TermsModal from '../../components/TermsModal';

const Phase4 = ({
    organizationName,
    setOrganizationName,
    taxNumber,
    setTaxNumber,
    address,
    setAddress,
    phone,
    setPhone,
    website,
    setWebsite,
    errors,
    handleRegister,
    agreedToTerms,
    setAgreedToTerms
}) => {
    const { t } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);

    const handleLinkPress = () => {
        setModalVisible(true);
    };

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
            <View style={styles.termsContainer}>
                <CheckBox
                    checked={agreedToTerms}
                    onPress={() => setAgreedToTerms(!agreedToTerms)}
                    containerStyle={styles.checkboxContainer}
                />
                <TouchableOpacity onPress={handleLinkPress}>
                    <Text style={styles.checkboxText}>
                        {t('i_agree_to_the_terms').split(' ').map((word, index) => (
                            word === 'the' ? (
                                <Text key={index}>
                                    <Text>{' '}</Text>
                                    <Text onPress={handleLinkPress} style={styles.termsLink}>
                                        {word + ' user agreement'}
                                    </Text>
                                    <Text>{' '}</Text>
                                </Text>
                            ) : (
                                <Text key={index}>{word + ' '}</Text>
                            )
                        ))}
                    </Text>
                </TouchableOpacity>
            </View>
            {errors.agreedToTerms && <Text style={styles.errorText}>{errors.agreedToTerms}</Text>}
            <CustomButton title={t('register_btn')} onPress={handleRegister} />
            <TermsModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
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
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    checkboxContainer: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 0,
        margin: 0,
    },
    checkboxText: {
        fontSize: 14,
        color: '#333',
        marginRight: 10,
    },
    termsLink: {
        color: '#007BFF',
        textDecorationLine: 'underline',
        marginRight: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 5,
    },
});

export default Phase4;
