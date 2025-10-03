import { View, Text, StyleSheet } from 'react-native';

export default function SecondScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>¡Hola Mundo 2!</Text>
        <Text style={styles.subtitle}>hola mundo con segundo style</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9', 
  },
  card: {
    backgroundColor: '#66BB6A', 
    padding: 25,
    borderRadius: 20,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#E8F5E9',
    textAlign: 'center',
  },
});