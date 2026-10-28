import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/types/navigation';
import { AppProvider } from './src/context/AppContext';
import { colors } from './src/theme/colors';
import { FieldListScreen } from './src/screens/FieldListScreen';
import { FieldFormScreen } from './src/screens/FieldFormScreen';
import { FieldDetailScreen } from './src/screens/FieldDetailScreen';

// Khoi tao Native Stack Navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

// Component goc ung dung
function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar barStyle="dark-content" />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="FieldList"
            screenOptions={{
              headerStyle: {
                backgroundColor: colors.cardBackground,
              },
              headerTintColor: colors.primary,
              headerTitleStyle: {
                fontWeight: '700',
              },
              contentStyle: {
                backgroundColor: colors.background,
              },
            }}>
            <Stack.Screen
              name="FieldList"
              component={FieldListScreen}
              options={{ title: 'Quản Lý Sân Bóng' }}
            />
            <Stack.Screen
              name="FieldForm"
              component={FieldFormScreen}
              options={{ title: 'Thông Tin Sân' }}
            />
            <Stack.Screen
              name="FieldDetail"
              component={FieldDetailScreen}
              options={{ title: 'Chi Tiết Sân' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}

export default App;
