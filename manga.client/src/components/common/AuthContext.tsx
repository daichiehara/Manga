// AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>(null!);

export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (token: string) => {
    // Set the token in HTTPOnly cookie (to be handled in backend)
    // Here we just simulate the login
    setIsAuthenticated(true);
    // Other login logic here
  };

  const logout = () => {
    // Clear the token from HTTPOnly cookie (to be handled in backend)
    // Here we just simulate the logout
    setIsAuthenticated(false);
    // Other logout logic here
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
