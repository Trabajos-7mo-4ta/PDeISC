import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View, Text, Button, FlatList, StyleSheet, Modal, TextInput, TouchableOpacity
} from 'react-native';
import {
  getUserRoutines,
  deleteRoutine,
  createRoutine,
  setRoutineAsCurrent
} from '../services/api';

export default function MyRoutineScreen({ route, navigation }: any) {
  const { user } = route.params;
  const [routines, setRoutines] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [confirmSetActualId, setConfirmSetActualId] = useState<number | null>(null);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);




  useFocusEffect(
      React.useCallback(() => {
        loadRoutines();
      }, [])
  )

  const loadRoutines = async () => {
    const res = await getUserRoutines(user.id);
    if (res.ok) setRoutines(res.data);
    else setRoutines([]);
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!titulo.trim()) newErrors.titulo = 'El título es obligatorio.';
    else if (/^\d+$/.test(titulo)) newErrors.titulo = 'El título no puede ser solo números.';
    if (!descripcion.trim()) newErrors.descripcion = 'La descripción es obligatoria.';
    else if (/^\d+$/.test(descripcion)) newErrors.descripcion = 'La descripción no puede ser solo números.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const res = await createRoutine(user.id, titulo, descripcion);
    if (res.ok) {
      setTitulo('');
      setDescripcion('');
      setErrors({});
      setModalVisible(false);
      await loadRoutines();
      navigation.navigate('RoutineBuilder', {
        routineId: res.data.id,
        user,
      });
    }
    setLoading(false);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    setLoading(true);
    const res = await deleteRoutine(confirmDeleteId);
    if (res.ok) await loadRoutines();
    setConfirmDeleteId(null);
    setLoading(false);
  };

  const confirmSetActual = async () => {
    if (!confirmSetActualId) return;
    setLoading(true);
    const res = await setRoutineAsCurrent(confirmSetActualId, user.id);
    if (res.ok) await loadRoutines();
    setConfirmSetActualId(null);
    setLoading(false);
  };

  return (
    <View style={styles.container}> 
      <Text style={styles.title}>Mis Rutinas</Text>

      <Button title="Crear nueva rutina" color="#ff7f00" onPress={() => setModalVisible(true)} />

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
              <Button title="Hacer actual" onPress={() => setConfirmSetActualId(item.id)} />
              <Button title="Eliminar" color="red" onPress={() => setConfirmDeleteId(item.id)} />
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
              style={[styles.input, errors.titulo && styles.inputError]}
            />
            {errors.titulo && <Text style={styles.error}>{errors.titulo}</Text>}
            <TextInput
              placeholder="Descripción"
              placeholderTextColor="#aaa"
              value={descripcion}
              onChangeText={setDescripcion}
              style={[styles.input, { height: 100 }, errors.descripcion && styles.inputError]}
              multiline
            />
            {errors.descripcion && <Text style={styles.error}>{errors.descripcion}</Text>}
            <Button title="Guardar" onPress={handleCreate} />
            <Button title="Cancelar" color="gray" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Modal para confirmar eliminación */}
      <Modal visible={!!confirmDeleteId} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>¿Eliminar esta rutina?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setConfirmDeleteId(null)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={confirmDelete}>
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para confirmar marcar como actual */}
      <Modal visible={!!confirmSetActualId} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>¿Marcar esta rutina como actual?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setConfirmSetActualId(null)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={confirmSetActual}>
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 15, paddingTop: 50 },
  title: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  card: { backgroundColor: '#1e1e1e', padding: 15, borderRadius: 10, marginBottom: 10 },
  routineTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  desc: { color: '#ccc', marginBottom: 10 },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalBox: { backgroundColor: '#222', margin: 20, padding: 20, borderRadius: 10 },
  modalTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { backgroundColor: '#1e1e1e', color: 'white', padding: 10, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#333' },
  inputError: { borderColor: '#ff4d4d' },
  error: { color: '#ff4d4d', fontSize: 14, marginBottom: 10 },
  cancelButton: { backgroundColor: '#555', padding: 10, borderRadius: 8, width: '45%', alignItems: 'center' },
  confirmButton: { backgroundColor: '#1e90ff', padding: 10, borderRadius: 8, width: '45%', alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' },
  orangeButton: {
  backgroundColor: '#ff7f00',
  padding: 10,
  borderRadius: 8,
  alignItems: 'center',
},
  deleteButton: {
  backgroundColor: '#ff4d4d',
  padding: 10,
  borderRadius: 8,
  width: '45%',
  alignItems: 'center',
},
});
