import { create } from 'zustand';
import api from '../lib/api';

interface UserProfile {
  _id: string;
  alias: string;
  email: string;
  role: 'ADMIN' | 'USER';
  tokens: number;
  avatar: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  
  // Función de inicialización (se ejecuta una vez al arrancar la app)
  initialize: () => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Configuramos Axios para futuras peticiones
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        set({ user, isAuthenticated: true });
      } catch (e) {
        get().logout(); // Si falla el JSON, cerramos sesión
      }
    }
  },

  login: (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    set({ user: newUser, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    set({ user: null, isAuthenticated: false });
  },
}));