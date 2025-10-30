// screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { registerUser } from '../services/api';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

export default function RegisterScreen({ navigation }: Props) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('user');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Validación de correo
  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegister = async () => {
    setErrorMsg('');

    if (!nombre.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Por favor completa todos los campos.');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMsg('El correo no tiene un formato válido (ejemplo: usuario@correo.com).');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      setLoading(true);
      const res = await registerUser(nombre, email, password, rol);
      if (res.ok) {
        navigation.replace('Login');
      } else {
        setErrorMsg(res.data?.error || 'No se pudo registrar el usuario.');
      }
    } catch (error) {
      setErrorMsg('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#888"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo (ej: usuario@correo.com)"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña (mínimo 6 caracteres)"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.label}>Selecciona un rol:</Text>
      <Picker
        selectedValue={rol}
        onValueChange={(itemValue) => setRol(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Usuario" value="user" />
        <Picker.Item label="Entrenador" value="entrenador" />
        <Picker.Item label="Administrador" value="admin" />
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Registrarse</Text>
        )}
      </TouchableOpacity>

      {errorMsg !== '' && <Text style={styles.errorText}>{errorMsg}</Text>}

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.registerText}>¿Ya tienes cuenta? Inicia sesión</Text>
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
  label: { color: 'white', marginBottom: 5 },
  picker: { backgroundColor: '#1E1E1E', color: 'white', marginBottom: 20 },
  button: {
    backgroundColor: '#00b894',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  registerText: { color: '#ccc', marginTop: 15, textAlign: 'center' },
  errorText: { color: '#ff7675', textAlign: 'center', marginTop: 10 },
});