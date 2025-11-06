import React, { useState } from 'react';
import {
  View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Modal
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getExerciseCatalog, deleteCatalogExercise } from '../services/api';

export default function ExerciseCatalogScreen({ route, navigation }: any) {
  const { user } = route.params;
  const [exercises, setExercises] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);


  useFocusEffect(
    React.useCallback(() => {
      loadExercises();
    }, [])
  );

  const loadExercises = async () => {
    setLoading(true);
    const res = await getExerciseCatalog();
    if (res.ok) setExercises(res.data);
    else setExercises([]);
    setLoading(false);
  };

  const filtered = exercises.filter((ex) =>
    ex.nombre_ejercicio.toLowerCase().includes(search.toLowerCase()) &&
    (filter ? ex.grupo_muscular === filter : true)
  );

    const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    const res = await deleteCatalogExercise(confirmDeleteId);
    if (res.ok) await loadExercises();
    setConfirmDeleteId(null);
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Catálogo de Ejercicios</Text>

      <TextInput
        placeholder="Buscar por nombre..."
        placeholderTextColor="#aaa"
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.nombre_ejercicio}</Text>
            <Text style={styles.group}>Grupo muscular: {item.grupo_muscular}</Text>
            <Text style={styles.desc}>{item.descripcion}</Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  navigation.navigate('ExerciseEditor', {
                    user,
                    exerciseId: item.id,
                    initialData: item,
                  })
                }
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => setConfirmDeleteId(item.id)}
                >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('ExerciseEditor', { user })}
      >
        <Text style={styles.buttonText}>Crear nuevo ejercicio</Text>
      </TouchableOpacity>
    
    <Modal visible={!!confirmDeleteId} transparent animationType="fade">
        <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>¿Eliminar este ejercicio?</Text>
            <Text style={styles.modalText}>Esta acción no se puede deshacer.</Text>
            <View style={styles.modalButtons}>
                <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setConfirmDeleteId(null)}
                >
                <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.confirmDeleteButton}
                onPress={confirmDelete}
                >
                <Text style={styles.buttonText}>Eliminar</Text>
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
  input: {
    backgroundColor: '#1e1e1e',
    color: 'white',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  card: { backgroundColor: '#1e1e1e', padding: 15, borderRadius: 10, marginBottom: 10 },
  name: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  group: { color: '#ccc', marginBottom: 5 },
  desc: { color: '#aaa', marginBottom: 10 },
  buttonRow: { flexDirection: 'row', gap: 10, justifyContent: 'space-between' },
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
  createButton: {
    backgroundColor: '#1e90ff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
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
