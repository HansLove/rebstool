import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster, ToastBar, toast } from 'react-hot-toast';

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider, createStorage } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import AppRouter from './routes/AppRouter';
// import NotificationsManager from '../components/NotificationsManager';
import { darkToastStyles, lightToastStyles } from '@/constants/toast';
// import { UserBalanceProvider } from '@/context/UserBalanceProvider';

function App() {
  const projectId = import.meta.env.VITE_RAINBOWKIT_PROJECT_ID;

  if (!projectId) {
    throw new Error(
      'VITE_RAINBOWKIT_PROJECT_ID is missing. Create a WalletConnect Cloud project and set this env var (e.g., in front/.env.local). See: https://www.rainbowkit.com/docs/installation#configure'
    );
  }

  const config = getDefaultConfig({
    appName: 'Rebtools',
    chains: [mainnet, polygon, optimism, arbitrum, base],
    projectId,
    storage: createStorage({
      storage: localStorage,
    }),
  });

  const queryClient = new QueryClient();

  // State for dark mode
  const [isDarkMode, setIsDarkMode] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Listen for theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleThemeChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  // Toast styles based on theme
  const toastStyles = isDarkMode ? darkToastStyles : lightToastStyles;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
          <RainbowKitProvider modalSize="compact">
            <BrowserRouter>
              <Toaster
                position="top-right"
                toastOptions={toastStyles}
                containerStyle={{
                  top: 20,
                  right: 20,
                }}
              >
                {(t) => (
                  <ToastBar toast={t}>
                    {({ icon, message }) => (
                      <>
                        {icon}
                        {message}
                        {t.type !== 'loading' && (
                          <button
                            onClick={() => toast.dismiss(t.id)}
                            style={{
                              marginLeft: '8px',
                              background: 'transparent',
                              border: 'none',
                              fontSize: '18px',
                              cursor: 'pointer',
                              color: isDarkMode ? '#ffffff' : '#1f2937',
                              opacity: 0.7,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.opacity = '1';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = '0.7';
                            }}
                          >
                            ×
                          </button>
                        )}
                      </>
                    )}
                  </ToastBar>
                )}
              </Toaster>
              {/* <NotificationsManager isDarkMode={isDarkMode} /> */}
              <AppRouter />
            </BrowserRouter>
          </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
