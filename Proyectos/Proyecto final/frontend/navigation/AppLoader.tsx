import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './AppNavigator';

export default function AppLoader() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const stored = await AsyncStorage.getItem('user');

        if (stored) {
          const user = JSON.parse(stored);

          if (user?.rol) {
            // Rol válido → redirigir a las pestañas
            navigation.reset({
              index: 0,
              routes: [{ name: 'UserTabs', params: { user } }],
            });
          } else {
            console.warn('El usuario almacenado no tiene un rol válido.');
            await AsyncStorage.removeItem('user');
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          }
        } else {
          // No hay usuario → ir al login
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }
      } catch (err) {
        console.error('Error al cargar usuario:', err);
        setError('Ocurrió un error al verificar tu sesión.');
        await AsyncStorage.removeItem('user');
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      } finally {
        // Pequeño delay visual opcional
        setTimeout(() => setLoading(false), 300);
      }
    };

    checkLogin();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
        <ActivityIndicator size="large" color="#1e90ff" />
        <Text style={{ color: 'white', marginTop: 10 }}>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
        <Text style={{ color: 'red', textAlign: 'center', marginHorizontal: 20 }}>{error}</Text>
      </View>
    );
  }

  return null;
}
