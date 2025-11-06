import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExerciseCatalogScreen from '../screens/ExerciseCatalogScreen';
import ExerciseEditorScreen from '../screens/ExerciseEditorScreen';

const Stack = createNativeStackNavigator();

export default function TrainerToolsStack({ route }: any) {
  const { user } = route.params;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ExerciseCatalog"
        component={ExerciseCatalogScreen}
        initialParams={{ user }}
      />
      <Stack.Screen
        name="ExerciseEditor"
        component={ExerciseEditorScreen}
        initialParams={{ user }}
      />
    </Stack.Navigator>
  );
}