'use client';

import React, { useState } from 'react';
import { WalletButton } from '@/components/wallet-button';
import { PatientDashboard } from '@/components/patient-dashboard';
import { DoctorDashboard } from '@/components/doctor-dashboard';
import { SmartContractInterface } from '@/components/smart-contract-interface';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/lib/wallet-context';

type Role = 'home' | 'patient' | 'doctor' | 'contract';

export function HomePage() {
  const { wallet } = useWallet();
  const [currentRole, setCurrentRole] = useState<Role>('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600" />
              <h1 className="text-xl font-bold text-slate-900">DHR System</h1>
            </div>
            <WalletButton />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentRole === 'home' ? (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-slate-900">
                Decentralized Healthcare Records
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Secure, blockchain-based management of medical records using IPFS and smart contracts
              </p>
            </div>

            {wallet?.isConnected ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100">
                    <span className="text-2xl">👤</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Patient</h3>
                  <p className="text-slate-600">
                    Upload medical records to IPFS and control access for doctors
                  </p>
                  <Button
                    onClick={() => setCurrentRole('patient')}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Go to Patient Dashboard
                  </Button>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-100">
                    <span className="text-2xl">👨‍⚕️</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Doctor</h3>
                  <p className="text-slate-600">
                    Access patient records that have been shared with you
                  </p>
                  <Button
                    onClick={() => setCurrentRole('doctor')}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    Go to Doctor Dashboard
                  </Button>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100">
                    <span className="text-2xl">⛓️</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Contract</h3>
                  <p className="text-slate-600">
                    Interact directly with the smart contract
                  </p>
                  <Button
                    onClick={() => setCurrentRole('contract')}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Go to Contract Interface
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center space-y-4 max-w-md mx-auto">
                <p className="text-slate-600">
                  Connect your MetaMask wallet to get started
                </p>
                <div className="text-5xl">🔐</div>
              </div>
            )}

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl mb-2">🔒</div>
                <h3 className="font-bold text-slate-900">Secure Storage</h3>
                <p className="text-sm text-slate-600 mt-2">
                  Medical records stored on IPFS with immutable references on blockchain
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl mb-2">⛓️</div>
                <h3 className="font-bold text-slate-900">Smart Contracts</h3>
                <p className="text-sm text-slate-600 mt-2">
                  Blockchain-based access control with grant/revoke functionality
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl mb-2">🌐</div>
                <h3 className="font-bold text-slate-900">Decentralized</h3>
                <p className="text-sm text-slate-600 mt-2">
                  No central authority - complete patient control over their data
                </p>
              </div>
            </div>
          </div>
        ) : currentRole === 'patient' ? (
          <div>
            <Button
              variant="outline"
              onClick={() => setCurrentRole('home')}
              className="mb-6"
            >
              ← Back to Home
            </Button>
            <PatientDashboard />
          </div>
        ) : currentRole === 'doctor' ? (
          <div>
            <Button
              variant="outline"
              onClick={() => setCurrentRole('home')}
              className="mb-6"
            >
              ← Back to Home
            </Button>
            <DoctorDashboard />
          </div>
        ) : (
          <div>
            <Button
              variant="outline"
              onClick={() => setCurrentRole('home')}
              className="mb-6"
            >
              ← Back to Home
            </Button>
            <SmartContractInterface />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-600 text-sm">
            <p>Decentralized Healthcare Records System • Sepolia Testnet</p>
            <p className="mt-2">Powered by MetaMask, Pinata, and Ethereum Smart Contracts</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
