// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@taloon/nowpayments-components/styles';

import '@rainbow-me/rainbowkit/styles.css';

import { NowPaymentsProvider } from '@taloon/nowpayments-components';
// import App from './App.tsx'
import './index.css'
import App from './app/App';

createRoot(document.getElementById('root')!).render(
   <NowPaymentsProvider apiKey="6HWSMB8-2KH4AFP-KFXNNSF-NNQP9FT">
   <App/>
 </NowPaymentsProvider>
)
