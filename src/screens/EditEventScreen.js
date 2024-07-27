// src/screens/EditEventScreen.js
import React, { useState } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import EditEventForm from '../components/EditEventForm';
import EventStats from '../components/EventStats';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const EditEventScreen = ({ route, navigation }) => {
    const { eventId } = route.params;
    const { t } = useTranslation();
    const insets = useSafeAreaInsets(); // Получение отступов безопасной области
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'stats', title: t('statistics') },
        { key: 'edit', title: t('edit') },
    ]);

    const renderScene = SceneMap({
        edit: () => <EditEventForm eventId={eventId} navigation={navigation} />,
        stats: EventStats,
    });

    return (
        <View style={{ flex: 1, paddingTop: insets.top }}>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: Dimensions.get('window').width }}
                renderTabBar={props => (
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: '#e28743' }}
                        style={{ backgroundColor: '#fff' }}
                        labelStyle={{ color: '#000' }}
                    />
                )}
            />
        </View>
    );
};

export default EditEventScreen;
