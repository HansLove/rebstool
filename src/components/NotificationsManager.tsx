import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import useAuth from '../core/hooks/useAuth';
import { darkToastStyles, lightToastStyles } from '@/constants/toast';
import useUserBalance from '@/core/hooks/useUserBalance';

// Función para determinar URL del servidor (FUERA del componente)
const getServerUrl = (): string => {
  const isProd = import.meta.env.VITE_PROD_MODE === '1';
  return isProd ? import.meta.env.VITE_SERVER_URL_MAINNET : import.meta.env.VITE_SERVER_URL_TESTNET;
};

// Interface para notificaciones (FUERA del componente)
interface Notification {
  id: number;
  type: 'payment_waiting' | 'payment_confirming' | 'payment_finished';
  message: string;
  payment_id: string;
  transaction_hash?: string;
  actually_paid?: string;
  timestamp: string;
}

// Función para mostrar notificaciones según tipo (FUERA del componente)
const showNotification = (notification: Notification, isDarkMode: boolean) => {
  const { type, message, payment_id } = notification;

  // Seleccionar estilos basado en el tema
  const styles = isDarkMode ? darkToastStyles : lightToastStyles;

  console.log({ notification });

  switch (type) {
    case 'payment_waiting':
      toast.loading(message, {
        id: payment_id,
        style: styles.style,
        iconTheme: styles.loading.iconTheme,
        duration: 5000, // No auto-dismiss for loading states
      });
      break;

    case 'payment_confirming':
      toast.loading(message, {
        id: payment_id,
        style: styles.style,
        iconTheme: styles.loading.iconTheme,
        duration: 5000, // No auto-dismiss for loading states
      });
      break;

    case 'payment_finished':
      toast.success(message, {
        id: payment_id,
        duration: 6000, // Auto-dismiss after 6 seconds
        style: styles.style,
        iconTheme: styles.success.iconTheme,
      });
      break;

    default:
      toast(message, {
        style: styles.style,
        duration: 4000, // Auto-dismiss after 4 seconds
      });
  }
};

// Interface para props del componente
interface NotificationsManagerProps {
  isDarkMode: boolean;
}

// Componente NotificationsManager
const NotificationsManager: React.FC<NotificationsManagerProps> = ({ isDarkMode }) => {
  // Hook de autenticación
  const { getToken, isLoggedIn } = useAuth();
  const { refreshBalance } = useUserBalance();

  // Ref para evitar recrear el useEffect cuando el socket cambia
  const socketRef = useRef<Socket | null>(null);

  // Effect para manejar conexion/desconexion basado en autenticacion
  useEffect(() => {
    const token = getToken();
    const userLoggedIn = isLoggedIn();

    // Si el usuario está autenticado y no hay socket activo
    if (userLoggedIn && token && !socketRef.current) {
      console.log('🔐 User authenticated, initializing WebSocket connection...');

      const serverUrl = getServerUrl();
      const newSocket = io(serverUrl, {
        auth: {
          token: token,
        },
        transports: ['websocket', 'polling'],
        autoConnect: false,
      });

      // Setup event listeners
      newSocket.on('connect', () => {
        console.log('✅ Connected to notifications server:', newSocket.id);
        if (newSocket.recovered) {
          console.log('🔄 Connection recovered, missed events received');
        }
      });

      newSocket.on('connected', data => {
        console.log('📡 Server confirmation:', data);
      });

      newSocket.on('notification', (notification: Notification) => {
        console.log('📧 New notification:', notification);
        if (notification.type === 'payment_finished') {
          refreshBalance().then(() => {
            showNotification(notification, isDarkMode);
          });
          return;
        }
        showNotification(notification, isDarkMode);
      });

      newSocket.on('pending_notifications', (notifications: Notification[]) => {
        console.log('📥 Pending notifications:', notifications);
        const finishedPayments = notifications.filter(n => n.type === 'payment_finished');
        finishedPayments.forEach(notification => {
          showNotification(notification, isDarkMode);
          if (newSocket.connected) {
            newSocket.emit('mark_notification_read', notification.id);
          }
        });
      });

      newSocket.on('connect_error', error => {
        console.error('❌ Connection error:', error.message);
        if (error.message === 'invalid credentials') {
          console.error('🔑 Invalid JWT token, please re-authenticate');
          toast.error('Authentication failed. Please log in again.');
        }
      });

      newSocket.on('disconnect', reason => {
        console.log('👋 Disconnected:', reason);
      });

      socketRef.current = newSocket;
      newSocket.connect();
    }
    // Si el usuario no está autenticado y hay socket activo
    else if (!userLoggedIn && socketRef.current) {
      console.log('🚫 User not authenticated, disconnecting WebSocket...');
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, [getToken, isLoggedIn, isDarkMode, refreshBalance]);

  // Cleanup cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        console.log('🧹 Component unmounting, cleaning up WebSocket...');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Component does not render anything
  return null;
};

export default NotificationsManager;
