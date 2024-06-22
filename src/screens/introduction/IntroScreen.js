import React from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import { GardenPartyImg, HeyImg, SignInImg } from '../../assets';
import { useTranslation } from 'react-i18next';

const IntroScreen = ({ navigation }) => {
    const { t } = useTranslation();
    return (
        <Swiper loop={false} showsPagination={true}>
            <View style={styles.slide}>
                <Image source={GardenPartyImg} style={styles.image} />
                <Text style={styles.text}>{t('introduction_welcome_text')}</Text>
                <Text style={styles.description}>{t('introduction_2')}</Text>
            </View>
            <View style={styles.slide}>
                <Image source={HeyImg} style={styles.image} />
                <Text style={styles.text}>{t('introduction_3')}</Text>
                <Text style={styles.description}>{t('introduction_4')}</Text>
            </View>
            <View style={styles.slide}>
                <Image source={SignInImg} style={styles.image} />
                <Text style={styles.text}>{t('introduction_5')}</Text>
                <Text style={styles.description_last}></Text>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.buttonText}>{t('login')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RegisterUser')}>
                        <Text style={styles.buttonText}>{t('sign_up')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('RegisterEventmaker')}>
                        <Text style={styles.eventmakerText}>{t('sign_up_eventmaker')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Swiper>
    );
};

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e28743',
        textAlign: 'center'
    },
    image: {
        width: 300,
        height: 200,
        marginBottom: 20,
    },
    text: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center'
    },
    description: {
        fontSize: 18,
        color: '#fff',
        marginVertical: 20,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    description_last: {
        fontSize: 18,
        color: '#fff',
        marginVertical: 20,
        textAlign: 'center',
        paddingHorizontal: 20,
        paddingBottom: 30
    },

    
    buttonsContainer: {
        position: 'absolute',
        bottom: 40,
        width: '100%',
        alignItems: 'center',
    },
    button: {
        width: '75%',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 25,
        marginVertical: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#e28743',
        fontSize: 16,
        fontWeight: 'bold',
    },
    eventmakerText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'center'
    },
});

export default IntroScreen;
