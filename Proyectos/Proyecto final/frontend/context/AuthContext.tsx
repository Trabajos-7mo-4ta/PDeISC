// context/AuthContext.tsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: string;
  token: string;
};

type AuthContextType = {
  user: User | null;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  handleAuthError: (error: any) => void;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  handleAuthError: () => {},
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Cargar usuario almacenado al iniciar la app
  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('user');
        if (stored) setUser(JSON.parse(stored));
      } catch (error) {
        console.error('Error al cargar usuario guardado:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredUser();
  }, []);

  // ✅ Login con persistencia en AsyncStorage
  const login = useCallback(async (userData: User) => {
    try {
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    }
  }, []);

  // ✅ Logout que borra datos locales
  const logout = useCallback(async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }, []);

  // ✅ Manejo de errores comunes de token expirado o sesión inválida
  const handleAuthError = useCallback(
    (error: any) => {
      if (error?.response?.status === 401 || error?.message?.includes('Token')) {
        console.warn('Sesión expirada. Cerrando sesión automáticamente.');
        logout();
      }
    },
    [logout]
  );

  return (
    <AuthContext.Provider value={{ user, login, logout, handleAuthError, loading }}>
      {children}
    </AuthContext.Provider>
  );
};