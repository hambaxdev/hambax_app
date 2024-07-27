import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

const NotificationSettingsScreen = () => {
    const { t } = useTranslation();
    const [allNotifications, setAllNotifications] = useState(true);
    const [ticketPurchase, setTicketPurchase] = useState(true);
    const [statisticalNotifications, setStatisticalNotifications] = useState(true);

    useEffect(() => {
        if (allNotifications) {
            setTicketPurchase(true);
            setStatisticalNotifications(true);
        }
    }, [allNotifications]);

    const toggleAllNotifications = () => {
        const newValue = !allNotifications;
        setAllNotifications(newValue);
        if (!newValue) {
            setTicketPurchase(false);
            setStatisticalNotifications(false);
        }
    };

    const handleIndividualToggle = (setter) => {
        return (value) => {
            setter(value);
            if (!value) {
                setAllNotifications(false);
            }
        };
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{t('notification_settings')}</Text>

            <View style={styles.setting}>
                <Text style={styles.label}>{t('all_notifications')}</Text>
                <Switch
                    value={allNotifications}
                    onValueChange={toggleAllNotifications}
                    trackColor={{ false: '#767577', true: '#e28743' }}
                    thumbColor={allNotifications ? '#f5dd4b' : '#e28743'}
                />
            </View>

            <View style={styles.setting}>
                <Text style={styles.label}>{t('ticket_purchase_notifications')}</Text>
                <Switch
                    value={ticketPurchase}
                    onValueChange={handleIndividualToggle(setTicketPurchase)}
                    disabled={allNotifications}
                    trackColor={{ false: '#767577', true: '#e28743' }}
                    thumbColor={ticketPurchase ? '#f5dd4b' : '#e28743'}
                />
            </View>

            <View style={styles.setting}>
                <Text style={styles.label}>{t('statistical_notifications')}</Text>
                <Switch
                    value={statisticalNotifications}
                    onValueChange={handleIndividualToggle(setStatisticalNotifications)}
                    disabled={allNotifications}
                    trackColor={{ false: '#767577', true: '#e28743' }}
                    thumbColor={statisticalNotifications ? '#f5dd4b' : '#e28743'}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 40,
        marginTop: 20,
        // paddingHorizontal: 20
    },
    setting: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#333',
    },
});

export default NotificationSettingsScreen;
