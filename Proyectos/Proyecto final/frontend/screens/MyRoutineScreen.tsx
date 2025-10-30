// screens/MyRoutineScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Modal, TextInput } from 'react-native';
import { getUserRoutines, deleteRoutine, createRoutine, setRoutineAsCurrent } from '../services/api';
import Header from '../components/Header';

export default function MyRoutineScreen({ route, navigation }: any) {
  const { user } = route.params;
  const [routines, setRoutines] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRoutines();
  }, []);

  const loadRoutines = async () => {
    const res = await getUserRoutines(user.id);
    if (res.ok) {
      setRoutines(res.data);
      console.log('Rutinas cargadas:', res.data.length);
    } else {
      console.log('Error cargando rutinas:', res.data);
      setRoutines([]);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    const res = await deleteRoutine(id);
    if (res.ok) {
      console.log('Rutina eliminada:', id);
      await loadRoutines();
    } else {
      console.log('Error eliminando rutina:', res.data);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!titulo.trim() || !descripcion.trim()) {
      console.log('Error: completa todos los campos para crear rutina.');
      return;
    }

    setLoading(true);
    const res = await createRoutine(user.id, titulo, descripcion);
    if (res.ok) {
      console.log('Rutina creada:', res.data);
      setTitulo('');
      setDescripcion('');
      setModalVisible(false);
      await loadRoutines();
    } else {
      console.log('Error creando rutina:', res.data);
    }
    setLoading(false);
  };

  const handleSetCurrent = async (routineId: number) => {
    setLoading(true);
    const res = await setRoutineAsCurrent(routineId, user.id);
    if (res.ok) {
      console.log('Rutina marcada como actual:', routineId);
      await loadRoutines(); // refresca flags
    } else {
      console.log('Error marcando actual:', res.data);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Header nombre={user.nombre} rol={user.rol} />
      <Text style={styles.title}>Mis Rutinas</Text>

      <Button title="➕ Crear nueva rutina" onPress={() => setModalVisible(true)} />

      <FlatList
        data={routines}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.routineTitle}>
              {item.titulo} {item.actual ? ' (Actual)' : ''}
            </Text>
            <Text style={styles.desc}>{item.descripcion}</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button
                title="Ver detalles"
                onPress={() => navigation.navigate('RoutineDetail', { routineId: item.id, user })}
              />
              <Button title="Hacer actual" onPress={() => handleSetCurrent(item.id)} />
              <Button title="Eliminar" color="red" onPress={() => handleDelete(item.id)} />
            </View>
          </View>
        )}
      />

      {/* Modal para crear rutina */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Nueva Rutina</Text>
            <TextInput
              placeholder="Título"
              placeholderTextColor="#aaa"
              value={titulo}
              onChangeText={setTitulo}
              style={styles.input}
            />
            <TextInput
              placeholder="Descripción"
              placeholderTextColor="#aaa"
              value={descripcion}
              onChangeText={setDescripcion}
              style={[styles.input, { height: 100 }]}
              multiline
            />
            <Button title="Guardar" onPress={handleCreate} />
            <Button title="Cancelar" color="gray" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 15 },
  title: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  card: { backgroundColor: '#1e1e1e', padding: 15, borderRadius: 10, marginBottom: 10 },
  routineTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  desc: { color: '#ccc', marginBottom: 10 },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalBox: { backgroundColor: '#222', margin: 20, padding: 20, borderRadius: 10 },
  modalTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { backgroundColor: '#1e1e1e', color: 'white', padding: 10, borderRadius: 10, marginBottom: 10 },
});