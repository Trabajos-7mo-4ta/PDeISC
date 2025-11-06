import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  getAllUsers,
  getPublicRoutines,
  getExerciseCatalog,
  getUserRoutines,
  getProgressByUser
} from '../services/api';

export default function AdminDashboardScreen({ route }: any) {
  const { user } = route.params;
  const [users, setUsers] = useState<any[]>([]);
  const [publicRoutines, setPublicRoutines] = useState<any[]>([]);
  const [privateRoutines, setPrivateRoutines] = useState<any[]>([]);
  const [catalog, setCatalog] = useState<any[]>([]);
  const [progressRecords, setProgressRecords] = useState<any[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const u = await getAllUsers();
    const r = await getPublicRoutines();
    const c = await getExerciseCatalog();

    const allPrivate: any[] = [];
    const allProgress: any[] = [];

    if (u.ok) {
      setUsers(u.data);
      for (const usr of u.data) {
        const rutinas = await getUserRoutines(usr.id);
        if (rutinas.ok) {
          const privadas = rutinas.data.filter((r: any) => !r.publica);
          allPrivate.push(...privadas);
        }

        const progreso = await getProgressByUser(usr.id);
        if (progreso.ok) allProgress.push(...progreso.data);
      }
    }

    if (r.ok) setPublicRoutines(r.data);
    if (c.ok) setCatalog(c.data);
    setPrivateRoutines(allPrivate);
    setProgressRecords(allProgress);
  };

  const countByRole = (rol: string) =>
    users.filter((u) => u.rol === rol).length;

  const latestUsers = [...users].slice(-5).reverse();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Dashboard Administrador</Text>

      <View style={styles.card}>
        <Text style={styles.metric}>👥 Total de usuarios: {users.length}</Text>
        <Text style={styles.metric}> Usuarios estándar: {countByRole('user')}</Text>
        <Text style={styles.metric}> Entrenadores: {countByRole('entrenador')}</Text>
        <Text style={styles.metric}> Administradores: {countByRole('admin')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.metric}> Rutinas públicas: {publicRoutines.length}</Text>
        <Text style={styles.metric}> Rutinas privadas: {privateRoutines.length}</Text>
        <Text style={styles.metric}> Ejercicios en catálogo: {catalog.length}</Text>
        <Text style={styles.metric}> Registros de progreso: {progressRecords.length}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.subtitle}> Últimos usuarios registrados:</Text>
        <FlatList
          data={latestUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Text style={styles.userItem}>
              • {item.nombre} ({item.rol})
            </Text>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 15, paddingTop: 50 },
  title: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  card: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  metric: { color: '#ccc', fontSize: 16, marginBottom: 5 },
  subtitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  userItem: { color: '#aaa', fontSize: 15, marginBottom: 4 },
});
