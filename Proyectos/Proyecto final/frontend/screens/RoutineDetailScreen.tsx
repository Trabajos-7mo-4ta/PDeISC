// screens/RoutineDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { getRoutineDetails } from '../services/api';
import Header from '../components/Header';

export default function RoutineDetailScreen({ route, navigation }: any) {
  const { routineId, user } = route.params;
  const [routine, setRoutine] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoutine();
  }, []);

  const loadRoutine = async () => {
    const res = await getRoutineDetails(routineId);
    if (res.ok) setRoutine(res.data);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color="#1e90ff" size="large" />
      </View>
    );
  }

  if (!routine) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white' }}>No se pudo cargar la rutina.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header nombre={user.nombre} rol={user.rol} />
      <Text style={styles.title}>{routine.titulo}</Text>
      <Text style={styles.desc}>{routine.descripcion}</Text>

      <FlatList
        data={routine.dias}
        keyExtractor={(dia) => dia.id.toString()}
        renderItem={({ item: dia }) => (
          <View style={styles.dayCard}>
            <Text style={styles.dayTitle}>{dia.nombre_dia}</Text>
            <FlatList
              data={dia.ejercicios}
              keyExtractor={(e) => e.id.toString()}
              renderItem={({ item: ej }) => (
                <Text style={styles.exercise}>
                  • {ej.nombre_ejercicio} ({ej.series}x{ej.repeticiones})
                </Text>
              )}
            />
          </View>
        )}
      />

      <Button title="Editar rutina" onPress={() => alert('Próximamente')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 15 },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  desc: { color: '#ccc', marginBottom: 15 },
  dayCard: { backgroundColor: '#1e1e1e', padding: 10, borderRadius: 10, marginBottom: 10 },
  dayTitle: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 5 },
  exercise: { color: '#ccc', marginLeft: 10 },
});
