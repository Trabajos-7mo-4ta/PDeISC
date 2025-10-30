// screens/ProgressScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import { getProgressByUser, createProgress, getCurrentRoutine } from '../services/api';
import Header from '../components/Header';

export default function ProgressScreen({ route }: any) {
  const { user } = route.params;
  const [progressList, setProgressList] = useState<any[]>([]);
  const [descripcion, setDescripcion] = useState('');
  const [semana, setSemana] = useState('');
  const [currentRoutine, setCurrentRoutine] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    await loadCurrentRoutine();
    await loadProgress();
    setLoading(false);
  };

  const loadCurrentRoutine = async () => {
    const res = await getCurrentRoutine(user.id);
    if (res.ok) {
      setCurrentRoutine(res.data);
      console.log('Rutina actual:', res.data);
    } else {
      setCurrentRoutine(null);
      console.log('Error cargando rutina actual:', res.data);
    }
  };

  const loadProgress = async () => {
    const res = await getProgressByUser(user.id);
    if (res.ok) setProgressList(res.data);
    else setProgressList([]);
  };

  const handleAdd = async () => {
    if (!descripcion.trim() || !semana.trim() || !currentRoutine) {
      console.log('Error: completa todos los campos o no hay rutina actual.');
      return;
    }

    setLoading(true);
    const res = await createProgress(user.id, currentRoutine.id, parseInt(semana), descripcion);
    if (res.ok) {
      console.log('Progreso guardado:', res.data);
      setDescripcion('');
      setSemana('');
      await refreshData();
    } else {
      console.log('Error guardando progreso:', res.data);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Header nombre={user.nombre} rol={user.rol} />
      <Text style={styles.title}>Progreso Semanal</Text>

      <Text style={{ color: '#ccc', marginBottom: 8 }}>
        Rutina actual: {currentRoutine ? currentRoutine.titulo : 'No hay rutina actual'}
      </Text>

      <TextInput
        placeholder="Número de semana..."
        placeholderTextColor="#aaa"
        value={semana}
        keyboardType="numeric"
        onChangeText={setSemana}
        style={styles.input}
      />

      <TextInput
        placeholder="Describe tu progreso..."
        placeholderTextColor="#aaa"
        value={descripcion}
        onChangeText={setDescripcion}
        style={[styles.input, { height: 100 }]}
        multiline
      />

      <Button title={loading ? 'Guardando...' : 'Registrar progreso'} onPress={handleAdd} disabled={loading} />

      <FlatList
        data={progressList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.desc}>Semana {item.semana}</Text>
            <Text style={styles.desc}>{item.descripcion}</Text>
            <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 15 },
  title: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  input: { backgroundColor: '#1e1e1e', color: 'white', padding: 10, borderRadius: 10, marginBottom: 10 },
  card: { backgroundColor: '#1e1e1e', padding: 10, borderRadius: 10, marginBottom: 10 },
  desc: { color: '#ccc' },
  date: { color: '#888', fontSize: 12 },
});