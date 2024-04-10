// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { authService } from '../../api/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;  // ユーザー情報の型を適宜定義
  login: (user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null); // ユーザー情報の初期値を設定
  
    const login = (newUser: any) => {
      setUser(newUser);
    };
  
    const logout = () => {
      setUser(null);
    };
  
    // refreshTokenメソッドの削除
  
    return (
      <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
