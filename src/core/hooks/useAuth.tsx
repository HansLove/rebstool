/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';

// Definir la interfaz para AuthUser
interface AuthUserInterface {
  token:string | null;
  setToken: (user: any, token: string) => void;
  getToken: () => string | null;
  getUser: () => any;
  isLoggedIn: () => boolean;
  logout: () => void;
}

export default function useAuth(): AuthUserInterface {
  // const [token, setTokenState] = useState<string | null>(() => {
  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem('token'); // Inicializar el estado con el token almacenado
  });

  // Crear una instancia de axios

  // Guardar token y usuario en el almacenamiento (localStorage)
  const setToken = useCallback((user: any, token: string) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    setTokenState(token);
  }, []);

  // Obtener el token del almacenamiento
  const getToken = useCallback(() => {
    const storedToken = localStorage.getItem('token');
    return storedToken;
  }, []);

  const getUser = useCallback(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("❌ Failed to parse user from localStorage:", error);
      return null;
    }
  }, []);
  
  // Verificar si el usuario está loggeado
  const isLoggedIn = useCallback(() => {
    return getToken() !== null;
  }, [getToken]);

  // Cerrar sesión
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('accountsData');
    setTokenState(null);
    window.location.href ='/';
  }, []);

  // Retornamos todas las funciones y la instancia de Axios, con la tipificación completa
  return {
    token,
    setToken,
    getToken,
    isLoggedIn,
    logout,
    getUser
    // http, // Para solicitudes adicionales
  };
}
