import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyRoutineScreen from '../screens/MyRoutineScreen';
import RoutineDetailScreen from '../screens/RoutineDetailScreen';

// Estas pantallas son para roles más avanzados (pueden ser placeholders por ahora)
import PublicRoutineEditScreen from '../screens/PublicRoutineEditScreen';
import ManageUsersScreen from '../screens/ManageUsersScreen';

const Stack = createNativeStackNavigator();

interface Props {
  user: any;
}

export default function RoutineStack({ user }: Props) {
  const role =  user?.rol || 'user'; // compatibilidad con ambos nombres

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Pantallas comunes a todos los usuarios */}
      <Stack.Screen
        name="MyRoutine"
        component={MyRoutineScreen as any}
        initialParams={{ user }}
      />
      <Stack.Screen
        name="RoutineDetail"
        component={RoutineDetailScreen as any}
        initialParams={{ user }}
      />

      {/* Pantallas exclusivas para entrenadores */}
      {role === 'entrenador' && (
        <Stack.Screen
          name="PublicRoutineEdit"
          component={PublicRoutineEditScreen as any}
          initialParams={{ user }}
        />
      )}

      {/* Pantallas exclusivas para administradores */}
      {role === 'admin' && (
        <>
          <Stack.Screen
            name="PublicRoutineEdit"
            component={PublicRoutineEditScreen as any}
            initialParams={{ user }}
          />
          <Stack.Screen
            name="ManageUsers"
            component={ManageUsersScreen as any}
            initialParams={{ user }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}