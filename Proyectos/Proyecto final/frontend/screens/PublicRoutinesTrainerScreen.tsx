import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Button
} from 'react-native';
import { getPublicRoutines, deleteRoutine, createRoutine } from '../services/api';

export default function PublicRoutinesTrainerScreen({ route, navigation }: any) {
  const { user } = route.params;
  const [routines, setRoutines] = useState<any[]>([]);
  const [selectedRoutineId, setSelectedRoutineId] = useState<number | null>(null);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

    useFocusEffect(
    React.useCallback(() => {
        loadRoutines();
    }, [])
    );


  const loadRoutines = async () => {
    const res = await getPublicRoutines();
    if (res.ok) setRoutines(res.data);
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
      navigation.navigate('PublicRoutineEdit', {
        screen: 'RoutineBuilder',
        params: { routineId: res.data.id, user, editMode: true },
      });
    }
    setLoading(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRoutineId) return;
    setLoading(true);
    const res = await deleteRoutine(selectedRoutineId);
    if (res.ok) {
      await loadRoutines();
      setDeleteVisible(false);
      setSelectedRoutineId(null);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌍 Rutinas Públicas (Entrenador)</Text>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Crear nueva rutina pública</Text>
      </TouchableOpacity>

      <FlatList
        data={routines}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.routineTitle}>{item.titulo}</Text>
            <Text style={styles.desc}>{item.descripcion}</Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() =>
                  navigation.navigate('PublicRoutineEdit', {
                    screen: 'RoutineDetail',
                    params: { routineId: item.id, user, readonly: true },
                  })
                }
              >
                <Text style={styles.buttonText}>Ver detalles</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  navigation.navigate('PublicRoutineEdit', {
                    screen: 'RoutineBuilder',
                    params: { routineId: item.id, user, editMode: true },
                  })
                }
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  setSelectedRoutineId(item.id);
                  setDeleteVisible(true);
                }}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal de creación */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Nueva Rutina Pública</Text>
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

      {/* Modal de eliminación */}
      <Modal visible={deleteVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>¿Eliminar esta rutina pública?</Text>
            <Text style={styles.modalText}>Esta acción no se puede deshacer.</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setDeleteVisible(false);
                  setSelectedRoutineId(null);
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmDeleteButton}
                onPress={handleConfirmDelete}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Eliminando...' : 'Confirmar'}
                </Text>
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
  createButton: {
    backgroundColor: '#ff7f00',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  card: { backgroundColor: '#1e1e1e', padding: 15, borderRadius: 10, marginBottom: 10 },
  routineTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  desc: { color: '#ccc', marginBottom: 10 },
  buttonRow: { flexDirection: 'row', gap: 10, justifyContent: 'space-between' },
  detailsButton: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#00b894',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#d63031',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  modalText: { color: '#ccc', fontSize: 14, marginBottom: 20, textAlign: 'center' },
  input: {
    backgroundColor: '#1e1e1e',
    color: 'white',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  inputError: { borderColor: '#ff4d4d' },
  error: { color: '#ff4d4d', fontSize: 14, marginBottom: 10 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  cancelButton: {
    backgroundColor: '#555',
    padding: 10,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  confirmDeleteButton: {
    backgroundColor: '#d63031',
    padding: 10,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
});