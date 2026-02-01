'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWallet } from '@/lib/wallet-context';
import { getIpfsGatewayUrl } from '@/lib/pinata';
import { Loader2, AlertCircle, CheckCircle, Download, Eye } from 'lucide-react';

interface AccessibleRecord {
  ipfsHash: string;
  fileName: string;
  patientAddress: string;
  grantedAt: number;
}

export function DoctorDashboard() {
  const { wallet } = useWallet();
  const [patientAddress, setPatientAddress] = useState('');
  const [accessibleRecords, setAccessibleRecords] = useState<AccessibleRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewingHash, setViewingHash] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFetchRecords = async () => {
    if (!patientAddress) {
      setActionMessage({ type: 'error', text: 'Please enter patient address' });
      return;
    }

    setIsLoading(true);
    try {
      // In a real implementation, this would query the blockchain for accessible records
      // For now, we'll show a demo message
      setActionMessage({
        type: 'success',
        text: 'Records query submitted. Check blockchain events for results.',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch records';
      setActionMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
      setTimeout(() => setActionMessage(null), 5000);
    }
  };

  const handleViewRecord = (ipfsHash: string) => {
    setViewingHash(ipfsHash);
  };

  const handleDownloadRecord = (ipfsHash: string, fileName: string) => {
    const url = getIpfsGatewayUrl(ipfsHash);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!wallet?.isConnected) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please connect your wallet to access the doctor dashboard
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
        <p className="text-slate-600 mt-2">Wallet: {wallet.address}</p>
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

      <Card>
        <CardHeader>
          <CardTitle>Access Patient Records</CardTitle>
          <CardDescription>View medical records shared with you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Patient's Ethereum Address</label>
            <Input
              type="text"
              placeholder="0x..."
              value={patientAddress}
              onChange={e => setPatientAddress(e.target.value)}
              className="mt-2"
            />
          </div>

          <Button
            onClick={handleFetchRecords}
            disabled={isLoading || !patientAddress}
            className="w-full gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Fetching Records...
              </>
            ) : (
              'Fetch Patient Records'
            )}
          </Button>
        </CardContent>
      </Card>

      {accessibleRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Accessible Records</CardTitle>
            <CardDescription>{accessibleRecords.length} records available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accessibleRecords.map(record => (
                <div
                  key={record.ipfsHash}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{record.fileName}</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Granted: {new Date(record.grantedAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 break-all">
                      Hash: {record.ipfsHash.slice(0, 16)}...
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewRecord(record.ipfsHash)}
                      className="gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadRecord(record.ipfsHash, record.fileName)}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {viewingHash && (
        <Card>
          <CardHeader>
            <CardTitle>Preview Record</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-100 p-4 rounded-lg text-center text-slate-600">
              <p className="text-sm">
                View content at:{' '}
                <a
                  href={getIpfsGatewayUrl(viewingHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  IPFS Gateway
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
