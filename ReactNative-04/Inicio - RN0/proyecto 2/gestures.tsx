import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableHighlight, ScrollView } from 'react-native';

export default function GesturesScreen() {
  const [messagePressable, setMessagePressable] = useState('');
  const [messageHighlight, setMessageHighlight] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Gestos y Pulsaciones</Text>

      {/* Pressable */}
      <View style={styles.card}>
        <Text style={styles.title}>1️⃣ Pressable</Text>
        <Text style={styles.subtitle}>Pressable detecta toques con estilo personalizable.</Text>
        <Pressable
          onPress={() => setMessagePressable('Pressable tocado')}
          style={({ pressed }) => [
            { backgroundColor: pressed ? '#81C784' : '#388E3C', padding: 10, borderRadius: 8 },
          ]}
        >
          <Text style={{ color: '#fff' }}>Tocame</Text>
        </Pressable>
        {messagePressable !== '' && <Text style={styles.message}>{messagePressable}</Text>}
      </View>

      {/* TouchableHighlight */}
      <View style={styles.card}>
        <Text style={styles.title}>2️⃣ TouchableHighlight</Text>
        <Text style={styles.subtitle}>TouchableHighlight resalta el fondo al presionar.</Text>
        <TouchableHighlight
          onPress={() => setMessageHighlight('TouchableHighlight tocado')}
          underlayColor="#81C784"
          style={{ backgroundColor: '#388E3C', padding: 10, borderRadius: 8 }}
        >
          <Text style={{ color: '#fff' }}>Tocame</Text>
        </TouchableHighlight>
        {messageHighlight !== '' && <Text style={styles.message}>{messageHighlight}</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center', backgroundColor: '#E0F2F1' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#00796B' },
  card: { backgroundColor: '#80CBC4', padding: 20, borderRadius: 15, marginBottom: 15, width: '100%', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 8 },
  message: { marginTop: 10, fontSize: 16, color: '#004D40', fontWeight: 'bold' },
});
