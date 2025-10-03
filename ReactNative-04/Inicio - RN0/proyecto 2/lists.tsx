import React from 'react';
import { View, Text, StyleSheet, FlatList, SectionList, ScrollView } from 'react-native';

const data = [{ key: 'Manzana' }, { key: 'Banana' }, { key: 'Cereza' }];

const sections = [
  { title: 'Frutas', data: ['Manzana', 'Banana', 'Cereza'] },
  { title: 'Verduras', data: ['Zanahoria', 'Lechuga', 'Tomate'] },
];

export default function ListsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Componentes de Listas</Text>

      <View style={styles.card}>
        <Text style={styles.title}>1️⃣ FlatList</Text>
        <Text style={styles.subtitle}>FlatList renderiza listas de manera eficiente.</Text>
        <FlatList
          data={data}
          renderItem={({ item }) => <Text style={styles.item}>{item.key}</Text>}
          keyExtractor={(item) => item.key}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>2️⃣ SectionList</Text>
        <Text style={styles.subtitle}>SectionList organiza listas por secciones.</Text>
        <SectionList
          sections={sections.map((s) => ({ title: s.title, data: s.data }))}
          renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
          renderSectionHeader={({ section }) => <Text style={styles.section}>{section.title}</Text>}
          keyExtractor={(item, index) => item + index}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center', backgroundColor: '#FFFDE7' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#FBC02D' },
  card: { backgroundColor: '#FFF59D', padding: 20, borderRadius: 15, marginBottom: 15, width: '100%' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 14, marginBottom: 5 },
  item: { padding: 5 },
  section: { padding: 5, fontWeight: 'bold', backgroundColor: '#FFF176' },
});
