import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import "@solana/wallet-adapter-react-ui/styles.css";


import { WalletContextProvider } from './components/wallet/WalletContextProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <WalletContextProvider>
    <App />
  </WalletContextProvider>
)
