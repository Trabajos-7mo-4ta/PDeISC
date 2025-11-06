import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, Button, ScrollView, Modal, TouchableOpacity
} from 'react-native';
import {
  getExerciseProgressByUser,
  deleteProgress
} from '../services/api';

export default function ProgressDetailScreen({ route, navigation }: any) {
  const { user, progressId } = route.params;
  const [exerciseProgress, setExerciseProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadDetails();
  }, []);

  const loadDetails = async () => {
    setLoading(true);
    const res = await getExerciseProgressByUser(user.id);
    if (res.ok) {
      const filtered = res.data.filter((item: any) => item.progress_id === progressId);
      setExerciseProgress(filtered);
    } else {
      setExerciseProgress([]);
    }
    setLoading(false);
  };

  const confirmDelete = async () => {
    const res = await deleteProgress(progressId);
    if (res.ok) {
      setShowModal(false);
      navigation.goBack();
    }
  };

  const groupedByDay = exerciseProgress.reduce((acc: any, item: any) => {
    const day = item.nombre_dia || 'Sin día';
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles del Progreso</Text>

      {loading ? (
        <ActivityIndicator color="#1e90ff" size="large" />
      ) : exerciseProgress.length === 0 ? (
        <Text style={styles.empty}>No hay ejercicios registrados para esta semana.</Text>
      ) : (
        <ScrollView>
          {Object.entries(groupedByDay).map(([dayName, exercises]: any) => (
            <View key={dayName} style={styles.dayGroup}>
              <Text style={styles.dayTitle}>{dayName}</Text>
              {exercises.map((item: any) => (
                <View key={item.id} style={styles.card}>
                  <Text style={styles.exercise}>{item.nombre_ejercicio}</Text>
                  <Text style={styles.detail}>Peso: {item.peso} kg</Text>
                  <Text style={styles.detail}>Series: {item.series}</Text>
                  <Text style={styles.detail}>Repeticiones: {item.repeticiones}</Text>
                  <Text style={styles.date}>
                    Fecha: {new Date(item.fecha).toLocaleDateString()}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Volver" color="gray" onPress={() => navigation.goBack()} />
        <View style={{ marginTop: 10 }}>
          <Button title="Eliminar progreso" color="#ff4d4d" onPress={() => setShowModal(true)} />
        </View>
      </View>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>¿Estás seguro de que querés eliminar este progreso?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmDelete} style={styles.confirmButton}>
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
  title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  empty: { color: '#888', fontSize: 16, textAlign: 'center', marginTop: 40 },
  dayGroup: { marginBottom: 25 },
  dayTitle: {
    color: '#ff7f00',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 5,
  },
  card: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  exercise: { color: '#1e90ff', fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  detail: { color: '#ccc', fontSize: 16 },
  date: { color: '#888', fontSize: 12, marginTop: 5 },
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
  modalText: { color: 'white', fontSize: 16, marginBottom: 20, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelButton: {
    backgroundColor: '#555',
    padding: 10,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
