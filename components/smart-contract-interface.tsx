'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWallet } from '@/lib/wallet-context';
import { getProvider, getSigner, getContractInstance, DHR_CONTRACT_ABI } from '@/lib/web3';
import { Loader2, AlertCircle, CheckCircle, Copy } from 'lucide-react';

interface ContractInfo {
  address: string;
  abi: string;
  network: string;
  status: 'connected' | 'disconnected' | 'loading';
}

export function SmartContractInterface() {
  const { wallet } = useWallet();
  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
  const [patientAddress, setPatientAddress] = useState('');
  const [doctorAddress, setDoctorAddress] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [accessCount, setAccessCount] = useState<number | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (wallet?.isConnected && process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
      setContractInfo({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        abi: JSON.stringify(DHR_CONTRACT_ABI),
        network: wallet.network,
        status: 'connected',
      });
    }
  }, [wallet]);

  const checkAccessCount = async () => {
    if (!ipfsHash) {
      setActionMessage({ type: 'error', text: 'Please enter IPFS hash' });
      return;
    }

    setIsLoading(true);
    try {
      const provider = getProvider();
      const signer = await getSigner(provider);
      const contract = getContractInstance(signer, process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!);

      const count = await contract.getAccessCount(ipfsHash);
      setAccessCount(Number(count));
      setActionMessage({ type: 'success', text: `Access count: ${count}` });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to check access count';
      setActionMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
      setTimeout(() => setActionMessage(null), 5000);
    }
  };

  const checkAccess = async () => {
    if (!patientAddress || !doctorAddress || !ipfsHash) {
      setActionMessage({ type: 'error', text: 'Please fill all fields' });
      return;
    }

    setIsLoading(true);
    try {
      const provider = getProvider();
      const signer = await getSigner(provider);
      const contract = getContractInstance(signer, process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!);

      const access = await contract.hasAccess(patientAddress, doctorAddress, ipfsHash);
      setHasAccess(access);
      setActionMessage({
        type: 'success',
        text: access ? 'Doctor has access to this record' : 'Doctor does not have access',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to check access';
      setActionMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
      setTimeout(() => setActionMessage(null), 5000);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setActionMessage({ type: 'success', text: 'Copied to clipboard!' });
    setTimeout(() => setActionMessage(null), 2000);
  };

  if (!wallet?.isConnected) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please connect your wallet to interact with smart contracts
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Smart Contract Interface</h2>
        <p className="text-slate-600 mt-1">Interact directly with the DHR smart contract</p>
      </div>

      {actionMessage && (
        <Alert variant={actionMessage.type === 'success' ? 'default' : 'destructive'}>
          {actionMessage.type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{actionMessage.text}</AlertDescription>
        </Alert>
      )}

      {contractInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Contract Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Contract Address</label>
              <div className="flex items-center gap-2 mt-2">
                <code className="flex-1 bg-slate-100 p-3 rounded text-sm break-all font-mono">
                  {contractInfo.address}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(contractInfo.address)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Network</label>
              <p className="mt-2 text-sm capitalize">{contractInfo.network}</p>
            </div>

            <div>
              <label className="text-sm font-medium">ABI</label>
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-blue-600">
                  View ABI
                </summary>
                <pre className="mt-2 bg-slate-100 p-3 rounded text-xs overflow-auto max-h-48">
                  {contractInfo.abi}
                </pre>
              </details>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Check Access Count</CardTitle>
          <CardDescription>
            Query how many doctors have access to a specific record
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">IPFS Hash</label>
            <Input
              type="text"
              placeholder="QmX..."
              value={ipfsHash}
              onChange={e => setIpfsHash(e.target.value)}
              className="mt-2"
            />
          </div>

          <Button
            onClick={checkAccessCount}
            disabled={isLoading || !ipfsHash}
            className="w-full gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Checking...
              </>
            ) : (
              'Check Access Count'
            )}
          </Button>

          {accessCount !== null && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Access Count:</strong> {accessCount} doctor(s) have access
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Check Access Permission</CardTitle>
          <CardDescription>
            Verify if a doctor has access to a patient's record
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Patient Address</label>
            <Input
              type="text"
              placeholder="0x..."
              value={patientAddress}
              onChange={e => setPatientAddress(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Doctor Address</label>
            <Input
              type="text"
              placeholder="0x..."
              value={doctorAddress}
              onChange={e => setDoctorAddress(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">IPFS Hash</label>
            <Input
              type="text"
              placeholder="QmX..."
              value={ipfsHash}
              onChange={e => setIpfsHash(e.target.value)}
              className="mt-2"
            />
          </div>

          <Button
            onClick={checkAccess}
            disabled={isLoading || !patientAddress || !doctorAddress || !ipfsHash}
            className="w-full gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Checking...
              </>
            ) : (
              'Check Access'
            )}
          </Button>

          {hasAccess !== null && (
            <div
              className={`p-3 rounded-lg ${
                hasAccess
                  ? 'bg-green-50'
                  : 'bg-red-50'
              }`}
            >
              <p
                className={`text-sm ${
                  hasAccess
                    ? 'text-green-900'
                    : 'text-red-900'
                }`}
              >
                <strong>Result:</strong> {hasAccess ? 'Doctor HAS access' : 'Doctor does NOT have access'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contract Methods</CardTitle>
          <CardDescription>Available functions on the DHR contract</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                name: 'grantAccess',
                params: '(address _doctor, string _ipfsHash)',
                description: 'Grant doctor access to a medical record',
              },
              {
                name: 'revokeAccess',
                params: '(address _doctor, string _ipfsHash)',
                description: 'Revoke doctor access from a medical record',
              },
              {
                name: 'hasAccess',
                params: '(address _patient, address _doctor, string _ipfsHash)',
                description: 'Check if doctor has access to patient record',
              },
              {
                name: 'getAccessCount',
                params: '(string _ipfsHash)',
                description: 'Get number of doctors with access to record',
              },
            ].map(method => (
              <div key={method.name} className="p-3 bg-slate-50 rounded-lg">
                <code className="font-mono text-sm font-medium">{method.name}</code>
                <p className="text-xs text-slate-600 mt-1 font-mono">{method.params}</p>
                <p className="text-sm text-slate-700 mt-2">{method.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
