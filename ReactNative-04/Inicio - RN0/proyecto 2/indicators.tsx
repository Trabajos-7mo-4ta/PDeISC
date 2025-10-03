import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, ScrollView } from 'react-native';


export default function IndicatorsScreen() {
  const [progress, setProgress] = useState(0.3);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Indicadores</Text>

      <View style={styles.card}>
        <Text style={styles.title}>1️⃣ ActivityIndicator</Text>
        <Text style={styles.subtitle}>Muestra una animación de carga.</Text>
        <ActivityIndicator size="large" color="#E64A19" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center', backgroundColor: '#FBE9E7' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#D84315' },
  card: { backgroundColor: '#FFCCBC', padding: 20, borderRadius: 15, marginBottom: 15, width: '100%', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 8 },
});
