import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, ScrollView
} from 'react-native';
import {
  getCurrentRoutine,
  getRoutineDetails,
  createProgress,
  createExerciseProgress
} from '../services/api';

export default function ProgressEntryScreen({ route, navigation }: any) {
  const { user } = route.params;
  const [routine, setRoutine] = useState<any>(null);
  const [semana, setSemana] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [inputs, setInputs] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRoutine();
  }, []);

  const loadRoutine = async () => {
    const res = await getCurrentRoutine(user.id);
    if (res.ok && res.data) {
      const detailRes = await getRoutineDetails(res.data.id);
      if (detailRes.ok) {
        setRoutine(detailRes.data);
      }
    }
  };

  const handleInputChange = (ejercicioId: number, field: string, value: string) => {
    setInputs((prev: any) => ({
      ...prev,
      [ejercicioId]: {
        ...prev[ejercicioId],
        [field]: value,
      },
    }));
  };

  const validateForm = () => {
    const newErrors: any = {};
    let generalError = '';

    if (!semana.trim()) generalError = 'La semana es obligatoria.';
    else if (!descripcion.trim()) generalError = 'La descripción es obligatoria.';
    else if (descripcion.length > 200) generalError = 'La descripción es demasiado larga.';
    else if (/^\d+$/.test(descripcion)) generalError = 'La descripción no puede ser solo números.';
    else if (!routine) generalError = 'No hay rutina cargada.';

    for (const dia of routine?.days || []) {
      for (const ej of dia.exercises) {
        const entry = inputs[ej.id];
        if (!entry?.peso || !entry?.series || !entry?.repeticiones) {
          newErrors[`${ej.id}-missing`] = 'Todos los campos son obligatorios.';
        } else {
          if (isNaN(parseFloat(entry.peso))) newErrors[`${ej.id}-peso`] = 'Debe ser un número.';
          if (isNaN(parseInt(entry.series))) newErrors[`${ej.id}-series`] = 'Debe ser un número.';
          if (isNaN(parseInt(entry.repeticiones))) newErrors[`${ej.id}-repeticiones`] = 'Debe ser un número.';
        }
      }
    }

    setErrors(newErrors);
    setFormError(generalError);
    return !generalError && Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const progressRes = await createProgress(
      user.id,
      routine.routine.id,
      semana,
      descripcion
    );

    if (progressRes.ok) {
      const progressId = progressRes.data.id;

      for (const dia of routine.days) {
        for (const ej of dia.exercises) {
          const entry = inputs[ej.id];
          await createExerciseProgress(
            progressId,
            ej.id,
            parseFloat(entry.peso),
            parseInt(entry.repeticiones),
            parseInt(entry.series),
            new Date().toISOString()
          );
        }
      }

      setSemana('');
      setDescripcion('');
      setInputs({});
      setErrors({});
      setFormError('');
      navigation.goBack();
    }

    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Registrar Progreso</Text>

      <Text style={styles.label}>Rutina actual:</Text>
      <Text style={styles.value}>
        {routine ? routine.routine.titulo : 'No hay rutina actual'}
      </Text>

      <TextInput
        placeholder="Semana"
        placeholderTextColor="#aaa"
        value={semana}
        onChangeText={setSemana}
        keyboardType="numeric"
        style={[styles.input, formError && !semana.trim() && styles.inputError]}
        maxLength={3}
      />

      <TextInput
        placeholder="Descripción general..."
        placeholderTextColor="#aaa"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        style={[
          styles.input,
          { height: 100 },
          formError && !descripcion.trim() && styles.inputError,
        ]}
        maxLength={200}
      />

      {routine?.days.map((dia: any) => (
        <View key={dia.id} style={styles.dayCard}>
          <Text style={styles.dayTitle}>{dia.nombre_dia}</Text>
          {dia.exercises.map((ej: any) => {
            const entry = inputs[ej.id] || {};
            const hasError = errors[`${ej.id}-missing`] || errors[`${ej.id}-peso`] || errors[`${ej.id}-series`] || errors[`${ej.id}-repeticiones`];
            return (
              <View key={ej.id} style={styles.exerciseCard}>
                <Text style={styles.exerciseLabel}>{ej.nombre_ejercicio}</Text>
                <TextInput
                  placeholder="Peso (kg)"
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                  value={entry.peso || ''}
                  onChangeText={(val) => handleInputChange(ej.id, 'peso', val)}
                  style={[styles.input, errors[`${ej.id}-peso`] && styles.inputError]}
                  maxLength={5}
                />
                <TextInput
                  placeholder="Series"
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                  value={entry.series || ''}
                  onChangeText={(val) => handleInputChange(ej.id, 'series', val)}
                  style={[styles.input, errors[`${ej.id}-series`] && styles.inputError]}
                  maxLength={2}
                />
                <TextInput
                  placeholder="Repeticiones"
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                  value={entry.repeticiones || ''}
                  onChangeText={(val) => handleInputChange(ej.id, 'repeticiones', val)}
                  style={[styles.input, errors[`${ej.id}-repeticiones`] && styles.inputError]}
                  maxLength={2}
                />
                {hasError && (
                  <Text style={styles.error}>
                    {errors[`${ej.id}-missing`] ||
                      errors[`${ej.id}-peso`] ||
                      errors[`${ej.id}-series`] ||
                      errors[`${ej.id}-repeticiones`]}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      ))}

      {formError ? <Text style={styles.error}>{formError}</Text> : null}

      <Button
        title={loading ? 'Guardando...' : 'Guardar progreso'}
        onPress={handleSave}
        disabled={loading}
      />
      <View style={{ marginTop: 10 }}>
        <Button
          title="Volver"
          color="gray"
          onPress={() => navigation.goBack()}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 15, paddingTop: 50 },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  label: { color: '#ccc', fontSize: 16 },
  value: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
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
  error: { color: '#ff4d4d', fontSize: 14, marginBottom: 10 },
  dayCard: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  dayTitle: { color: '#1e90ff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  exerciseCard: { marginBottom: 15 },
  exerciseLabel: { color: '#ccc', fontSize: 16, marginBottom: 5 },
});
