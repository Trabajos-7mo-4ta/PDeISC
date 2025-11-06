// screens/ProfileScreen.tsx
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const { logout } = useContext(AuthContext);
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = route.params as { user: any };

  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' as never }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      {/* Avatar circular con inicial */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user.nombre.charAt(0).toUpperCase()}</Text>
      </View>

      {/* Tarjeta de datos */}
      <View style={styles.card}>
        <Text style={styles.label}>Nombre</Text>
        <Text style={styles.value}>{user.nombre}</Text>
        <View style={styles.separator} />
        <Text style={styles.label}>Rol</Text>
        <Text style={styles.value}>{user.rol}</Text>
      </View>

      {/* Botón de logout */}
      <TouchableOpacity style={styles.button} onPress={handleLogout} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    color: '#1e90ff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: '#1e90ff',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  avatarText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  separator: {
    height: 1,
    width: '80%',
    backgroundColor: '#333',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#ff7f00',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});