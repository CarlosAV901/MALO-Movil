import React, { createContext, useState, ReactNode } from "react";
import { loginService } from "@app/services/authServices";

interface AuthContextProps {
  isAuthenticated: boolean;
  login: (email: string, contrasena: string) => Promise<void>;
  isLoading: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  login: async () => {},
  isLoading: false,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (email: string, contrasena: string) => {
    setIsLoading(true);
    try {
      const data = await loginService(email, contrasena);
      setIsAuthenticated(true); 
    } catch (error) {
      throw new Error("Credenciales incorrectas");
    } finally {
      setIsLoading(false);
    }
  };
  const logout = () => {
    setIsAuthenticated(false);
  };
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
