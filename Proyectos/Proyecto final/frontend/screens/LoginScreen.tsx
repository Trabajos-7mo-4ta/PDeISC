import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { loginUser, loginWithGoogle } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { ResponseType } from 'expo-auth-session';
import { GOOGLE_CLIENT_ID } from '../config';

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

  WebBrowser.maybeCompleteAuthSession();

  const [request, response, promptAsync] = Google.useAuthRequest({
    responseType: ResponseType.Token,
    clientId: GOOGLE_CLIENT_ID,
    scopes: ['profile', 'email'],
  });

  const handleLogin = async () => {
    setErrorMsg('');
    const emailTrimmed = email.trim().toLowerCase();

    if (!emailTrimmed || !password) {
      setErrorMsg('Completa todos los campos.');
      return;
    }

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
        await AsyncStorage.setItem('user', JSON.stringify(userWithToken));
        await login(userWithToken);
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

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setLoading(true);

    try {
      const result = await promptAsync();

      if (result.type === 'success' && result.authentication?.accessToken) {
        const googleToken = result.authentication.accessToken;

        const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: { Authorization: `Bearer ${googleToken}` },
        });
        const profile = await res.json();

        const { ok, data } = await loginWithGoogle(profile.name, profile.email, profile.id);

        if (ok && data.user && data.token) {
          const userWithToken = { ...data.user, token: data.token };
          await AsyncStorage.setItem('user', JSON.stringify(userWithToken));
          await login(userWithToken);
          navigation.reset({
            index: 0,
            routes: [{ name: 'UserTabs', params: { user: data.user } }],
          });
        } else {
          setErrorMsg(data.error || 'Error al iniciar sesión con Google.');
        }
      } else {
        setErrorMsg('Inicio de sesión cancelado o fallido.');
      }
    } catch (error) {
      console.error('Error en Google Login:', error);
      setErrorMsg('Error al conectar con Google.');
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
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Ingresar</Text>}
    </TouchableOpacity>

    {errorMsg !== '' && <Text style={styles.errorText}>{errorMsg}</Text>}

    <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
      <View style={styles.socialButtonContent}>
        <Ionicons name="logo-google" size={20} color="white" style={styles.icon} />
        <Text style={styles.buttonText}>Ingresar con Google</Text>
      </View>
    </TouchableOpacity>

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
  googleButton: {
  backgroundColor: '#4285F4',
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 10,
},
socialButtonContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},
icon: {
  marginRight: 8,
},

});