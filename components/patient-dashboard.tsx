'use client';

import React, { useState } from 'react';
import { FileUpload } from './file-upload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWallet } from '@/lib/wallet-context';
import { getProvider, getSigner, getContractInstance, grantAccess } from '@/lib/web3';
import { Loader2, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

interface HealthRecord {
  id: string;
  ipfsHash: string;
  fileName: string;
  uploadedAt: number;
  accessedBy: string[];
}

export function PatientDashboard() {
  const { wallet } = useWallet();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [doctorAddress, setDoctorAddress] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [isGranting, setIsGranting] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUploadComplete = (ipfsHash: string, fileName: string) => {
    const newRecord: HealthRecord = {
      id: `${Date.now()}`,
      ipfsHash,
      fileName,
      uploadedAt: Date.now(),
      accessedBy: [],
    };
    setRecords([newRecord, ...records]);
    setActionMessage({ type: 'success', text: `${fileName} uploaded successfully!` });
    setTimeout(() => setActionMessage(null), 5000);
  };

  const handleGrantAccess = async () => {
    if (!wallet?.isConnected || !selectedRecord || !doctorAddress) {
      setActionMessage({ type: 'error', text: 'Please connect wallet and fill all fields' });
      return;
    }

    setIsGranting(true);
    try {
      const provider = getProvider();
      const signer = await getSigner(provider);
      const contract = getContractInstance(signer, process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!);

      const record = records.find(r => r.id === selectedRecord);
      if (!record) throw new Error('Record not found');

      await grantAccess(contract, doctorAddress, record.ipfsHash);

      // Update record with granted access
      setRecords(records.map(r =>
        r.id === selectedRecord
          ? { ...r, accessedBy: [...new Set([...r.accessedBy, doctorAddress])] }
          : r
      ));

      setActionMessage({ type: 'success', text: `Access granted to ${doctorAddress}` });
      setDoctorAddress('');
      setSelectedRecord(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to grant access';
      setActionMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsGranting(false);
      setTimeout(() => setActionMessage(null), 5000);
    }
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
  };

  if (!wallet?.isConnected) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please connect your wallet to access the patient dashboard
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Patient Dashboard</h1>
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

      <FileUpload onUploadComplete={handleUploadComplete} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Grant Access to Doctor</CardTitle>
            <CardDescription>Allow a doctor to view your medical records</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select Record</label>
              <select
                value={selectedRecord || ''}
                onChange={e => setSelectedRecord(e.target.value)}
                className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a record...</option>
                {records.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.fileName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Doctor's Ethereum Address</label>
              <Input
                type="text"
                placeholder="0x..."
                value={doctorAddress}
                onChange={e => setDoctorAddress(e.target.value)}
                className="mt-2"
              />
            </div>

            <Button
              onClick={handleGrantAccess}
              disabled={isGranting || !selectedRecord || !doctorAddress}
              className="w-full gap-2"
            >
              {isGranting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Granting Access...
                </>
              ) : (
                'Grant Access'
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Medical Records</CardTitle>
            <CardDescription>{records.length} records uploaded</CardDescription>
          </CardHeader>
          <CardContent>
            {records.length === 0 ? (
              <p className="text-slate-500 text-sm">No records uploaded yet</p>
            ) : (
              <div className="space-y-3">
                {records.map(record => (
                  <div
                    key={record.id}
                    className="flex items-start justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{record.fileName}</p>
                      <p className="text-xs text-slate-600 mt-1">
                        Uploaded: {new Date(record.uploadedAt).toLocaleDateString()}
                      </p>
                      {record.accessedBy.length > 0 && (
                        <p className="text-xs text-green-600 mt-1">
                          Shared with {record.accessedBy.length} doctor(s)
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRecord(record.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
