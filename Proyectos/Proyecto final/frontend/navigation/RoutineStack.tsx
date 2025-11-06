import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyRoutineScreen from '../screens/MyRoutineScreen';
import RoutineDetailScreen from '../screens/RoutineDetailScreen';
import RoutineBuilderScreen from '../screens/RoutineBuilderScreen';
import ProgressDetailScreen from '../screens/ProgressDetailScreen';


const Stack = createNativeStackNavigator();


export default function RoutineStack({ route }: any) {
  const { user } = route.params;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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
      <Stack.Screen
        name="RoutineBuilder"
        component={RoutineBuilderScreen as any}
        initialParams={{ user }}
      />
      <Stack.Screen
        name="ProgressDetail"
        component={ProgressDetailScreen as any}
        initialParams={{ user }}
      />

    </Stack.Navigator>
  );
}