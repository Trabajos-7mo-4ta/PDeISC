import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  getAllUsers,
  deleteUser,
  updateUserRole
} from '../services/api';

const roles = [
  { label: 'Usuario', value: 'user' },
  { label: 'Entrenador', value: 'entrenador' },
  { label: 'Administrador', value: 'admin' },
];

export default function UserManagementScreen({ route }: any) {
  const { user } = route.params;
  const [users, setUsers] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      loadUsers();
    }, [])
  );

  const loadUsers = async () => {
    const res = await getAllUsers();
    if (res.ok) setUsers(res.data);
    else setUsers([]);
  };

  const filtered = users.filter((u) =>
    filter ? u.rol === filter : true
  );

  const handleChangeRole = async (newRole: string) => {
    const res = await updateUserRole(selectedUser.id, newRole);
    if (res.ok) {
      setRoleModalVisible(false);
      setSelectedUser(null);
      await loadUsers();
    }
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    const res = await deleteUser(confirmDeleteId);
    if (res.ok) await loadUsers();
    setConfirmDeleteId(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Usuarios</Text>

      <View style={styles.filterRow}>
        {roles.map(({ label, value }) => (
            <TouchableOpacity
            key={value}
            style={[
                styles.filterButton,
                filter === value && styles.filterActive,
            ]}
            onPress={() => setFilter(filter === value ? '' : value)}
            >
            <Text style={styles.buttonText}>{label}</Text>
            </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.nombre}</Text>
            <Text style={styles.email}>{item.email}</Text>
            <Text style={styles.role}>Rol: {item.rol}</Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  setSelectedUser(item);
                  setRoleModalVisible(true);
                }}
              >
                <Text style={styles.buttonText}>Cambiar rol</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => setConfirmDeleteId(item.id)}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal para cambiar rol */}
      <Modal visible={roleModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Cambiar rol de {selectedUser?.nombre}</Text>
            <View style={styles.modalButtons}>
                {roles.map(({ label, value }) => (
                <TouchableOpacity
                    key={value}
                    style={styles.roleButton}
                    onPress={() => handleChangeRole(value)}
                >
                    <Text style={styles.buttonText}>{label}</Text>
                </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                setRoleModalVisible(false);
                setSelectedUser(null);
                }}
            >
                <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            </View>
        </View>
      </Modal>


      {/* Modal para confirmar eliminación */}
      <Modal visible={!!confirmDeleteId} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>¿Eliminar este usuario?</Text>
            <Text style={styles.modalText}>Esta acción no se puede deshacer.</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setConfirmDeleteId(null)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmDeleteButton}
                onPress={confirmDelete}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 15, paddingTop: 50 },
  title: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  filterRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  filterButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
  },
  filterActive: { backgroundColor: '#ff7f00' },
  card: { backgroundColor: '#1e1e1e', padding: 15, borderRadius: 10, marginBottom: 10 },
  name: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  email: { color: '#ccc' },
  role: { color: '#aaa', marginBottom: 10 },
  buttonRow: { flexDirection: 'row', gap: 10, justifyContent: 'space-between' },
  editButton: {
    backgroundColor: '#00b894',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#d63031',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  modalText: { color: '#ccc', fontSize: 14, marginBottom: 20, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 10 },
  roleButton: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#555',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmDeleteButton: {
    backgroundColor: '#d63031',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  }
  ,
});
