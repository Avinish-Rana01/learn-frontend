import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  User,
  LoginCredentials,
  RegisterData,
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getMe,
} from '../services/api/auth.service';
import { ApiClientError } from '../services/api/client';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  sessionAlert: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearSessionAlert: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionAlert, setSessionAlert] = useState<string | null>(null);

  const clearSessionAlert = useCallback(() => {
    setSessionAlert(null);
  }, []);

  // Check initial authentication state
  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const currentUser = await getMe();
        if (isMounted) {
          setUser(currentUser);
        }
      } catch (error) {
        if (isMounted) {
          if (
            error instanceof ApiClientError &&
            error.code === 'SESSION_INVALIDATED_BY_NEW_LOGIN'
          ) {
            setSessionAlert(
              'Your session ended because your account was signed in on another device.'
            );
          }
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setSessionAlert(null);
    const loggedInUser = await apiLogin(credentials);
    setUser(loggedInUser);
  };

  const register = async (data: RegisterData) => {
    setSessionAlert(null);
    await apiRegister(data);
    // Auto-login after successful registration
    const loggedInUser = await apiLogin({ email: data.email, password: data.password });
    setUser(loggedInUser);
  };

  const logout = async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        sessionAlert,
        login,
        register,
        logout,
        clearSessionAlert,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
