// screens/RoutineBuilderScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, FlatList, Modal
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {
  getDaysByRoutine, createDay,
  getExercisesByDay, createExercise,
  getExerciseCatalog, deleteDay
} from '../services/api';

export default function RoutineBuilderScreen({ route, navigation }: any) {
  const { routineId, user } = route.params;
  const [days, setDays] = useState<any[]>([]);
  const [catalog, setCatalog] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState<number | null>(null);
  const [nombreDia, setNombreDia] = useState('');
  const [orden, setOrden] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [series, setSeries] = useState('');
  const [repeticiones, setRepeticiones] = useState('');
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [dayToDelete, setDayToDelete] = useState<number | null>(null);
  const [dayErrors, setDayErrors] = useState<any>({});
  const [exerciseErrors, setExerciseErrors] = useState<any>({});

  useEffect(() => {
    loadDays();
    loadCatalog();
  }, []);

  const loadDays = async () => {
    const res = await getDaysByRoutine(routineId);
    if (res.ok) {
      const enriched = await Promise.all(res.data.map(async (day: any) => {
        const exRes = await getExercisesByDay(day.id);
        return { ...day, exercises: exRes.ok ? exRes.data : [] };
      }));
      setDays(enriched);
    }
  };

  const loadCatalog = async () => {
    const res = await getExerciseCatalog();
    if (res.ok) setCatalog(res.data);
  };

  const validateDay = () => {
    const errors: any = {};
    if (!nombreDia.trim()) errors.nombreDia = 'El nombre del día es obligatorio.';
    if (!orden.trim()) errors.orden = 'El orden es obligatorio.';
    else if (!/^\d{1,2}$/.test(orden)) errors.orden = 'Solo se permiten números de hasta 2 cifras.';
    setDayErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddDay = async () => {
    if (!validateDay()) return;
    const res = await createDay(routineId, nombreDia, parseInt(orden));
    if (res.ok) {
      setNombreDia('');
      setOrden('');
      setDayErrors({});
      await loadDays();
    }
  };

  const validateExercise = () => {
    const errors: any = {};
    if (!selectedExercise) errors.selectedExercise = 'Selecciona un ejercicio.';
    if (!series.trim()) errors.series = 'Las series son obligatorias.';
    else if (!/^\d{1,2}$/.test(series)) errors.series = 'Solo se permiten números de hasta 2 cifras.';
    if (!repeticiones.trim()) errors.repeticiones = 'Las repeticiones son obligatorias.';
    else if (!/^\d{1,2}$/.test(repeticiones)) errors.repeticiones = 'Solo se permiten números de hasta 2 cifras.';
    setExerciseErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddExercise = async () => {
    if (!selectedDayId || !validateExercise()) return;
    const res = await createExercise(
      selectedDayId,
      parseInt(selectedExercise),
      parseInt(series),
      parseInt(repeticiones)
    );
    if (res.ok) {
      setModalVisible(false);
      setSelectedExercise('');
      setSeries('');
      setRepeticiones('');
      setExerciseErrors({});
      await loadDays();
    }
  };

  const confirmDeleteDay = (id: number) => {
    setDayToDelete(id);
    setConfirmDeleteVisible(true);
  };

  const handleDeleteDayConfirmed = async () => {
    if (dayToDelete) {
      const res = await deleteDay(dayToDelete);
      if (res.ok) await loadDays();
      setConfirmDeleteVisible(false);
      setDayToDelete(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Constructor de Rutina</Text>

      <TextInput
        placeholder="Nombre del día"
        placeholderTextColor="#aaa"
        value={nombreDia}
        onChangeText={setNombreDia}
        style={[styles.input, dayErrors.nombreDia && styles.inputError]}
      />
      {dayErrors.nombreDia && <Text style={styles.errorText}>{dayErrors.nombreDia}</Text>}

      <TextInput
        placeholder="Orden"
        placeholderTextColor="#aaa"
        value={orden}
        onChangeText={setOrden}
        keyboardType="numeric"
        style={[styles.input, dayErrors.orden && styles.inputError]}
      />
      {dayErrors.orden && <Text style={styles.errorText}>{dayErrors.orden}</Text>}

      <Button title="Agregar Día" onPress={handleAddDay} />

      <FlatList
        data={days}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.dayCard}>
            <Text style={styles.dayTitle}>{item.nombre_dia}</Text>
            {item.exercises.map((ex: any) => (
              <Text key={ex.id} style={styles.exerciseText}>
                • {ex.nombre_ejercicio} ({ex.series}x{ex.repeticiones})
              </Text>
            ))}
            <Button
              title="Agregar Ejercicio"
              onPress={() => {
                setSelectedDayId(item.id);
                setModalVisible(true);
              }}
            />
            <Button
              title="Eliminar Día"
              color="red"
              onPress={() => confirmDeleteDay(item.id)}
            />
          </View>
        )}
      />

      {/* Modal para agregar ejercicio */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Agregar Ejercicio</Text>
            <Picker
              selectedValue={selectedExercise}
              onValueChange={(itemValue) => setSelectedExercise(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Seleccionar ejercicio..." value="" />
              {catalog.map((ex) => (
                <Picker.Item
                  key={ex.id}
                  label={`${ex.nombre_ejercicio} (${ex.grupo_muscular})`}
                  value={ex.id.toString()}
                />
              ))}
            </Picker>
            {exerciseErrors.selectedExercise && <Text style={styles.errorText}>{exerciseErrors.selectedExercise}</Text>}

            <TextInput
              placeholder="Series"
              placeholderTextColor="#aaa"
              value={series}
              onChangeText={setSeries}
              keyboardType="numeric"
              style={[styles.input, exerciseErrors.series && styles.inputError]}
            />
            {exerciseErrors.series && <Text style={styles.errorText}>{exerciseErrors.series}</Text>}

            <TextInput
              placeholder="Repeticiones"
              placeholderTextColor="#aaa"
              value={repeticiones}
              onChangeText={setRepeticiones}
              keyboardType="numeric"
              style={[styles.input, exerciseErrors.repeticiones && styles.inputError]}
            />
            {exerciseErrors.repeticiones && <Text style={styles.errorText}>{exerciseErrors.repeticiones}</Text>}

            <Button title="Guardar" onPress={handleAddExercise} />
            <Button title="Cancelar" color="gray" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <View style={{ marginTop: 20 }}>
        <Button
          title="Guardar y salir"
          color="#ff7f00"
          onPress={() => navigation.goBack()}
        />
      </View>

      <Modal visible={confirmDeleteVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>¿Eliminar este día?</Text>
            <Text style={{ color: '#ccc', marginBottom: 20, textAlign: 'center' }}>
              Esta acción no se puede deshacer.
            </Text>
            <Button title="Eliminar" color="red" onPress={handleDeleteDayConfirmed} />
            <Button title="Cancelar" color="gray" onPress={() => setConfirmDeleteVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 15, paddingTop: 50 },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: 'white',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  inputError: {
    borderColor: '#ff4d4d',
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 14,
    marginBottom: 10,
  },
  dayCard: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  dayTitle: {
    color: '#1e90ff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  exerciseText: {
    color: '#ccc',
    marginLeft: 10,
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalBox: {
    backgroundColor: '#222',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  picker: {
    backgroundColor: '#1e1e1e',
    color: 'white',
    marginBottom: 10,
  },
});