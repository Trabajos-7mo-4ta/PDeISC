import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

export default function BasicComponents() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Componentes Básicos</Text>

      <View style={styles.card}>
        <Text style={styles.title}>1️⃣ View + Text</Text>
        <Text style={styles.subtitle}>
          View es un contenedor y Text sirve para mostrar texto.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>2️⃣ Image</Text>
        <Text style={styles.subtitle}>
          Image muestra imágenes locales o remotas.
        </Text>
        <Image
          source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
          style={styles.image}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>3️⃣ ScrollView</Text>
        <Text style={styles.subtitle}>
          ScrollView permite hacer scroll vertical u horizontal.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center', backgroundColor: '#FFF3E0' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#FB8C00' },
  card: {
    backgroundColor: '#FFCC80',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center' },
  image: { width: 80, height: 80, marginTop: 10 },
});