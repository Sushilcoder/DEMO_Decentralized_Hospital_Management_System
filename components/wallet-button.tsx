'use client';

import React from 'react';
import { useWallet } from '@/lib/wallet-context';
import { Button } from '@/components/ui/button';
import { Wallet, Check, AlertCircle } from 'lucide-react';

export function WalletButton() {
  const { wallet, isLoading, error, connect, disconnect } = useWallet();

  return (
    <div className="flex items-center gap-4">
      {error && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {wallet?.isConnected ? (
        <div className="flex items-center gap-3 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
          <Check className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-900 font-mono">
            {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
          </span>
          <Button
            onClick={disconnect}
            variant="outline"
            size="sm"
            className="ml-2 border-green-300 text-green-700 hover:bg-green-100 bg-transparent"
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          onClick={connect}
          disabled={isLoading}
          className="gap-2 bg-primary hover:bg-primary/90 text-white"
        >
          <Wallet className="w-4 h-4" />
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      )}
    </div>
  );
}
