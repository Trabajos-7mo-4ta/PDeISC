import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="basics" options={{ title: 'Básicos' }} />
      <Tabs.Screen name="interactives" options={{ title: 'Interactivos' }} />
      <Tabs.Screen name="lists" options={{ title: 'Listas' }} />
      <Tabs.Screen name="indicators" options={{ title: 'Indicadores' }} />
      <Tabs.Screen name="gestures" options={{ title: 'Gestos' }} />
    </Tabs>
  );
}
