// components/ExerciseForm.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface Exercise {
  id?: number;
  catalogo_id: number;
  nombre_ejercicio: string;
  series: number;
  repeticiones: number;
}

interface Props {
  exercise: Exercise;
  catalog: Exercise[]; // ✅ agregado
  onChange: (exercise: Exercise) => void;
  onDelete: () => void;
}

export default function ExerciseForm({ exercise, catalog, onChange, onDelete }: Props) {
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={exercise.catalogo_id}
        onValueChange={(value) => {
          const selected = catalog.find((c) => c.id === value);
          onChange({
            ...exercise,
            catalogo_id: value,
            nombre_ejercicio: selected?.nombre_ejercicio || '',
          });
        }}
        style={styles.picker}
      >
        <Picker.Item label="Selecciona un ejercicio" value={0} />
        {catalog.map((item) => (
          <Picker.Item key={item.id} label={item.nombre_ejercicio} value={item.id} />
        ))}
      </Picker>

      <Text>Series:</Text>
      <Picker
        selectedValue={exercise.series}
        onValueChange={(value) => onChange({ ...exercise, series: value })}
        style={styles.picker}
      >
        {[...Array(20).keys()].map((i) => (
          <Picker.Item key={i + 1} label={`${i + 1}`} value={i + 1} />
        ))}
      </Picker>

      <Text>Repeticiones:</Text>
      <Picker
        selectedValue={exercise.repeticiones}
        onValueChange={(value) => onChange({ ...exercise, repeticiones: value })}
        style={styles.picker}
      >
        {[...Array(50).keys()].map((i) => (
          <Picker.Item key={i + 1} label={`${i + 1}`} value={i + 1} />
        ))}
      </Picker>

      <Button title="Eliminar" onPress={onDelete} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 10, padding: 8, backgroundColor: '#121212', borderRadius: 6 },
  picker: { color: 'white', backgroundColor: '#1e1e1e', marginBottom: 5 },
});