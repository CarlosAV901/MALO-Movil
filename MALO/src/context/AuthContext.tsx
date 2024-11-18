import React, { createContext, useState, ReactNode } from "react";
import { loginService } from "@app/services/authServices";
import { decode as base64Decode } from 'base-64';
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

// Validar formato del JWT
const isValidJWT = (token: string) => token && token.split('.').length === 3;

const decodeToken = (token: string) => {
  if (!isValidJWT(token)) throw new Error("El token no tiene un formato válido");

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = typeof atob !== 'undefined' ? atob(base64) : base64Decode(base64);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Error al decodificar el token:", error.message);
    throw new Error("Error al decodificar el token. Verifica que sea un JWT válido.");
  }
};




// Validar los campos requeridos en el token decodificado
const validateDecodedToken = (decodedToken: any) => {
  const requiredFields = ['sub', 'email', 'rol', 'exp'];
  requiredFields.forEach((field) => {
    if (!decodedToken[field]) {
      throw new Error(`El campo '${field}' falta en el token`);
    }
  });
};
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null); // Inicialmente null

  const login = async (email: string, contrasena: string, isEmpresa: boolean) => {
    setIsLoading(true);
    try {
      const apiUrl = isEmpresa
        ? "https://malo-backend-empresas.onrender.com"
        : "https://malo-backend.onrender.com";
  
      // Llamar al servicio de autenticación
      const data = await loginService(email, contrasena, apiUrl);
      const { token } = data;
  
      // Decodificar y validar el token
      const decodedToken = decodeToken(token);
      validateDecodedToken(decodedToken);
  
      // Asignar el usuario autenticado
      setUser({
        email: decodedToken.email,
        rol: decodedToken.rol,
        id: decodedToken.sub,
        token,
      });
  
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error durante el login:", error.message);
      throw new Error("Credenciales incorrectas o token inválido");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, isLoading, logout,}}>
      {children}
    </AuthContext.Provider>
  );
};


