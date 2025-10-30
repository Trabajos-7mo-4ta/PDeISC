import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import UserTabs from './UserTabs';
import AppLoader from './AppLoader';

// 🔹 Tipado de las rutas
export type RootStackParamList = {
  AppLoader: undefined;
  Login: undefined;
  Register: undefined;
  UserTabs: { user: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="AppLoader" // 🔹 Empieza siempre por AppLoader
    >
      <Stack.Screen name="AppLoader" component={AppLoader} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="UserTabs" component={UserTabs} />
    </Stack.Navigator>
  );
}