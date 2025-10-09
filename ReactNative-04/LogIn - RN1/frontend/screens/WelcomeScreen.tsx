import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type WelcomeRouteProp = RouteProp<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const route = useRoute<WelcomeRouteProp>();
  const { name } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>¡Bienvenido, {name}!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24, fontWeight: 'bold' },
});