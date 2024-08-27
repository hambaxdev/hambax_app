import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Dimensions, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { API_URL } from '@env';
import * as Linking from 'expo-linking';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const EventStats = ({ eventId }) => {
    const { t } = useTranslation();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const landingPageUrl = `${API_URL}/landing/${eventId}`;

    useEffect(() => {
        const fetchEventStats = async () => {
            try {
                const response = await fetch(`${API_URL}/api/events/${eventId}/statistics`);
                if (!response.ok) {
                    throw new Error('Failed to fetch event statistics');
                }
                const data = await response.json();
                setStats(data);
            } catch (error) {
                Alert.alert(t('error'), t('failed_to_fetch_statistics'));
            } finally {
                setLoading(false);
            }
        };

        fetchEventStats();
    }, [eventId]);

    const handlePress = () => {
        Linking.openURL(landingPageUrl);
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!stats) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{t('no_statistics_available')}</Text>
            </View>
        );
    }

    const chartData = [
        {
            name: t('scanned_tickets'),
            population: stats.scannedTickets,
            color: '#FF6384',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
        },
        {
            name: t('active_tickets'),
            population: stats.activeTickets,
            color: '#36A2EB',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
        },
    ];

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{t('event_statistics')}</Text>
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>{t('total_tickets')}</Text>
                    <Text style={styles.statValue}>{stats.totalTickets}</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>{t('scanned_tickets')}</Text>
                    <Text style={styles.statValue}>{stats.scannedTickets}</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>{t('active_tickets')}</Text>
                    <Text style={styles.statValue}>{stats.activeTickets}</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>{t('total_earnings')}</Text>
                    <Text style={styles.statValue}>{stats.totalEarnings} EUR</Text>
                </View>
            </View>
            <PieChart
                data={chartData}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        paddingTop: 0, // Убираем отступ сверху
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    landingPageLink: {
        color: 'blue',
        textDecorationLine: 'underline',
        marginBottom: 20,
    },
    statsContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 20, // Добавлено для более аккуратного размещения
    },
    statItem: {
        marginBottom: 20,
    },
    statLabel: {
        fontSize: 16,
        color: '#555',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 5,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
    },
});

export default EventStats;
