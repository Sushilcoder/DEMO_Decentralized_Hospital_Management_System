'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronRight, CheckCircle2, Clock, Lock, Share2, AlertCircle, Heart, Shield, Zap } from 'lucide-react';
import { useWallet } from '@/lib/wallet-context';

type StepType = 'welcome' | 'connect' | 'choose-role' | 'complete';

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState<StepType>('welcome');
  const { wallet, isLoading, error, connect } = useWallet();

  const handleConnectWallet = async () => {
    console.log('[v0] Attempting to connect wallet...');
    await connect();
  };

  // Auto-advance to choose-role when wallet is connected
  React.useEffect(() => {
    if (wallet?.isConnected && currentStep === 'connect') {
      console.log('[v0] Wallet connected, advancing to role selection');
      setCurrentStep('choose-role');
    }
  }, [wallet?.isConnected, currentStep]);

  const steps = [
    { id: 'welcome', label: 'Welcome', icon: '👋' },
    { id: 'connect', label: 'Connect Wallet', icon: '🔐' },
    { id: 'choose-role', label: 'Choose Role', icon: '👤' },
    { id: 'complete', label: 'Ready to Go', icon: '✓' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50">
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-gradient-to-br from-teal-200/20 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-200/20 to-transparent rounded-full translate-x-1/2 translate-y-1/2" />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex justify-between">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all font-bold ${
                      step.id === currentStep
                        ? 'bg-gradient-to-br from-teal-500 to-blue-500 ring-4 ring-teal-200 scale-110 shadow-lg'
                        : ['welcome', 'connect', 'choose-role', 'complete'].indexOf(step.id) < ['welcome', 'connect', 'choose-role', 'complete'].indexOf(currentStep)
                          ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                          : 'bg-gray-300'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <p className="text-xs mt-3 font-semibold text-gray-700">{step.label}</p>

                  {idx < steps.length - 1 && (
                    <div
                      className={`h-1.5 w-full mx-3 mt-5 rounded-full transition-all ${
                        ['welcome', 'connect', 'choose-role', 'complete'].indexOf(step.id) < ['welcome', 'connect', 'choose-role', 'complete'].indexOf(currentStep)
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content Cards */}
          <Card className="shadow-2xl border-0 overflow-hidden">
            <div className="relative min-h-96">
              {currentStep === 'welcome' && (
                <div className="p-8 md:p-12 space-y-8 animate-in fade-in duration-500">
                  <div className="text-center">
                    <div className="text-7xl mb-6 drop-shadow-lg">🏥</div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-4">
                      MediChain
                    </h1>
                    <p className="text-xl text-gray-600 max-w-xl mx-auto">
                      Your healthcare records, your control. Secured on the blockchain.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg border border-teal-100">
                      <Lock className="w-6 h-6 text-teal-600 mb-2" />
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">Secure</h3>
                      <p className="text-xs text-gray-600">Military-grade encryption</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                      <Share2 className="w-6 h-6 text-blue-600 mb-2" />
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">Control</h3>
                      <p className="text-xs text-gray-600">You decide who sees what</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-cyan-50 to-green-50 rounded-lg border border-cyan-100">
                      <Clock className="w-6 h-6 text-cyan-600 mb-2" />
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">Instant</h3>
                      <p className="text-xs text-gray-600">Share records instantly</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => setCurrentStep('connect')}
                    className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white py-6 text-lg font-semibold"
                    size="lg"
                  >
                    Get Started
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}

              {currentStep === 'connect' && (
                <div className="p-8 md:p-12 space-y-6 animate-in fade-in duration-500">
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">
                      Connect Your Wallet
                    </h2>
                    <p className="text-gray-600 text-lg">
                      MetaMask securely connects you to the blockchain
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex gap-3">
                      <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-900">Connection Error</p>
                        <p className="text-sm text-red-700 mt-1">{error}</p>
                      </div>
                    </div>
                  )}

                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-xl border-2 border-orange-200">
                    <div className="text-6xl mb-4">🦊</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">MetaMask</h3>
                    <p className="text-gray-700 mb-6">
                      The industry-standard wallet for accessing blockchain applications
                    </p>
                    <div className="bg-white p-5 rounded-lg text-sm text-gray-700 space-y-2">
                      <p className="font-bold text-gray-900 mb-3">Before connecting:</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-teal-600 font-bold">✓</span>
                          <span>Install MetaMask browser extension</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-teal-600 font-bold">✓</span>
                          <span>Create or import your wallet</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-teal-600 font-bold">✓</span>
                          <span>Switch to Sepolia testnet</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handleConnectWallet}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white py-6 text-lg font-semibold"
                      size="lg"
                    >
                      {isLoading ? 'Connecting...' : 'Connect MetaMask'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('welcome')}
                      className="w-full border-2 border-gray-300 py-6 text-lg font-semibold hover:bg-gray-50"
                      size="lg"
                      disabled={isLoading}
                    >
                      Back
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 text-center">
                    Don't have MetaMask? Download it at <span className="font-semibold">metamask.io</span>
                  </p>
                </div>
              )}

              {currentStep === 'choose-role' && (
                <div className="p-8 md:p-12 space-y-6 animate-in fade-in duration-500">
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">
                      What's Your Role?
                    </h2>
                    <p className="text-gray-600 text-lg">
                      This helps us customize your experience
                    </p>
                  </div>

                  {wallet?.isConnected && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 p-4 rounded-lg">
                      <p className="text-green-900 font-semibold">
                        ✓ Wallet Connected
                      </p>
                      <p className="text-xs font-mono text-green-800 mt-2">{wallet.address}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                      onClick={() => setCurrentStep('complete')}
                      className="group p-8 border-2 border-gray-200 rounded-lg hover:border-teal-400 hover:bg-gradient-to-br hover:from-teal-50 hover:to-blue-50 transition-all shadow-sm hover:shadow-lg"
                    >
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                        👤
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">Patient</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Upload, manage, and control access to your medical records
                      </p>
                      <div className="text-xs text-teal-600 font-semibold">
                        Choose this role →
                      </div>
                    </button>

                    <button
                      onClick={() => setCurrentStep('complete')}
                      className="group p-8 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 transition-all shadow-sm hover:shadow-lg"
                    >
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                        👨‍⚕️
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">Doctor</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Access patient records securely
                      </p>
                      <div className="text-xs text-blue-600 font-semibold">
                        Choose this role →
                      </div>
                    </button>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep('connect')}
                    className="w-full border-2 border-gray-300 py-6 text-lg font-semibold hover:bg-gray-50"
                    size="lg"
                  >
                    Back
                  </Button>
                </div>
              )}

              {currentStep === 'complete' && (
                <div className="p-8 md:p-12 space-y-8 text-center animate-in fade-in duration-500">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full blur-2xl opacity-30 animate-pulse" />
                      <CheckCircle2 className="w-24 h-24 text-gradient-to-r from-teal-600 to-blue-600 relative" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">
                      You're All Set!
                    </h2>
                    <p className="text-gray-600 text-lg">
                      Your account is ready. Let's explore MediChain
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-green-600 font-bold mb-1">✓</div>
                      <p className="text-xs font-semibold text-green-900">Wallet</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-green-600 font-bold mb-1">✓</div>
                      <p className="text-xs font-semibold text-green-900">Role</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-green-600 font-bold mb-1">✓</div>
                      <p className="text-xs font-semibold text-green-900">Ready</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-xl border-2 border-teal-200">
                    <p className="text-sm text-gray-700 mb-2">
                      Connected Account
                    </p>
                    <p className="text-xs font-mono font-bold text-teal-900 break-all">
                      {wallet?.address}
                    </p>
                  </div>

                  <p className="text-xs text-gray-500 pt-4">
                    Redirecting to dashboard...
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
