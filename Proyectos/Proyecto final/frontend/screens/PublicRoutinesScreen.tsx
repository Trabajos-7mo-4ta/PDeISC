// screens/PublicRoutinesScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import { getPublicRoutines } from '../services/api';
import Header from '../components/Header';

interface Props {
  route: any;
}

export default function PublicRoutinesScreen({ route }: Props) {
  const { user } = route.params;
  const [routines, setRoutines] = useState<any[]>([]);

  useEffect(() => {
    loadRoutines();
  }, []);

  const loadRoutines = async () => {
    const res = await getPublicRoutines();
    if (res.ok) setRoutines(res.data);
  };

  const handleCopy = (routineId: number) => {
    Alert.alert(
      'Confirmar',
      '¿Deseas copiar esta rutina? Se reemplazará tu rutina actual.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Aceptar', onPress: () => Alert.alert('Rutina copiada (demo)') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header nombre={user.nombre} rol={user.rol} />
      <Text style={styles.title}>Rutinas Públicas</Text>

      <FlatList
        data={routines}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.routineTitle}>{item.titulo}</Text>
            <Text style={styles.desc}>{item.descripcion}</Text>
            <Button title="Copiar rutina" onPress={() => handleCopy(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 15 },
  title: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  card: { backgroundColor: '#1e1e1e', padding: 15, borderRadius: 10, marginBottom: 10 },
  routineTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  desc: { color: '#ccc', marginBottom: 10 },
});
