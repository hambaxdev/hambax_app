import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import EditEventForm from '../components/EditEventForm';
import EventStats from '../components/EventStats';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableOpacity, Text, View } from 'react-native';

const Stack = createStackNavigator();

const HeaderTabs = ({ navigation, t }) => (
  <View style={{ flexDirection: 'row' }}>
    <TouchableOpacity
      style={{ marginHorizontal: 10 }}
      onPress={() => navigation.navigate('EventStats')}
    >
      <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>{t('statistics')}</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={{ marginHorizontal: 10 }}
      onPress={() => navigation.navigate('EditEventForm')}
    >
      <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>{t('edit')}</Text>
    </TouchableOpacity>
  </View>
);

const EditEventScreen = ({ route }) => {
  const { eventId } = route.params;
  const { t } = useTranslation();
  const insets = useSafeAreaInsets(); // Получение отступов безопасной области

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <NavigationContainer independent={true}>
        <Stack.Navigator
          screenOptions={({ navigation }) => ({
            headerTitle: () => <HeaderTabs navigation={navigation} t={t} />,
            headerStyle: { backgroundColor: '#fff' },
            headerTitleAlign: 'center',
          })}
        >
          <Stack.Screen name="EventStats" options={{ headerShown: true }}>
            {() => <EventStats eventId={eventId} />}
          </Stack.Screen>
          <Stack.Screen name="EditEventForm" options={{ headerShown: true }}>
            {() => <EditEventForm eventId={eventId} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default EditEventScreen;
