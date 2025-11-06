import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Modal
} from 'react-native';
import { getPublicRoutines, copyRoutine } from '../services/api';

export default function PublicRoutinesScreen({ route, navigation }: any) {
  const { user } = route.params;
  const [routines, setRoutines] = useState<any[]>([]);
  const [selectedRoutineId, setSelectedRoutineId] = useState<number | null>(null);
  const [copyVisible, setCopyVisible] = useState(false);
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

  const handleConfirmCopy = async () => {
    if (!selectedRoutineId) return;
    setLoading(true);
    const res = await copyRoutine(selectedRoutineId, user.id);
    if (res.ok) {
      setCopyVisible(false);
      setSelectedRoutineId(null);
      navigation.navigate('MyRoutine');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌍 Rutinas Públicas</Text>

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
                  navigation.navigate('MyRoutine', {
                    screen: 'RoutineDetail',
                    params: { routineId: item.id, user, readonly: true },
                  })
                }
              >
                <Text style={styles.buttonText}>Ver detalles</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => {
                  setSelectedRoutineId(item.id);
                  setCopyVisible(true);
                }}
              >
                <Text style={styles.buttonText}>Copiar rutina</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={copyVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>¿Copiar esta rutina?</Text>
            <Text style={styles.modalText}>
              Se agregará a tus rutinas personales y podrás editarla libremente.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setCopyVisible(false);
                  setSelectedRoutineId(null);
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmCopy}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Copiando...' : 'Confirmar'}
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
  copyButton: {
    backgroundColor: '#ff7f00',
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
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelButton: {
    backgroundColor: '#555',
    padding: 10,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#ff7f00',
    padding: 10,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
});