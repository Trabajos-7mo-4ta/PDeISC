import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PublicRoutinesTrainerScreen from '../screens/PublicRoutinesTrainerScreen';
import RoutineDetailScreen from '../screens/RoutineDetailScreen';
import RoutineBuilderScreen from '../screens/RoutineBuilderScreen';

const Stack = createNativeStackNavigator();

export default function RoutinePublicStack({ route }: any) {
  const { user } = route.params;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="TrainerPublicRoutines"
        component={PublicRoutinesTrainerScreen}
        initialParams={{ user }}
      />
      <Stack.Screen
        name="RoutineDetail"
        component={RoutineDetailScreen}
        initialParams={{ user }}
      />
      <Stack.Screen
        name="RoutineBuilder"
        component={RoutineBuilderScreen}
        initialParams={{ user }}
      />
    </Stack.Navigator>
  );
}