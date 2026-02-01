'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Download, Eye, Clock, User, RefreshCw } from 'lucide-react';
import { getIpfsGatewayUrl } from '@/lib/pinata';
import { useWallet } from '@/lib/wallet-context';
import { UserProfile } from '@/components/user-profile';
import { AuditTrail, useAuditLog } from '@/components/audit-trail';
import { SearchFilters } from '@/components/search-filters';

interface SharedRecord {
  id: string;
  patientName?: string;
  patientAddress: string;
  recordName: string;
  type: string;
  date: string;
  ipfsHash: string;
  ownerAddress: string;
}

export function SimplifiedDoctorDashboard() {
  const { wallet } = useWallet();
  const { addLog } = useAuditLog();
  const [records, setRecords] = useState<SharedRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<SharedRecord[]>([]);
  const [viewingRecord, setViewingRecord] = useState<SharedRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'records' | 'profile' | 'audit'>('records');

  // Load shared records from localStorage
  useEffect(() => {
    if (!wallet?.address) return;

    loadRecords();
  }, [wallet?.address]);

  const loadRecords = () => {
    if (!wallet?.address) return;

    setLoading(true);
    console.log('[v0] Doctor address:', wallet.address);

    const allPatientRecords: SharedRecord[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('patient_records_')) {
        const patientAddress = key.replace('patient_records_', '');
        console.log('[v0] Checking patient:', patientAddress);

        try {
          const patientRecordsData = JSON.parse(localStorage.getItem(key) || '[]');
          const sharedRecords = patientRecordsData.filter(
            (record: any) => record.sharedWith?.includes(wallet.address)
          );

          console.log(
            `[v0] Found ${sharedRecords.length} records shared from ${patientAddress}`
          );

          allPatientRecords.push(
            ...sharedRecords.map((record: any) => ({
              id: record.id,
              patientName: `Patient ${patientAddress.substring(0, 6)}...`,
              patientAddress,
              recordName: record.name,
              type: record.type,
              date: record.date,
              ipfsHash: record.ipfsHash,
              ownerAddress: patientAddress,
            }))
          );
        } catch (err) {
          console.log('[v0] Error parsing patient records:', err);
        }
      }
    }

    setRecords(allPatientRecords);
    setFilteredRecords(allPatientRecords);
    setLoading(false);
  };

  const applyFilters = (query: string, type: string, startDate: string, endDate: string) => {
    let filtered = [...records];

    if (query) {
      filtered = filtered.filter(
        (r) =>
          r.recordName.toLowerCase().includes(query.toLowerCase()) ||
          r.type.toLowerCase().includes(query.toLowerCase()) ||
          r.patientAddress.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (type) {
      filtered = filtered.filter((r) => r.type === type);
    }

    if (startDate || endDate) {
      filtered = filtered.filter((r) => {
        const recordDate = new Date(r.date);
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();
        return recordDate >= start && recordDate <= end;
      });
    }

    setFilteredRecords(filtered);
  };

  const handleRefresh = () => {
    loadRecords();
  };

  const handleDownload = (record: SharedRecord) => {
    const ipfsUrl = getIpfsGatewayUrl(record.ipfsHash);
    addLog('download', `Downloaded ${record.recordName}`, {
      patient: record.patientAddress,
      record: record.recordName,
      hash: record.ipfsHash,
    });
    window.open(ipfsUrl, '_blank');
  };

  const handleViewRecord = (record: SharedRecord) => {
    addLog('view', `Viewed ${record.recordName}`, {
      patient: record.patientAddress,
      record: record.recordName,
    });
    setViewingRecord(record);
  };

  if (!wallet?.isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <Card className="p-8 text-center border-0 shadow-lg">
          <FileText className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Wallet</h2>
          <p className="text-gray-600">
            Please connect your MetaMask wallet to view patient records.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Patient Records</h1>
              <p className="text-gray-600">
                Viewing records shared with {wallet.address?.substring(0, 10)}...
              </p>
            </div>
            {activeTab === 'records' && (
              <Button
                onClick={handleRefresh}
                disabled={loading}
                className="gap-2 bg-transparent"
                variant="outline"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('records')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'records'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Records
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'audit'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Audit Trail
          </button>
        </div>

        {/* Content Sections */}
        {activeTab === 'records' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-6 border-0 shadow-md">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Patients Sharing Records</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {new Set(records.map((r) => r.patientAddress)).size}
                  </p>
                </div>
              </Card>

              <Card className="p-6 border-0 shadow-md">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Shared Records</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{records.length}</p>
                </div>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card className="p-6 border-0 shadow-md">
              <SearchFilters
                onSearch={(q) => applyFilters(q, '', '', '')}
                onFilterByType={(t) => applyFilters('', t, '', '')}
                onFilterByDate={(s, e) => applyFilters('', '', s, e)}
                recordTypes={Array.from(new Set(records.map((r) => r.type)))}
              />
            </Card>

            {/* Records List */}
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Shared With You ({filteredRecords.length})</h2>
              </div>

              {loading ? (
                <div className="p-12 text-center">
                  <RefreshCw className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
                  <p className="text-gray-600">Loading records...</p>
                </div>
              ) : records.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    No records shared with you yet. Patients can grant you access through their
                    dashboard.
                  </p>
                  <p className="text-sm text-gray-500">
                    Make sure to share your wallet address with patients so they can grant access.
                  </p>
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No records match your filters.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <div key={record.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Patient Info */}
                          <div className="mb-3">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="w-5 h-5 text-primary" />
                              <h3 className="font-semibold text-gray-900">{record.patientName}</h3>
                            </div>
                            <p className="text-xs text-gray-500 ml-7 font-mono">
                              {record.patientAddress}
                            </p>
                          </div>

                          {/* Record Info */}
                          <div className="flex items-center gap-3 mb-3 ml-7">
                            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                              <FileText className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{record.recordName}</p>
                              <p className="text-xs text-gray-600">{record.type}</p>
                            </div>
                          </div>

                          {/* Metadata */}
                          <div className="flex gap-6 text-xs text-gray-600 ml-7">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(record.date).toLocaleDateString()}
                            </div>
                            <div className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">
                              {record.ipfsHash.substring(0, 16)}...
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 ml-4">
                          <Button
                            onClick={() => handleViewRecord(record)}
                            variant="outline"
                            size="sm"
                            className="text-primary border-primary hover:bg-blue-50 gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                          <Button
                            onClick={() => handleDownload(record)}
                            variant="outline"
                            size="sm"
                            className="text-primary border-primary hover:bg-blue-50 gap-1 bg-transparent"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'profile' && <UserProfile role="doctor" />}

        {activeTab === 'audit' && <AuditTrail />}
      </div>
    </div>
  );
}
