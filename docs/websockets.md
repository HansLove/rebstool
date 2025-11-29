# WebSocket Integration Guide

This document explains how to integrate with the Affill platform's WebSocket notification system for real-time payment updates.

## Overview

The WebSocket system provides real-time notifications for payment events, allowing users to receive instant updates about their deposits and withdrawals without polling the API.

### 🎯 Smart Notification Behavior

**For Online Users:**

- Receive all payment notifications in real-time (`waiting` → `confirming` → `finished`)

**For Offline Users (Reconnection):**

- Only receive notifications for **completed payments** (`payment_finished`)
- No spam from intermediate steps that already passed

**Smart Read Marking:**

- Marking any notification as read automatically marks ALL notifications for that payment as read
- One action handles the entire payment flow

## Connection Setup

### 1. Socket.io Client Installation

```bash
npm install socket.io-client
```

### 2. Basic Connection

```javascript
import { io } from 'socket.io-client';

// Get the JWT token from your authentication system
const token = localStorage.getItem('authToken'); // or your preferred token storage

const socket = io('http://localhost:3001', {
  // Use your backend URL
  auth: {
    token: token,
  },
  transports: ['websocket', 'polling'],
  autoConnect: false,
});
```

### 3. Authentication

The WebSocket connection requires a valid JWT token for authentication. Include the token in the connection options:

**Option 1: Auth object (recommended)**

```javascript
const socket = io(SERVER_URL, {
  auth: {
    token: yourJwtToken,
  },
});
```

**Option 2: Authorization header**

```javascript
const socket = io(SERVER_URL, {
  extraHeaders: {
    Authorization: `Bearer ${yourJwtToken}`,
  },
});
```

## Connection Events

### Connection Established

```javascript
socket.on('connected', data => {
  console.log('Connected to notifications:', data);
  // data = { message: 'Successfully connected to payment notifications', userId: 123 }
});
```

### Connection Error

```javascript
socket.on('connect_error', error => {
  console.error('Connection failed:', error.message);
  // Handle authentication errors or connection issues
});
```

### Disconnect

```javascript
socket.on('disconnect', reason => {
  console.log('Disconnected:', reason);
  // Handle reconnection logic if needed
});
```

## Notification Events

### Real-time Notifications

```javascript
socket.on('notification', notification => {
  console.log('New notification:', notification);

  // Notification object structure:
  // {
  //   id: 123,                   // ✅ Database ID (always present)
  //   type: 'payment_waiting' | 'payment_confirming' | 'payment_finished',
  //   message: 'Your payment has been completed successfully',
  //   payment_id: 'payment_123456',
  //   transaction_hash: '0x...', // (optional, for confirmed payments)
  //   actually_paid: '100.50',   // (optional, for finished payments)
  //   timestamp: '2025-09-26T...'
  // }

  // Handle different notification types
  switch (notification.type) {
    case 'payment_waiting':
      showWaitingNotification(notification);
      break;
    case 'payment_confirming':
      showConfirmingNotification(notification);
      break;
    case 'payment_finished':
      showSuccessNotification(notification);
      break;
  }
});
```

### Pending Notifications (on connection)

```javascript
socket.on('pending_notifications', notifications => {
  console.log('Pending notifications:', notifications);

  // ✅ IMPORTANT: Only receives COMPLETED payment notifications
  // You won't receive waiting/confirming notifications when reconnecting
  // Only finished payments that occurred while you were offline
  notifications.forEach(notification => {
    if (notification.type === 'payment_finished') {
      displayCompletedPaymentNotification(notification);
    }
  });
});
```

## Client Actions

### Mark Notification as Read

```javascript
socket.emit('mark_notification_read', notificationId);

// ✅ SMART BEHAVIOR: This will automatically mark ALL notifications
// for the same payment as read, not just the one you clicked
// Example: If you mark a "payment_finished" notification as read,
// it will also mark the "payment_waiting" and "payment_confirming"
// notifications for that same payment as read
```

## Complete Integration Example

