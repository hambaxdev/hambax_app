import React from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { PartyImage, PartyIcon, QrScanIcon, StatisticsIcon, SettingsIcon, MessagesIcon, SupportIcon } from '../assets';
import Card from '../components/Card';
import { useTranslation } from 'react-i18next';

const { height, width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const { t } = useTranslation();
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Svg height="100%" width="100%" style={styles.svg}>
                    <Path
                        fill="#FFA500"
                        d={`M0,0 L0,${0.4 * height} C${width},${0.3 * height} ${width},${0.1 * height} ${width},${0.1 * height} L${width},0 Z`}
                    />
                </Svg>
                <Image source={PartyImage} style={styles.headerImage} />
            </View>
            <View style={styles.grid}>
                <View style={styles.row}>
                    <Card icon={PartyIcon} text={t('myEvents')} onPress={() => navigation.navigate('Events')} />
                    <Card icon={QrScanIcon} text={t('qrScan')} onPress={() => navigation.navigate('Scan')} />
                </View>
                <View style={styles.row}>
                    <Card icon={StatisticsIcon} text={t('statistics')} onPress={() => navigation.navigate('Statistics')} />
                    <Card icon={SettingsIcon} text={t('settings')} onPress={() => navigation.navigate('Settings')} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        height: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    svg: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    headerImage: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
        zIndex: 1,
    },
    grid: {
        flex: 1,
        padding: 20,
        marginTop: -height * 0.1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
});

export default HomeScreen;
