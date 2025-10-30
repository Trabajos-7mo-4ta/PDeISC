// components/DayForm.tsx
import React from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ExerciseForm from './ExerciseForm';

interface Exercise {
  id?: number;
  catalogo_id: number;
  nombre_ejercicio: string;
  series: number;
  repeticiones: number;
}

interface Day {
  id?: number;
  nombre_dia: string;
  orden: number;
  exercises?: Exercise[];
}

interface Props {
  day: Day;
  catalog: Exercise[];
  onChange: (day: Day) => void;
}

export default function DayForm({ day, catalog, onChange }: Props) {
  const handleExerciseChange = (index: number, updatedExercise: Exercise) => {
    const newExercises = [...(day.exercises || [])];
    newExercises[index] = updatedExercise;
    onChange({ ...day, exercises: newExercises });
  };

  const handleAddExercise = (catalogo_id: number) => {
    const selected = catalog.find((ex) => ex.id === catalogo_id);
    if (!selected) return;

    const newExercise: Exercise = {
      catalogo_id,
      nombre_ejercicio: selected.nombre_ejercicio,
      series: 3,
      repeticiones: 10,
    };

    onChange({ ...day, exercises: [...(day.exercises || []), newExercise] });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre del día"
        placeholderTextColor="#888"
        value={day.nombre_dia}
        onChangeText={(text) => onChange({ ...day, nombre_dia: text })}
      />

      <FlatList
        data={day.exercises}
        keyExtractor={(_, index) => `${index}`}
        renderItem={({ item, index }) => (
          <ExerciseForm
            exercise={item}
            catalog={catalog} // ✅ se pasa el catálogo aquí
            onChange={(updated) => handleExerciseChange(index, updated)}
            onDelete={() => {
              const newExercises = [...(day.exercises || [])].filter((_, i) => i !== index);
              onChange({ ...day, exercises: newExercises });
            }}
          />
        )}
      />

      <Text style={styles.label}>Agregar ejercicio del catálogo:</Text>
      <Picker
        style={styles.picker}
        selectedValue={undefined}
        onValueChange={(value) => {
          if (value) handleAddExercise(value);
        }}
      >
        <Picker.Item label="Seleccionar ejercicio..." value={undefined} />
        {catalog.map((ex) => (
          <Picker.Item key={ex.id} label={ex.nombre_ejercicio} value={ex.id} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
  },
  input: {
    backgroundColor: '#121212',
    padding: 8,
    borderRadius: 6,
    marginBottom: 5,
    color: 'white',
  },
  label: {
    color: 'white',
    marginTop: 10,
    marginBottom: 5,
  },
  picker: {
    backgroundColor: '#121212',
    color: 'white',
    borderRadius: 6,
  },
});