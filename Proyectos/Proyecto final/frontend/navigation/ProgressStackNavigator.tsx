import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProgressScreen from '../screens/ProgressScreen';
import ProgressEntryScreen from '../screens/ProgressEntryScreen';
import ProgressDetailScreen from '../screens/ProgressDetailScreen';

const ProgressStack = createNativeStackNavigator();

function ProgressStackNavigator({ user }: { user: any }) {
  return (
    <ProgressStack.Navigator screenOptions={{ headerShown: false }}>
      <ProgressStack.Screen
        name="ProgressMain"
        component={ProgressScreen as any}
        initialParams={{ user }}
      />
      <ProgressStack.Screen
        name="ProgressEntry"
        component={ProgressEntryScreen as any}
        initialParams={{ user }}
      />
      <ProgressStack.Screen
        name="ProgressDetail"
        component={ProgressDetailScreen as any}
        initialParams={{ user }}
      />
    </ProgressStack.Navigator>
  );
}

export default ProgressStackNavigator;