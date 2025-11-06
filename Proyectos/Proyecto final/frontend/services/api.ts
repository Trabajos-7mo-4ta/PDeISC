// services/api.ts
const API_URL = 'https://backendplangym-production.up.railway.app/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🧩 Función auxiliar: agrega automáticamente el token a cada request
async function fetchWithAuth(url: string, options: any = {}) {
  const userString = await AsyncStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const token = user?.token;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const res = await fetch(url, { ...options, headers });

    // Si la respuesta no es JSON válido (por ejemplo, error HTML del servidor)
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text || 'Respuesta no válida del servidor' };
    }

    // Si el token es inválido o expiró, lo eliminamos del almacenamiento
    if (res.status === 401 || res.status === 403) {
      await AsyncStorage.removeItem('token');
      console.warn('⚠️ Token inválido o expirado. Eliminado del almacenamiento.');
    }

    return { ok: res.ok, data };
  } catch (error) {
    console.error('Error en fetchWithAuth:', error);
    return { ok: false, data: { error: 'Error de conexión con el servidor' } };
  }
}

// ========================================
// 🔹 AUTENTICACIÓN
// ========================================

export async function registerUser(nombre: string, email: string, password: string, rol: string) {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password, rol }),
    });
    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error) {
    console.error('Error en registerUser:', error);
    return { ok: false, data: { error: 'Error de conexión con el servidor' } };
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error) {
    console.error('Error en loginUser:', error);
    return { ok: false, data: { error: 'Error de conexión con el servidor' } };
  }
}

// ========================================
// 🔹 RUTINAS
// ========================================

export async function getUserRoutines(usuario_id: number) {
  return await fetchWithAuth(`${API_URL}/routines/user/${usuario_id}`);
}

export async function getPublicRoutines() {
  try {
    const res = await fetch(`${API_URL}/routines/public`);
    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error) {
    console.error('Error en getPublicRoutines:', error);
    return { ok: false, data: [] };
  }
}

export async function getCurrentRoutine(usuario_id: number) {
  return await fetchWithAuth(`${API_URL}/routines/actual/${usuario_id}`);
}

export async function setRoutineAsCurrent(routineId: number, usuario_id: number) {
  return await fetchWithAuth(`${API_URL}/routines/${routineId}/actual`, {
    method: 'PUT',
    body: JSON.stringify({ usuario_id }),
  });
}

export async function getRoutineDetails(routineId: number) {
  return await fetchWithAuth(`${API_URL}/routines/${routineId}/details`);
}

export async function createRoutine(
  usuario_id: number,
  titulo: string,
  descripcion: string,
  publica: boolean = false,
  actual: boolean = false
) {
  return await fetchWithAuth(`${API_URL}/routines`, {
    method: 'POST',
    body: JSON.stringify({ usuario_id, titulo, descripcion, publica, actual }),
  });
}

export async function updateRoutine(
  id: number,
  titulo: string,
  descripcion: string,
  publica: boolean,
  actual = false,
  usuario_id?: number
) {
  return await fetchWithAuth(`${API_URL}/routines/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ titulo, descripcion, publica, actual, usuario_id }),
  });
}

export async function deleteRoutine(id: number) {
  return await fetchWithAuth(`${API_URL}/routines/${id}`, { method: 'DELETE' });
}

// ========================================
// 🔹 DÍAS
// ========================================

export async function getDaysByRoutine(rutina_id: number) {
  return await fetchWithAuth(`${API_URL}/days/${rutina_id}`);
}

export async function createDay(rutina_id: number, nombre_dia: string, orden: number) {
  return await fetchWithAuth(`${API_URL}/days`, {
    method: 'POST',
    body: JSON.stringify({ rutina_id, nombre_dia, orden }),
  });
}

export async function updateDay(id: number, nombre_dia: string, orden: number) {
  return await fetchWithAuth(`${API_URL}/days/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ nombre_dia, orden }),
  });
}

export async function deleteDay(id: number) {
  return await fetchWithAuth(`${API_URL}/days/${id}`, { method: 'DELETE' });
}

// ========================================
// 🔹 EJERCICIOS
// ========================================

export async function getExercisesByDay(dia_id: number) {
  return await fetchWithAuth(`${API_URL}/exercises/${dia_id}`);
}

