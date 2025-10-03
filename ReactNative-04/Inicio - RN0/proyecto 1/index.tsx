import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>¡Hola Mundo 1!</Text>
        <Text style={styles.subtitle}>Hola mundo con primer style.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5E1', 
  },
  card: {
    backgroundColor: '#FFB74D',
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
    color: '#FFFDE7',
    textAlign: 'center',
  },
});