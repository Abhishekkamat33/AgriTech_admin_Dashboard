'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {jwtDecode} from 'jwt-decode'; 
import { useRouter, usePathname } from 'next/navigation'; // Import usePathname

interface AuthContextType {
  isAdmin: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

interface JwtPayload {
  roles?: string[] | string;
  // Add other expected JWT fields here if needed
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Use this to get current path

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      try {
        const payload: JwtPayload = jwtDecode(storedToken);
        const roles = Array.isArray(payload.roles) ? payload.roles : [payload.roles];
        setIsAdmin(roles.some((r) => r?.toLowerCase() === 'admin'));
      } catch {
        setToken(null);
        setIsAdmin(false);
      }
    }
  }, []);

  // Redirect admin users away from login/register pages
  useEffect(() => {
    if (isAdmin && (pathname === '/login' || pathname === '/register')) {
      router.replace('/');
    }
  }, [isAdmin, pathname, router]);

  const login = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    try {
      const payload : JwtPayload  = jwtDecode(newToken);
      const roles = Array.isArray(payload.roles) ? payload.roles : [payload.roles];
      setIsAdmin(roles.some((r) => r?.toLowerCase() === 'admin'));
    } catch {
      setIsAdmin(false);
    }
    router.replace('/');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setIsAdmin(false);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ token, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
