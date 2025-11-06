import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RoutineStack from './RoutineStack';
import RoutinePublicStack from './RoutinePublicStack';
import PublicRoutinesScreen from '../screens/PublicRoutinesScreen';
import ProgressStackNavigator from './ProgressStackNavigator';
import ProfileScreen from '../screens/ProfileScreen';
import TrainerToolsStack from './TrainerToolsStack';
import UserManagementScreen from '../screens/UserManagementScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import { Ionicons } from '@expo/vector-icons';

export type UserTabsParamList = {
  MyRoutine: { user: any };
  PublicRoutines: { user: any };
  Progress: { user: any };
  CreateRoutine?: undefined;
  PublicRoutineEdit: { user: any };
  TrainerTools: { user: any };
  Profile: { user: any };
  UserManagement: { user: any };
  AdminDashboard: { user: any };
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
      {role === 'user' && (
        <>
          <Tab.Screen
            name="MyRoutine"
            component={RoutineStack}
            initialParams={{ user }}
            options={{
              title: 'Mis Rutinas',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="fitness-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="PublicRoutines"
            component={PublicRoutinesScreen}
            initialParams={{ user }}
            options={{
              title: 'Rutinas Públicas',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="globe-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Progress"
            children={() => <ProgressStackNavigator user={user} />}
            options={{
              title: 'Progreso',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="stats-chart-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            initialParams={{ user }}
            options={{
              title: 'Perfil',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-circle-outline" size={size} color={color} />
              ),
            }}
          />
        </>
      )}

      {role === 'entrenador' && (
        <>
          <Tab.Screen
            name="PublicRoutineEdit"
            component={RoutinePublicStack}
            initialParams={{ user }}
            options={{
              title: 'Rutinas Públicas',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="create-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="TrainerTools"
            component={TrainerToolsStack}
            initialParams={{ user }}
            options={{
              title: 'Catálogo',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="construct-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            initialParams={{ user }}
            options={{
              title: 'Perfil',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-circle-outline" size={size} color={color} />
              ),
            }}
          />
        </>
      )}

      {role === 'admin' && (
        <>
          <Tab.Screen
            name="UserManagement"
            component={UserManagementScreen}
            initialParams={{ user }}
            options={{
              title: 'Usuarios',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="people-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="AdminDashboard"
            component={AdminDashboardScreen}
            initialParams={{ user }}
            options={{
              title: 'Dashboard',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="analytics-outline" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            initialParams={{ user }}
            options={{
              title: 'Perfil',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-circle-outline" size={size} color={color} />
              ),
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
}
