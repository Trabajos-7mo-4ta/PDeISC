import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, Button, Alert
} from 'react-native';
import {
  createCatalogExercise,
  updateCatalogExercise
} from '../services/api';

export default function ExerciseEditorScreen({ route, navigation }: any) {
  const { user, exerciseId, initialData } = route.params || {};
  const [nombre, setNombre] = useState('');
  const [grupo, setGrupo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre_ejercicio || '');
      setGrupo(initialData.grupo_muscular || '');
      setDescripcion(initialData.descripcion || '');
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: any = {};
    if (!nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
    if (!grupo.trim()) newErrors.grupo = 'El grupo muscular es obligatorio.';
    if (!descripcion.trim()) newErrors.descripcion = 'La descripción es obligatoria.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true);

    let res;
    if (exerciseId) {
      res = await updateCatalogExercise(exerciseId, nombre, grupo, descripcion);
    } else {
      res = await createCatalogExercise(nombre, grupo, descripcion);
    }

    if (res.ok) {
      navigation.navigate('ExerciseCatalog', { user });
    } else {
      Alert.alert('Error', res.data?.error || 'No se pudo guardar el ejercicio');
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {exerciseId ? '✏️ Editar Ejercicio' : '➕ Nuevo Ejercicio'}
      </Text>

      <TextInput
        placeholder="Nombre del ejercicio"
        placeholderTextColor="#aaa"
        value={nombre}
        onChangeText={setNombre}
        style={[styles.input, errors.nombre && styles.inputError]}
      />
      {errors.nombre && <Text style={styles.error}>{errors.nombre}</Text>}

      <TextInput
        placeholder="Grupo muscular"
        placeholderTextColor="#aaa"
        value={grupo}
        onChangeText={setGrupo}
        style={[styles.input, errors.grupo && styles.inputError]}
      />
      {errors.grupo && <Text style={styles.error}>{errors.grupo}</Text>}

      <TextInput
        placeholder="Descripción"
        placeholderTextColor="#aaa"
        value={descripcion}
        onChangeText={setDescripcion}
        style={[styles.input, { height: 100 }, errors.descripcion && styles.inputError]}
        multiline
      />
      {errors.descripcion && <Text style={styles.error}>{errors.descripcion}</Text>}

      <Button title={loading ? 'Guardando...' : 'Guardar'} onPress={handleSave} disabled={loading} />
      <Button title="Cancelar" color="gray" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 15, paddingTop: 50 },
  title: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
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
});
