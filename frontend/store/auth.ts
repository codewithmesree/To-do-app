import { create } from 'zustand';
import Cookies from 'js-cookie';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    Cookies.set('jwt', token, { expires: 7 }); // expires in 7 days
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({ user, token });
  },
  logout: () => {
    Cookies.remove('jwt');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    set({ user: null, token: null });
  },
  initialize: () => {
    const token = Cookies.get('jwt');
    let user = null;
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          user = JSON.parse(userStr);
        } catch (e) {}
      }
    }
    if (token && user) {
      set({ token, user });
    }
  },
}));
