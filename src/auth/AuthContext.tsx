import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { ACCESS_TOKEN_KEY } from '../api/http';
import type { UserSummary } from '../types/api';
import {
  getCurrentUser,
  login as loginRequest,
  register as registerRequest,
  type LoginRequest,
  type RegisterRequest,
} from './authApi';

interface AuthContextValue {
  user: UserSummary | null;
  loading: boolean;
  authenticated: boolean;
  login: (request: LoginRequest) => Promise<UserSummary>;
  register: (request: RegisterRequest) => Promise<UserSummary>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    getCurrentUser()
      .then(setUser)
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [logout]);

  useEffect(() => {
    const handler = () => logout();
    window.addEventListener('auth:unauthorized', handler);
    return () => window.removeEventListener('auth:unauthorized', handler);
  }, [logout]);

  const login = useCallback(async (request: LoginRequest) => {
    const response = await loginRequest(request);
    localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
    setUser(response.user);
    return response.user;
  }, []);

  const register = useCallback(async (request: RegisterRequest) => {
    const response = await registerRequest(request);
    localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
    setUser(response.user);
    return response.user;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      authenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
