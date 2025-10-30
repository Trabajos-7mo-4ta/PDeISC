
// screens/PublicRoutineEditScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert, ActivityIndicator } from 'react-native';
import {
  createRoutine,
  updateRoutine,
  deleteRoutine,
  getRoutineDetails,
  getExerciseCatalog,
  createDay,
  updateDay,
  deleteDay,
  createExercise,
  updateExercise,
  deleteExercise,
} from '../services/api';
import DayForm from '../components/DayForm';
import RoutineForm from '../components/RoutineForm';

// Interfaces
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

interface Routine {
  id?: number;
  titulo: string;
  descripcion: string;
  publica: boolean;
  actual: boolean;
  days?: Day[];
}

interface Props {
  route: any;
  navigation: any;
}

export default function PublicRoutineEditScreen({ route, navigation }: Props) {
  const { routineId, user } = route.params || {};
  const [routine, setRoutine] = useState<Routine>({
    titulo: '',
    descripcion: '',
    publica: true,
    actual: false,
    days: [],
  });
  const [catalog, setCatalog] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [isNewRoutine, setIsNewRoutine] = useState(!routineId);

  useEffect(() => {
    loadCatalog();
    if (routineId) {
      loadRoutine(routineId);
    }
  }, [routineId]);

  const loadCatalog = async () => {
    const res = await getExerciseCatalog();
    if (res.ok) {
      setCatalog(res.data);
    } else {
      console.log('❌ Error al cargar catálogo de ejercicios:', res.data);
    }
  };

  const loadRoutine = async (id: number) => {
    setLoading(true);
    const res = await getRoutineDetails(id);
    if (res.ok) {
      const { routine, days } = res.data;
      setRoutine({ ...routine, days });
      console.log('✅ Rutina cargada:', routine);
    } else {
      console.log('❌ Error al cargar rutina:', res.data);
      Alert.alert('Error', 'No se pudo cargar la rutina.');
      navigation.goBack();
    }
    setLoading(false);
  };

  const handleRoutineChange = (updatedRoutine: Partial<Routine>) => {
    setRoutine((prev) => ({ ...prev, ...updatedRoutine }));
  };

  // ✅ NUEVA LÓGICA DE GUARDADO UNIFICADO
  const handleSave = async () => {
    if (!routine.titulo || !routine.descripcion) {
      Alert.alert('Error', 'Completa el título y la descripción de la rutina.');
      return;
    }

    setLoading(true);
    try {
      // 1. Guardar o actualizar la rutina principal
      let routineRes;
      if (isNewRoutine) {
        routineRes = await createRoutine(user.id, routine.titulo, routine.descripcion, true, false);
        if (routineRes.ok) {
          // Si es nueva, actualizamos el estado con el ID devuelto
          const newRoutineId = routineRes.data.id;
          setRoutine((prev) => ({ ...prev, id: newRoutineId }));
          setIsNewRoutine(false); // Ya no es nueva
        }
      } else {
        routineRes = await updateRoutine(routine.id!, routine.titulo, routine.descripcion, true, routine.actual, user.id);
      }

      if (!routineRes.ok) {
        throw new Error(routineRes.data.error || 'No se pudo guardar la rutina.');
      }

      const savedRoutineId = routine.id || routineRes.data.id;

      // 2. Guardar o actualizar los días y sus ejercicios
      for (const day of routine.days || []) {
        let dayRes;
        if (day.id) {
          dayRes = await updateDay(day.id, day.nombre_dia, day.orden);
        } else {
          dayRes = await createDay(savedRoutineId, day.nombre_dia, day.orden);
        }

        if (!dayRes.ok) {
          throw new Error(dayRes.data.error || `No se pudo guardar el día "${day.nombre_dia}".`);
        }
        
        const savedDayId = day.id || dayRes.data.id;

        for (const exercise of day.exercises || []) {
          let exerciseRes;
          if (exercise.id) {
            exerciseRes = await updateExercise(exercise.id, exercise.catalogo_id, exercise.series, exercise.repeticiones);
          } else {
            exerciseRes = await createExercise(savedDayId, exercise.catalogo_id, exercise.series, exercise.repeticiones);
          }

          if (!exerciseRes.ok) {
            throw new Error(exerciseRes.data.error || `No se pudo guardar el ejercicio "${exercise.nombre_ejercicio}".`);
          }
        }
      }

      Alert.alert('Éxito', 'Rutina guardada correctamente.');
      // Recargamos para asegurar que todo el estado está sincronizado con la BD
      await loadRoutine(savedRoutineId);

    } catch (err: any) {
      Alert.alert('Error', err.message || 'Ocurrió un error inesperado.');
      console.log('❌ Error en handleSave:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoutine = () => {
    if (!routine.id) return;
    Alert.alert('Confirmar', '¿Seguro que deseas eliminar esta rutina?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          const res = await deleteRoutine(routine.id!);
          if (res.ok) {
            Alert.alert('Éxito', 'Rutina eliminada.');
            navigation.goBack();
          } else {
            Alert.alert('Error', res.data.error || 'No se pudo eliminar.');
          }
        },
      },
    ]);
  };

  const handleAddDay = () => {
    const newDay: Day = {
      nombre_dia: `Día ${(routine.days?.length || 0) + 1}`,
      orden: (routine.days?.length || 0) + 1,
      exercises: [],
    };
    setRoutine({ ...routine, days: [...(routine.days || []), newDay] });
  };

  const handleDeleteDay = (dayIndex: number) => {
    const day = routine.days![dayIndex];

    const performDelete = async () => {
      if (day.id) {
        const res = await deleteDay(day.id);
        if (!res.ok) {
          Alert.alert('Error', res.data.error || 'No se pudo eliminar el día de la base de datos.');
          return; // No continuar si falla la eliminación en BD
        }
      }
      // Eliminar del estado local
      const newDays = routine.days!.filter((_, i) => i !== dayIndex);
      setRoutine({ ...routine, days: newDays });
      Alert.alert('Éxito', 'Día eliminado.');
    };

    if (day.id) {
      Alert.alert('Confirmar', '¿Seguro que deseas eliminar este día y todos sus ejercicios?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: performDelete },
      ]);
    } else {
      // Si el día no está en la BD, solo se elimina del estado
      performDelete();
    }
  };

  if (loading && !routine.id) {
    return <ActivityIndicator size="large" color="#00ff00" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {isNewRoutine ? 'Nueva Rutina Pública' : 'Editar Rutina Pública'}
      </Text>

      <RoutineForm
        routine={routine}
        onChange={handleRoutineChange}
        onSave={handleSave} // ✅ Botón principal de guardado
        onDelete={handleDeleteRoutine}
        loading={loading}
      />

      <Text style={styles.sectionTitle}>Días de la Rutina</Text>

      {routine.days?.map((day, dayIndex) => (
        <View key={dayIndex} style={styles.dayContainer}>
          <DayForm
            day={day}
            catalog={catalog}
            onChange={(updatedDay) => {
              const newDays = [...(routine.days || [])];
              newDays[dayIndex] = updatedDay;
              setRoutine({ ...routine, days: newDays });
            }}
          />
          <Button
            title="Eliminar Día"
            onPress={() => handleDeleteDay(dayIndex)}
            color="#dc3545"
          />
        </View>
      ))}

      <Button
        title="Agregar Día"
        onPress={handleAddDay}
        disabled={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#121212' },
  title: { fontSize: 22, fontWeight: 'bold', color: 'white', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', marginVertical: 10 },
  dayContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
  },
});
