// components/RoutineForm.tsx
import React from 'react';
import { View, TextInput, Button, StyleSheet, Switch, Text } from 'react-native';

interface Routine {
  id?: number;
  titulo: string;
  descripcion: string;
  publica: boolean;
  actual: boolean;
}

interface Props {
  routine: Routine;
  onChange: (routine: Routine) => void;
  onSave: () => void;
  onDelete?: () => void;
  loading?: boolean;
}

export default function RoutineForm({ routine, onChange, onSave, onDelete, loading }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Título"
        placeholderTextColor="#888"
        value={routine.titulo}
        onChangeText={(text) => onChange({ ...routine, titulo: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Descripción"
        placeholderTextColor="#888"
        value={routine.descripcion}
        onChangeText={(text) => onChange({ ...routine, descripcion: text })}
      />

      <View style={styles.switchContainer}>
        <Text style={{ color: 'white' }}>Rutina pública</Text>
        <Switch
          value={routine.publica}
          onValueChange={(value) => onChange({ ...routine, publica: value })}
        />
      </View>

      <Button title="Guardar rutina" onPress={onSave} disabled={loading} />

      {routine.id && (
        <View style={{ marginTop: 10 }}>
          <Button title="Eliminar rutina" onPress={onDelete} color="red" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20, backgroundColor: '#1e1e1e', padding: 15, borderRadius: 8 },
  input: { backgroundColor: '#121212', padding: 10, borderRadius: 8, marginBottom: 10, color: 'white' },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
});