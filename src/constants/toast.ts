// Configuraciones de tema para react-hot-toast

export const darkToastStyles = {
  style: {
    background: '#1a1b23',
    color: '#ffffff',
    border: '1px solid #2a2d3a',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
  success: {
    iconTheme: {
      primary: '#22c55e',
      secondary: '#1a1b23',
    },
  },
  error: {
    iconTheme: {
      primary: '#ef4444',
      secondary: '#1a1b23',
    },
  },
  loading: {
    iconTheme: {
      primary: '#3b82f6',
      secondary: '#1a1b23',
    },
  },
};

export const lightToastStyles = {
  style: {
    background: '#ffffff',
    color: '#1f2937',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  success: {
    iconTheme: {
      primary: '#059669',
      secondary: '#ffffff',
    },
  },
  error: {
    iconTheme: {
      primary: '#dc2626',
      secondary: '#ffffff',
    },
  },
  loading: {
    iconTheme: {
      primary: '#2563eb',
      secondary: '#ffffff',
    },
  },
};