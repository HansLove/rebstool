import axios from 'axios';
import { BACKEND_URL } from './GlobalVars';

export const http = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json', // Default Content-Type
  },
});

// Interceptor de solicitud para añadir el token de autenticación
http.interceptors.request.use(
  config => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      config.headers.Authorization = `Bearer ${storedToken}`;
    }
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  error => {
    console.error('Request interceptor error:', error); // Registrar errores de solicitud
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar errores de autenticación
http.interceptors.response.use(
  response => response,
  error => {
    console.trace('Response interceptor error captured:', error); // Asegúrate de que se registra cualquier error

    if (error.response) {
      // Comprueba si existe error.response
      console.log('Error response status:', error.response.status);
      if (error.response.status === 401) {
        console.error('Token expirado o no autorizado.');
        // Limpiar el almacenamiento local
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('accountsData');
        // Redirigir al usuario
        window.location.href = '/';
      }
    } else {
      // Si no hay error.response, registrar el error completo
      console.error('Unhandled error:', error);
    }
    return Promise.reject(error);
  }
);
