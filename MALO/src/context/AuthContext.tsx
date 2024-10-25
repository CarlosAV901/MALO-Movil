import React, { createContext, useState, ReactNode } from "react";
import { loginService } from "@app/services/authServices";

// Modificamos el contexto para incluir 'user'
interface User {
  email: string;
  rol: string;
  id: string;
  token: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null; // Cambiamos esto para incluir el usuario
  login: (email: string, contrasena: string, isEmpresa: boolean) => Promise<void>;
  isLoading: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null, // Cambiamos esto a null inicialmente
  login: async () => {},
  isLoading: false,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null); // Inicialmente null

  const login = async (email: string, contrasena: string, isEmpresa: boolean) => {
    setIsLoading(true);
    try {
      const apiUrl = isEmpresa ? "https://malo-backend-empresas.onrender.com" : "https://malo-backend.onrender.com";
      const data = await loginService(email, contrasena, apiUrl);
      
      // Suponiendo que el token contiene la información que necesitas
      const { token } = data;
      
      // Decodificar el token (suponiendo que usas JWT y tienes un método para decodificarlo)
      const decodedToken = decodeToken(token); // Necesitarás implementar esta función o usar una librería como jwt-decode

      setUser({
        email: decodedToken.email,
        rol: decodedToken.rol,
        id: decodedToken.sub,
        token: token,
      });
      setIsAuthenticated(true); 
    } catch (error) {
      throw new Error("Credenciales incorrectas");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null); // Limpiamos el usuario al cerrar sesión
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Implementación de decodeToken (ejemplo)
const decodeToken = (token: string) => {
  const payload = token.split('.')[1];
  return JSON.parse(atob(payload)); // Esto funciona solo si el token está en base64
};
