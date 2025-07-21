import React, { createContext, useContext, useState, useEffect } from 'react';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  // Initialize state from localStorage to persist connection across page loads
  const [isConnected, setIsConnected] = useState(() => localStorage.getItem('solanaWalletConnected') === 'true');
  const [publicKey, setPublicKey] = useState(() => localStorage.getItem('solanaWalletPublicKey'));

  // This function simulates connecting a wallet and now saves the state.
  const connect = () => {
    const dummyPublicKey = "So1a...8a7b"; 
    setPublicKey(dummyPublicKey);
    setIsConnected(true);
    // Persist the connection state in localStorage
    localStorage.setItem('solanaWalletConnected', 'true');
    localStorage.setItem('solanaWalletPublicKey', dummyPublicKey);
  };

  // This function disconnects and clears the saved state.
  const disconnect = () => {
    setPublicKey(null);
    setIsConnected(false);
    // Remove the connection state from localStorage
    localStorage.removeItem('solanaWalletConnected');
    localStorage.removeItem('solanaWalletPublicKey');
  };

  const value = {
    publicKey,
    isConnected,
    connect,
    disconnect,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};