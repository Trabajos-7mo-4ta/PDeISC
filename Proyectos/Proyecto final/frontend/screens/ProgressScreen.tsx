// screens/ProgressScreen.tsx
import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import {
  View, Text, FlatList, Button, StyleSheet, ActivityIndicator, TouchableOpacity
} from 'react-native';
import { getProgressByUser, getCurrentRoutine } from '../services/api';

export default function ProgressScreen({ route, navigation }: any) {
  const { user } = route.params;
  const [progressList, setProgressList] = useState<any[]>([]);
  const [currentRoutine, setCurrentRoutine] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
  useCallback(() => {
    refreshData();
  }, [])
  );

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
    } else {
      setCurrentRoutine(null);
    }
  };

  const loadProgress = async () => {
    const res = await getProgressByUser(user.id);
    if (res.ok) setProgressList(res.data);
    else setProgressList([]);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color="#1e90ff" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Progreso</Text>

      <Text style={styles.subtitle}>
        Rutina actual: {currentRoutine ? currentRoutine.titulo : 'No hay rutina actual'}
      </Text>

      {progressList.length === 0 ? (
        <Text style={styles.empty}>Aún no registraste ningún progreso.</Text>
      ) : (
        <FlatList
          data={progressList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('ProgressDetail', { user, progressId: item.id })}>
              <View style={styles.card}>
                <Text style={styles.week}>Semana {item.semana}</Text>
                <Text style={styles.desc}>{item.comentario}</Text>
                <Text style={styles.date}>Rutina: {item.rutina_titulo}</Text>
                <Text style={styles.date}>
                  Registrado el {new Date(item.created_at).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <View style={{ marginTop: 20 }}>
        <Button
          title="Registrar nuevo progreso"
          color="#ff7f00"
          onPress={() => navigation.navigate('ProgressEntry', { user })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 15, paddingTop: 50 },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { color: '#ccc', fontSize: 16, marginBottom: 20 },
  empty: { color: '#888', fontSize: 16, textAlign: 'center', marginTop: 40 },
  card: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  week: { color: '#1e90ff', fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  desc: { color: '#ccc', fontSize: 16, marginBottom: 5 },
  date: { color: '#888', fontSize: 12 },
});