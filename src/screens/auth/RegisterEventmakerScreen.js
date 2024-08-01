import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import { SignUpImg } from '../../assets';
import { validatePhase1, validatePhase2, validatePhase3, validatePhase4 } from '../../utils/validation';
import BackButton from '../../components/BackButton';
import CountryPickerModal from '../../components/CountryPickerModal';

import Phase1 from '../../components/register/RegisterPhase1';
import Phase2 from '../../components/register/RegisterPhase2';
import Phase3 from '../../components/register/RegisterPhase3';
import Phase4 from '../../components/register/RegisterPhase4';

const RegisterEventmakerScreen = ({ navigation }) => {
    const [phase, setPhase] = useState(1);
    const [errors, setErrors] = useState({});
    const [countryModalVisible, setCountryModalVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [citizenship, setCitizenship] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [streetName, setStreetName] = useState('');
    const [organizationName, setOrganizationName] = useState('');
    const [taxNumber, setTaxNumber] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [website, setWebsite] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const handleNextPhase = () => {
        let validationErrors = {};
        if (phase === 1) {
            validationErrors = validatePhase1(email, password, confirmPassword);
        } else if (phase === 2) {
            validationErrors = validatePhase2(firstName, lastName, citizenship);
        } else if (phase === 3) {
            validationErrors = validatePhase3(country, city, zipCode, streetName);
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setPhase(phase + 1);
    };

    const handlePreviousPhase = () => {
        if (phase > 1) {
            setPhase(phase - 1);
        }
    };

    const handleRegister = async () => {
        const validationErrors = validatePhase4(organizationName, taxNumber, address, phone, website, agreedToTerms);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/api/auth/register/eventmaker`, {
                email,
                password,
                first_name: firstName,
                last_name: lastName,
                citizenship,
                country,
                city,
                zip_code: zipCode,
                street_name: streetName,
                organization_name: organizationName,
                tax_number: taxNumber,
                address,
                phone,
                website,
            });

            navigation.navigate('EmailVerification', { onboardingUrl: response.data.onboardingUrl });

            await AsyncStorage.setItem('token', response.data.token);
            navigation.navigate('EmailVerification', { onboardingUrl });
        } catch (error) {
            console.error('Registration error:', error);
            alert('Регистрация не удалась');
        }
    };

    return (
        <View style={styles.container}>
            {phase > 1 && <BackButton onPress={handlePreviousPhase} />}
            <Image source={SignUpImg} style={styles.logo} />
            <View style={styles.phaseContainer}>
                {phase === 1 && (
                    <Phase1
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        confirmPassword={confirmPassword}
                        setConfirmPassword={setConfirmPassword}
                        errors={errors}
                        handleNextPhase={handleNextPhase}
                    />
                )}
                {phase === 2 && (
                    <Phase2
                        firstName={firstName}
                        setFirstName={setFirstName}
                        lastName={lastName}
                        setLastName={setLastName}
                        citizenship={citizenship}
                        setCitizenship={setCitizenship}
                        errors={errors}
                        handleNextPhase={handleNextPhase}
                    />
                )}
                {phase === 3 && (
                    <Phase3
                        country={country}
                        setCountry={setCountry}
                        setCountryModalVisible={setCountryModalVisible}
                        city={city}
                        setCity={setCity}
                        zipCode={zipCode}
                        setZipCode={setZipCode}
                        streetName={streetName}
                        setStreetName={setStreetName}
                        errors={errors}
                        handleNextPhase={handleNextPhase}
                    />
                )}
                {phase === 4 && (
                    <Phase4
                        organizationName={organizationName}
                        setOrganizationName={setOrganizationName}
                        taxNumber={taxNumber}
                        setTaxNumber={setTaxNumber}
                        address={address}
                        setAddress={setAddress}
                        phone={phone}
                        setPhone={setPhone}
                        website={website}
                        setWebsite={setWebsite}
                        errors={errors}
                        handleRegister={handleRegister}
                        agreedToTerms={agreedToTerms}
                        setAgreedToTerms={setAgreedToTerms}
                    />
                )}
            </View>
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.footerText}>Уже есть аккаунт? Войти</Text>
                </TouchableOpacity>
            </View>
            <CountryPickerModal
                visible={countryModalVisible}
                onClose={() => setCountryModalVisible(false)}
                onSelectCountry={(selectedCountry) => setCountry(selectedCountry)}
            />
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
    logo: {
        width: 300,
        height: 200,
        marginBottom: 20,
    },
    phaseContainer: {
        width: '100%',
        maxWidth: 400,
    },
    footer: {
        alignItems: 'center',
        marginTop: 20,
    },
    footerText: {
        color: '#e28743',
        fontSize: 14,
    },
});

export default RegisterEventmakerScreen;
