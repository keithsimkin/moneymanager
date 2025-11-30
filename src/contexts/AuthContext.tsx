import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Storage keys
const STORAGE_KEY_USERS = 'moneymanager_users';
const STORAGE_KEY_SESSION = 'moneymanager_session';

// Simple hash function for password (in production, use proper hashing)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load session on mount
  useEffect(() => {
    const sessionData = localStorage.getItem(STORAGE_KEY_SESSION);
    if (sessionData) {
      try {
        const userData = JSON.parse(sessionData);
        setUser(userData);
      } catch (error) {
        console.error('Failed to load session:', error);
        localStorage.removeItem(STORAGE_KEY_SESSION);
      }
    }
    setIsLoaded(true);
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    // Validate inputs
    if (!email || !password || !name) {
      throw new Error('All fields are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Get existing users
    const usersData = localStorage.getItem(STORAGE_KEY_USERS);
    const users = usersData ? JSON.parse(usersData) : [];

    // Check if user already exists
    if (users.some((u: any) => u.email === email)) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create new user
    const newUser: User & { passwordHash: string } = {
      id: crypto.randomUUID(),
      email,
      name,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    // Save user
    users.push(newUser);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));

    // Create session
    const sessionUser: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt,
    };

    setUser(sessionUser);
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(sessionUser));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Validate inputs
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Get existing users
    const usersData = localStorage.getItem(STORAGE_KEY_USERS);
    const users = usersData ? JSON.parse(usersData) : [];

    // Hash password
    const passwordHash = await hashPassword(password);

    // Find user
    const foundUser = users.find(
      (u: any) => u.email === email && u.passwordHash === passwordHash
    );

    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    // Create session
    const sessionUser: User = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      createdAt: foundUser.createdAt,
    };

    setUser(sessionUser);
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(sessionUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_SESSION);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