```javascript
import { io } from 'socket.io-client';

class NotificationService {
  constructor(token, serverUrl = 'http://localhost:3001') {
    this.socket = null;
    this.token = token;
    this.serverUrl = serverUrl;
    this.isConnected = false;
  }

  connect() {
    if (!this.token) {
      console.error('No auth token provided');
      return;
    }

    this.socket = io(this.serverUrl, {
      auth: {
        token: this.token,
      },
      transports: ['websocket', 'polling'],
    });

    this.setupEventListeners();
    this.socket.connect();
  }

  setupEventListeners() {
    // Connection events
    this.socket.on('connected', data => {
      console.log('✅ Connected to notifications:', data);
      this.isConnected = true;
      this.onConnected?.(data);
    });

    this.socket.on('connect_error', error => {
      console.error('❌ Connection error:', error.message);
      this.isConnected = false;
      this.onConnectionError?.(error);
    });

    this.socket.on('disconnect', reason => {
      console.log('👋 Disconnected:', reason);
      this.isConnected = false;
      this.onDisconnected?.(reason);
    });

    // Notification events
    this.socket.on('notification', notification => {
      console.log('📧 New notification:', notification);
      this.onNotification?.(notification);
    });

    this.socket.on('pending_notifications', notifications => {
      console.log('📥 Pending notifications:', notifications);
      this.onPendingNotifications?.(notifications);
    });
  }

  markAsRead(notificationId) {
    if (this.isConnected) {
      this.socket.emit('mark_notification_read', notificationId);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }

  // Callback setters
  onConnected = null;
  onConnectionError = null;
  onDisconnected = null;
  onNotification = null;
  onPendingNotifications = null;
}

// Usage
const notificationService = new NotificationService(userToken);

notificationService.onNotification = notification => {
  // Display notification in your UI
  showToast(notification.message, notification.type);
};

notificationService.onPendingNotifications = notifications => {
  // ✅ Handle only completed payment notifications
  // These are payments that finished while you were offline
  notifications.forEach(notif => {
    if (notif.type === 'payment_finished') {
      showToast(notif.message, notif.type);
      notificationService.markAsRead(notif.id); // This marks ALL notifications for this payment as read
    }
  });
};

notificationService.connect();
```

## React Hook Example

```javascript
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const useNotifications = token => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!token) return;

    const newSocket = io(process.env.REACT_APP_SERVER_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connected', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('notification', notification => {
      setNotifications(prev => [...prev, notification]);
    });

    newSocket.on('pending_notifications', pendingNotifications => {
      // Only add completed payment notifications
      const finishedPayments = pendingNotifications.filter(n => n.type === 'payment_finished');
      setNotifications(prev => [...prev, ...finishedPayments]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [token]);

  const markAsRead = notificationId => {
    if (socket) {
      socket.emit('mark_notification_read', notificationId);
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    }
  };

  return {
    socket,
    isConnected,
    notifications,
    markAsRead,
  };
};
```

## Notification Types

| Type                 | Description                           | When Triggered                                |
| -------------------- | ------------------------------------- | --------------------------------------------- |
| `payment_waiting`    | Payment received and being processed  | When payment is detected on the blockchain    |
| `payment_confirming` | Payment being confirmed on blockchain | When payment is getting confirmations         |
| `payment_finished`   | Payment completed successfully        | When payment is fully confirmed and processed |

## Error Handling

### Authentication Errors

- **Invalid token**: Check token validity and refresh if needed
- **User not found**: Token may be for a deleted user
- **Token expired**: Refresh the authentication token

### Connection Errors

- **Network issues**: Implement retry logic with backoff
- **Server unavailable**: Show offline indicator to user

## Best Practices

1. **Token Management**: Always check token validity before connecting
2. **Reconnection**: Implement automatic reconnection with exponential backoff
3. **Offline Handling**: Handle offline/online state gracefully
4. **UI Updates**: Update your UI immediately when receiving notifications
5. **Cleanup**: Always disconnect socket when component unmounts
6. **Error Handling**: Implement proper error handling for all socket events
7. **Smart Filtering**: When reconnecting, only process `payment_finished` notifications from `pending_notifications`
8. **Batch Read Marking**: Use the smart read marking to clear entire payment flows with one action

## Testing

### Local Development

```javascript
const socket = io('http://localhost:3001', {
  auth: { token: 'your-test-token' },
});
```

### Production

```javascript
const socket = io('https://your-production-domain.com', {
  auth: { token: 'your-production-token' },
});
```

## Security Notes

- Never expose JWT tokens in client-side code
- Use HTTPS in production
- Implement proper token refresh mechanisms
- Validate all incoming notifications on the client side
