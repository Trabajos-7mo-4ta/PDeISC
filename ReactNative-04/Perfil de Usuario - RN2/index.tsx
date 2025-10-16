import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '638800874495-5lu4a2le07os6lpo76n3tnqqcaleb3i9.apps.googleusercontent.com', 
  });

  useEffect(() => {
    if (response?.type === 'success') {
      // Si login exitoso, vamos a la pantalla home
      router.push('/home');
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }}
        style={styles.logo}
      />
      <Text style={styles.title}>Iniciar sesión con Google</Text>
      <Pressable
        disabled={!request}
        style={styles.button}
        onPress={() => promptAsync()}
      >
        <Text style={styles.buttonText}>Continuar con Google</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 100, height: 100, marginBottom: 30 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 40 },
  button: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