export async function createExercise(
  dia_id: number,
  catalogo_id: number,
  series: number,
  repeticiones: number
) {
  return await fetchWithAuth(`${API_URL}/exercises`, {
    method: 'POST',
    body: JSON.stringify({ dia_id, catalogo_id, series, repeticiones }),
  });
}

export async function updateExercise(
  id: number,
  catalogo_id: number,
  series: number,
  repeticiones: number
) {
  return await fetchWithAuth(`${API_URL}/exercises/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ catalogo_id, series, repeticiones }),
  });
}

export async function deleteExercise(id: number) {
  return await fetchWithAuth(`${API_URL}/exercises/${id}`, { method: 'DELETE' });
}

// ========================================
// 🔹 CATÁLOGO DE EJERCICIOS
// ========================================

export async function getExerciseCatalog() {
  return await fetchWithAuth(`${API_URL}/exercise-catalog`);
}

export async function createCatalogExercise(
  nombre_ejercicio: string,
  grupo_muscular: string,
  descripcion: string
) {
  return await fetchWithAuth(`${API_URL}/exercise-catalog`, {
    method: 'POST',
    body: JSON.stringify({ nombre_ejercicio, grupo_muscular, descripcion }),
  });
}

export async function deleteCatalogExercise(id: number) {
  return await fetchWithAuth(`${API_URL}/exercise-catalog/${id}`, { method: 'DELETE' });
}

// ========================================
// 🔹 PROGRESO
// ========================================

export async function getProgressByUser(usuario_id: number) {
  return await fetchWithAuth(`${API_URL}/progress/${usuario_id}`);
}

export async function createProgress(
  usuario_id: number,
  rutina_id: number,
  semana: number | string,
  descripcion: string
) {
  console.log('Enviando progreso:', {
  usuario_id,
  rutina_id,
  semana: parseInt(semana as string, 10),
  descripcion,
  });
  return await fetchWithAuth(`${API_URL}/progress`, {
    method: 'POST',
    body: JSON.stringify({
      usuario_id,
      rutina_id,
      semana: parseInt(semana as string, 10),
      descripcion,
    }),
  });
}

export async function deleteProgress(id: number) {
  return await fetchWithAuth(`${API_URL}/progress/${id}`, { method: 'DELETE' });
}

export async function createExerciseProgress(
  progress_id: number,
  ejercicio_id: number,
  peso: number,
  repeticiones: number,
  series: number,
  fecha: string
) {
  return await fetchWithAuth(`${API_URL}/exercise-progress`, {
    method: 'POST',
    body: JSON.stringify({
      progress_id,
      ejercicio_id,
      peso,
      repeticiones,
      series,
      fecha,
    }),
  });
}

export async function getExerciseProgressByUser(usuario_id: number) {
  return await fetchWithAuth(`${API_URL}/exercise-progress/${usuario_id}`);
}

export async function copyRoutine(routineId: number, usuario_id: number) {
  return await fetchWithAuth(`${API_URL}/routines/${routineId}/copiar`, {
    method: 'POST',
    body: JSON.stringify({ usuario_id }),
  });
}

export async function updateCatalogExercise(
  id: number,
  nombre_ejercicio: string,
  grupo_muscular: string,
  descripcion: string
) {
  return await fetchWithAuth(`${API_URL}/exercise-catalog/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ nombre_ejercicio, grupo_muscular, descripcion }),
  });
}

export async function getAllUsers() {
  return await fetchWithAuth(`${API_URL}/users`);
}

export async function deleteUser(id: number) {
  return await fetchWithAuth(`${API_URL}/users/${id}`, { method: 'DELETE' });
}

export async function updateUserRole(id: number, rol: string) {
  return await fetchWithAuth(`${API_URL}/users/${id}/rol`, {
    method: 'PUT',
    body: JSON.stringify({ rol }),
  });
}

export const loginWithGoogle = async (nombre: string, email: string, googleId: string) => {
  try {
    const res = await fetch('https://backendplangym-production.up.railway.app/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, googleId }),
    });

    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error) {
    console.error('Error en loginWithGoogle:', error);
    return { ok: false, data: { error: 'Error de conexión con el servidor.' } };
  }
};