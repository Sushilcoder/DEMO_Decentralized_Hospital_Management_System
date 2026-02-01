'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { connectWallet, WalletConnection } from '@/lib/web3';

interface WalletContextType {
  wallet: WalletConnection | null;
  isLoading: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('[v0] Connecting wallet...');
      const connection = await connectWallet();
      console.log('[v0] Wallet connected:', connection.address);
      setWallet(connection);
      localStorage.setItem('wallet_connected', 'true');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      console.log('[v0] Wallet connection error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    console.log('[v0] Disconnecting wallet');
    setWallet(null);
    localStorage.removeItem('wallet_connected');
    setError(null);
  };

  const disconnectWallet = disconnect;

  // Auto-connect if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      const wasConnected = localStorage.getItem('wallet_connected');
      if (wasConnected && !wallet) {
        try {
          console.log('[v0] Auto-connecting wallet...');
          await connect();
        } catch (err) {
          console.log('[v0] Auto-connect failed, user can manually connect');
        }
      }
    };

    autoConnect();
  }, []);

  return (
    <WalletContext.Provider value={{ wallet, isLoading, error, connect, disconnect, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}
