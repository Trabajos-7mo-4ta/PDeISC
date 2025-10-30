// navigation/UserTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RoutineStack from './RoutineStack';
import PublicRoutinesScreen from '../screens/PublicRoutinesScreen';
import ProgressScreen from '../screens/ProgressScreen';
import PublicRoutineEditScreen from '../screens/PublicRoutineEditScreen';
import { View, Text } from 'react-native';

// 🔹 Pantallas demo (placeholder)
function CreateRoutineScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
      <Text style={{ color: 'white' }}>📘 Crear nueva rutina pública (demo)</Text>
    </View>
  );
}

function ManageRoutinesScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
      <Text style={{ color: 'white' }}>🛠️ Gestionar rutinas públicas (demo)</Text>
    </View>
  );
}

function ManageUsersScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
      <Text style={{ color: 'white' }}>👥 Panel de usuarios (demo)</Text>
    </View>
  );
}

// 🔹 Tipos de navegación
export type UserTabsParamList = {
  MyRoutine?: undefined;
  PublicRoutines?: { user: any };
  Progress?: { user: any };
  CreateRoutine?: undefined;
  ManageRoutines?: undefined;
  ManageUsers?: undefined;
  PublicRoutineEdit?: { user: any };
};

const Tab = createBottomTabNavigator<UserTabsParamList>();

interface Props {
  route: { params: { user: any } };
}

export default function UserTabs({ route }: Props) {
  const { user } = route.params;
  const role = user.rol?.toLowerCase();

  const commonOptions = {
    headerShown: false,
    tabBarStyle: { backgroundColor: '#121212' },
    tabBarActiveTintColor: '#1e90ff',
    tabBarInactiveTintColor: '#ccc',
  };

  return (
    <Tab.Navigator screenOptions={commonOptions}>
      {/* 🔹 Usuario normal */}
      {role === 'user' && (
        <>
          <Tab.Screen
            name="MyRoutine"
            children={() => <RoutineStack user={user} />}
            options={{ title: 'Mis Rutinas' }}
          />
          <Tab.Screen
            name="PublicRoutines"
            component={PublicRoutinesScreen}
            initialParams={{ user }}
            options={{ title: 'Rutinas Públicas' }}
          />
          <Tab.Screen
            name="Progress"
            component={ProgressScreen}
            initialParams={{ user }}
            options={{ title: 'Progreso' }}
          />
        </>
      )}

      {/* 🔹 Entrenador */}
      {role === 'entrenador' && (
        <>
          <Tab.Screen
            name="PublicRoutines"
            component={PublicRoutinesScreen}
            initialParams={{ user }}
            options={{ title: 'Rutinas Públicas' }}
          />
          <Tab.Screen
            name="PublicRoutineEdit"
            component={PublicRoutineEditScreen}
            initialParams={{ user }}
            options={{ title: 'Editar Rutina' }}
          />
          <Tab.Screen
            name="CreateRoutine"
            component={CreateRoutineScreen}
            options={{ title: 'Crear Rutina' }}
          />
          <Tab.Screen
            name="ManageRoutines"
            component={ManageRoutinesScreen}
            options={{ title: 'Gestionar Rutinas' }}
          />
        </>
      )}

      {/* 🔹 Administrador */}
      {role === 'admin' && (
        <>
          <Tab.Screen
            name="ManageUsers"
            component={ManageUsersScreen}
            options={{ title: 'Usuarios' }}
          />
          <Tab.Screen
            name="PublicRoutines"
            component={PublicRoutinesScreen}
            initialParams={{ user }}
            options={{ title: 'Rutinas Públicas' }}
          />
          <Tab.Screen
            name="PublicRoutineEdit"
            component={PublicRoutineEditScreen}
            initialParams={{ user }}
            options={{ title: 'Editar Rutina' }}
          />
        </>
      )}
    </Tab.Navigator>
  );
}