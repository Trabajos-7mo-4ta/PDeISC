import React, { useState } from 'react';
import { View, Text, Button, TextInput, Switch, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function InteractiveComponents() {
  const [text, setText] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [messageButton, setMessageButton] = useState('');
  const [messageTouchable, setMessageTouchable] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Componentes Interactivos</Text>

      {/* Button */}
      <View style={styles.card}>
        <Text style={styles.title}>1️⃣ Button</Text>
        <Text style={styles.subtitle}>Button sirve para realizar acciones al presionarlo.</Text>
        <Button title="Presioname" onPress={() => setMessageButton('Boton presionado')} />
        {messageButton !== '' && <Text style={styles.message}>{messageButton}</Text>}
      </View>

      {/* TextInput */}
      <View style={styles.card}>
        <Text style={styles.title}>2️⃣ TextInput</Text>
        <Text style={styles.subtitle}>TextInput permite que el usuario escriba texto.</Text>
        <TextInput
          style={styles.input}
          placeholder="Escribí algo..."
          value={text}
          onChangeText={setText}
        />
        <Text>Texto escrito: {text}</Text>
      </View>

      {/* Switch */}
      <View style={styles.card}>
        <Text style={styles.title}>3️⃣ Switch</Text>
        <Text style={styles.subtitle}>Switch es un interruptor que se puede encender o apagar.</Text>
        <Switch value={isEnabled} onValueChange={setIsEnabled} />
        <Text>Estado: {isEnabled ? 'Encendido' : 'Apagado'}</Text>
      </View>

    
      {/* TouchableOpacity */}
      <View style={styles.card}>
        <Text style={styles.title}>5️⃣ TouchableOpacity</Text>
        <Text style={styles.subtitle}>TouchableOpacity detecta pulsaciones con efecto visual.</Text>
        <TouchableOpacity
          onPress={() => setMessageTouchable('Tocado con TouchableOpacity')}
          style={styles.touchable}
        >
          <Text style={{ color: '#fff' }}>Tocame</Text>
        </TouchableOpacity>
        {messageTouchable !== '' && <Text style={styles.message}>{messageTouchable}</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center', backgroundColor: '#E8F5E9' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#43A047' },
  card: {
    backgroundColor: '#A5D6A7',
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
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#388E3C', padding: 8, borderRadius: 8, width: '80%' },
  touchable: { backgroundColor: '#388E3C', padding: 10, borderRadius: 8, marginTop: 5 },
  message: { marginTop: 10, fontSize: 16, color: '#1B5E20', fontWeight: 'bold' },
});
