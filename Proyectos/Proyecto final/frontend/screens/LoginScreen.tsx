import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { loginUser } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    setErrorMsg('');

    const emailTrimmed = email.trim().toLowerCase();

    if (!emailTrimmed || !password) {
      setErrorMsg('Completa todos los campos.');
      return;
    }

    // Validación de formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      setErrorMsg('Correo electrónico inválido.');
      return;
    }

    setLoading(true);
    try {
      const { ok, data } = await loginUser(emailTrimmed, password);

      if (ok && data.user && data.token) {
        const userWithToken = { ...data.user, token: data.token };

        // Guardar sesión local
        await AsyncStorage.setItem('user', JSON.stringify(userWithToken));
        await login(userWithToken);

        // Redirigir a las pestañas del usuario
        navigation.reset({
          index: 0,
          routes: [{ name: 'UserTabs', params: { user: data.user } }],
        });
      } else {
        setErrorMsg(data.error || 'Correo o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Error de login:', error);
      setErrorMsg('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Ingresar</Text>
        )}
      </TouchableOpacity>

      {errorMsg !== '' && <Text style={styles.errorText}>{errorMsg}</Text>}

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#121212' },
  title: { fontSize: 28, color: 'white', textAlign: 'center', marginBottom: 30 },
  input: {
    backgroundColor: '#1E1E1E',
    color: 'white',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
  button: { backgroundColor: '#00b894', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' },
  registerText: { color: '#ccc', marginTop: 15, textAlign: 'center' },
  errorText: { color: '#ff7675', textAlign: 'center', marginTop: 10 },
});