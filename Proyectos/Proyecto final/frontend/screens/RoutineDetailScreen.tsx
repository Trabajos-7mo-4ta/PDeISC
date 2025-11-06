// screens/RoutineDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  ActivityIndicator,
} from 'react-native';
import { getRoutineDetails } from '../services/api';

export default function RoutineDetailScreen({ route, navigation }: any) {
  const { routineId, user, readonly } = route.params;
  const [routine, setRoutine] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoutine();
  }, []);

  const loadRoutine = async () => {
    const res = await getRoutineDetails(routineId);
    if (res.ok) {
      setRoutine(res.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color="#1e90ff" size="large" />
      </View>
    );
  }

  if (!routine || !routine.days || routine.days.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyMessage}>
          No se pudo cargar la rutina o no tiene días asignados.
        </Text>

        {!readonly && (
          <View style={{ marginTop: 20 }}>
            <Button
              title="Editar rutina"
              color="#ff7f00"
              onPress={() =>
                navigation.navigate('RoutineBuilder', {
                  routineId,
                  user,
                  editMode: true,
                })
              }
            />
          </View>
        )}

        <View style={{ marginTop: 10 }}>
          <Button
            title="Volver"
            color="gray"
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {readonly ? '🧾 Detalle de rutina pública' : routine.routine.titulo}
      </Text>
      {!readonly && <Text style={styles.desc}>{routine.routine.descripcion}</Text>}

      <FlatList
        data={routine.days}
        keyExtractor={(dia) => dia.id.toString()}
        renderItem={({ item: dia }) => (
          <View style={styles.dayCard}>
            <Text style={styles.dayTitle}>{dia.nombre_dia}</Text>
            {dia.exercises.length === 0 ? (
              <Text style={styles.exercise}>No hay ejercicios asignados.</Text>
            ) : (
              dia.exercises.map((ej: any) => (
                <Text key={ej.id} style={styles.exercise}>
                  • {ej.nombre_ejercicio} ({ej.series}x{ej.repeticiones}) – {ej.grupo_muscular}
                </Text>
              ))
            )}
          </View>
        )}
      />

      {!readonly && (
        <View style={{ marginTop: 20 }}>
          <Button
            title="Editar rutina"
            color="#ff7f00"
            onPress={() =>
              navigation.navigate('RoutineBuilder', {
                routineId,
                user,
                editMode: true,
              })
            }
          />
        </View>
      )}

      <View style={{ marginTop: 10 }}>
        <Button
          title="Volver"
          color="gray"
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 15, paddingTop: 50 },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  desc: { color: '#ccc', marginBottom: 15 },
  dayCard: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  dayTitle: { color: '#1e90ff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  exercise: { color: '#ccc', marginLeft: 10, marginBottom: 5 },
  emptyMessage: {
    color: '#ff7f00',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
});