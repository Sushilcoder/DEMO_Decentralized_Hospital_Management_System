'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileUp, Users, FileText, Lock, Trash2, Plus, Eye, Download } from 'lucide-react';
import { uploadFileToPinata, getIpfsGatewayUrl, downloadFileFromIPFS } from '@/lib/pinata';
import { useWallet } from '@/lib/wallet-context';
import { UserProfile } from '@/components/user-profile';
import { AuditTrail, useAuditLog } from '@/components/audit-trail';
import { SearchFilters } from '@/components/search-filters';

interface Record {
  id: string;
  name: string;
  type: string;
  date: string;
  ipfsHash: string;
  sharedWith: string[];
  file?: File;
}

interface AccessRequest {
  doctorAddress: string;
  recordId: string;
}

export function SimplifiedPatientDashboard() {
  const { wallet } = useWallet();
  const { addLog } = useAuditLog();
  const [records, setRecords] = useState<Record[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<Record[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showViewerModal, setShowViewerModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [doctorAddress, setDoctorAddress] = useState<string>('');

  // Upload form state
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [recordNames, setRecordNames] = useState<string[]>([]);
  const [recordTypes, setRecordTypes] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadingFileName, setUploadingFileName] = useState<string>('');

  // Load records from localStorage
  useEffect(() => {
    if (!wallet?.address) return;
    const patientRecords = localStorage.getItem(`patient_records_${wallet.address}`);
    if (patientRecords) {
      const parsed = JSON.parse(patientRecords);
      setRecords(parsed);
      setFilteredRecords(parsed);
    }
  }, [wallet?.address]);

  // Save records to localStorage
  useEffect(() => {
    if (wallet?.address && records.length > 0) {
      localStorage.setItem(`patient_records_${wallet.address}`, JSON.stringify(records));
    }
  }, [records, wallet?.address]);

  const applyFilters = (query: string, type: string, startDate: string, endDate: string) => {
    let filtered = [...records];

    if (query) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.type.toLowerCase().includes(query.toLowerCase())
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

  const handleFileUpload = async () => {
    if (uploadedFiles.length === 0 || recordNames.length === 0 || !wallet?.address) {
      setError('Please add at least one file with a name');
      return;
    }

    if (uploadedFiles.length !== recordNames.length) {
      setError('Each file must have a name');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);
    setUploadProgress(0);

    try {
      console.log('[v0] Starting batch upload of', uploadedFiles.length, 'files to Pinata...');
      addLog('upload', `Starting batch upload of ${uploadedFiles.length} files...`, {}, 'pending');

      const ipfsHashes: string[] = [];

      // Upload files sequentially to show progress
      for (let idx = 0; idx < uploadedFiles.length; idx++) {
        const file = uploadedFiles[idx];
        setUploadingFileName(recordNames[idx]);
        setUploadProgress(Math.round((idx / uploadedFiles.length) * 100));

        console.log('[v0] Uploading file', idx + 1, 'of', uploadedFiles.length, ':', file.name);
        const hash = await uploadFileToPinata(file);
        ipfsHashes.push(hash);

        setUploadProgress(Math.round(((idx + 1) / uploadedFiles.length) * 100));
      }

      console.log('[v0] All files uploaded successfully');

      const newRecords: Record[] = ipfsHashes.map((hash, idx) => ({
        id: Date.now().toString() + idx,
        name: recordNames[idx],
        type: recordTypes[idx] || 'Lab Results',
        date: new Date().toISOString().split('T')[0],
        ipfsHash: hash,
        sharedWith: [],
        file: uploadedFiles[idx],
      }));

      setRecords([...records, ...newRecords]);
      setSuccess(`${newRecords.length} record(s) uploaded successfully!`);
      addLog('upload', `Uploaded ${newRecords.length} file(s)`, {
        count: newRecords.length,
        hashes: ipfsHashes,
        sizes: uploadedFiles.map(f => `${(f.size / 1024).toFixed(1)} KB`),
      });

      setUploadedFiles([]);
      setRecordNames([]);
      setRecordTypes([]);
      setUploadProgress(0);
      setUploadingFileName('');
      setTimeout(() => {
        setShowUploadModal(false);
        setSuccess(null);
      }, 1500);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Upload failed';
      console.log('[v0] Batch upload error:', errorMsg);
      setError(errorMsg);
      addLog('upload', 'Batch file upload failed', { error: errorMsg }, 'failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setUploadingFileName('');
    }
  };

  const handleAddFile = (newFile: File) => {
    if (uploadedFiles.some(f => f.name === newFile.name)) {
      setError('File already added');
      return;
    }
    setUploadedFiles([...uploadedFiles, newFile]);
    setRecordNames([...recordNames, '']);
    setRecordTypes([...recordTypes, 'Lab Results']);
    setError(null);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
    setRecordNames(recordNames.filter((_, i) => i !== index));
    setRecordTypes(recordTypes.filter((_, i) => i !== index));
  };

  const handleUpdateFileName = (index: number, name: string) => {
    const newNames = [...recordNames];
    newNames[index] = name;
    setRecordNames(newNames);
  };

  const handleUpdateFileType = (index: number, type: string) => {
    const newTypes = [...recordTypes];
    newTypes[index] = type;
    setRecordTypes(newTypes);
  };

  const handleGrantAccess = (record: Record) => {
    if (!doctorAddress || !doctorAddress.startsWith('0x')) {
      setError('Please enter a valid Ethereum address (0x...)');
      return;
    }

    setRecords(
      records.map((r) =>
        r.id === record.id
          ? { ...r, sharedWith: [...r.sharedWith, doctorAddress] }
          : r
      )
    );

    setSuccess(`Access granted to ${doctorAddress.substring(0, 6)}...`);
    addLog('grant_access', `Granted access to ${record.name}`, {
      doctor: doctorAddress,
      record: record.name,
    });

    setDoctorAddress('');
    setTimeout(() => {
      setShowAccessModal(false);
      setSuccess(null);
    }, 1500);
  };

  const handleRevokeAccess = (recordId: string, doctorAddress: string) => {
    const record = records.find((r) => r.id === recordId);
    setRecords(
      records.map((r) =>
        r.id === recordId
          ? {
              ...r,
              sharedWith: r.sharedWith.filter((addr) => addr !== doctorAddress),
            }
          : r
      )
    );
    setSuccess(`Access revoked from ${doctorAddress.substring(0, 6)}...`);
    addLog('revoke_access', `Revoked access from ${record?.name || 'record'}`, {
      doctor: doctorAddress,
    });

    setTimeout(() => setSuccess(null), 1500);
  };

  const handleDownloadRecord = async (record: Record) => {
    try {
      console.log('[v0] Downloading record:', record.name);
      setUploading(true);
      await downloadFileFromIPFS(record.ipfsHash, record.name);

      addLog('download', `Downloaded record: ${record.name}`, {
        recordName: record.name,
        ipfsHash: record.ipfsHash,
      });
      setSuccess('Record downloaded successfully!');
      setTimeout(() => setSuccess(null), 1500);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to download record';
      console.log('[v0] Download error:', errorMsg);
      setError(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteRecord = (recordId: string) => {
    const record = records.find((r) => r.id === recordId);
    setRecords(records.filter((r) => r.id !== recordId));
    setSuccess('Record deleted');
    addLog('upload', `Deleted ${record?.name || 'record'}`, {
      id: recordId,
    });

    setTimeout(() => setSuccess(null), 1500);
  };

  if (!wallet?.isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <Card className="p-8 text-center border-0 shadow-lg">
          <Lock className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Wallet</h2>
          <p className="text-gray-600">
            Please connect your MetaMask wallet to access the patient dashboard.
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Medical Records</h1>
              <p className="text-gray-600">Secure. Private. Under Your Control.</p>
            </div>
            <Button
              onClick={() => setShowUploadModal(true)}
              className="bg-primary hover:bg-primary/90 text-white gap-2"
              size="lg"
            >
              <Plus className="w-5 h-5" />
              Upload Record
            </Button>
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            ✓ {success}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 border-0 shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Records</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{records.length}</p>
              </div>
              <FileText className="w-10 h-10 text-primary/20" />
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Doctors With Access</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {new Set(records.flatMap((r) => r.sharedWith)).size}
                </p>
              </div>
              <Users className="w-10 h-10 text-secondary/20" />
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Access Grants</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {records.reduce((sum, r) => sum + r.sharedWith.length, 0)}
                </p>
              </div>
              <Lock className="w-10 h-10 text-green-500/20" />
            </div>
          </Card>
        </div>

        {/* Records List */}
        <Card className="border-0 shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Your Records</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {records.length === 0 ? (
              <div className="p-12 text-center">
                <FileUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  No records yet. Upload your first medical record to get started.
                </p>
                <Button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  Upload Record
                </Button>
              </div>
            ) : (
              records.map((record) => (
                <div key={record.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{record.name}</h3>
                          <p className="text-sm text-gray-600">{record.type}</p>
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600 ml-13">
                        <span>Uploaded: {record.date}</span>
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {record.ipfsHash.substring(0, 12)}...
                        </span>
                        <span className="font-medium text-primary">
                          {record.sharedWith.length} access(es)
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent gap-1"
                        onClick={() => {
                          setSelectedRecord(record);
                          setShowViewerModal(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent gap-1"
                        onClick={() => handleDownloadRecord(record)}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-primary border-primary hover:bg-blue-50 bg-transparent"
                        onClick={() => {
                          setSelectedRecord(record);
                          setShowAccessModal(true);
                        }}
                      >
                        Manage Access
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                        onClick={() => handleDeleteRecord(record.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Shared With List */}
                  {record.sharedWith.length > 0 && (
                    <div className="ml-13 pt-4 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-600 mb-2">
                        SHARED WITH {record.sharedWith.length} DOCTOR(S)
                      </p>
                      <div className="space-y-2">
                        {record.sharedWith.map((doctorAddr) => (
                          <div
                            key={doctorAddr}
                            className="flex items-center justify-between text-sm bg-blue-50 p-2 rounded"
                          >
                            <span className="font-mono text-gray-700">{doctorAddr}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:bg-red-100 h-6 px-2 text-xs"
                              onClick={() => handleRevokeAccess(record.id, doctorAddr)}
                            >
                              Revoke
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl border-0 shadow-xl max-h-96 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Upload Medical Records</h2>
                  <button
                    onClick={() => {
                      setShowUploadModal(false);
                      setError(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div
                  onClick={() => document.getElementById('file-input')?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 hover:border-primary hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <FileUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="font-semibold text-gray-900 mb-1">
                    {uploadedFiles.length > 0 
                      ? `${uploadedFiles.length} file(s) selected` 
                      : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {uploadedFiles.length > 0
                      ? 'Add more files or continue'
                      : 'PDF, Images or Documents (Max 10MB per file)'}
                  </p>
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        for (let i = 0; i < e.target.files.length; i++) {
                          const file = e.target.files[i];
                          if (file.size > 10 * 1024 * 1024) {
                            setError(`File "${file.name}" exceeds 10MB limit`);
                          } else {
                            handleAddFile(file);
                          }
                        }
                      }
                    }}
                  />
                </div>

                {/* Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                    {uploadedFiles.map((file, idx) => (
                      <div
                        key={`${file.name}-${idx}`}
                        className={`p-3 rounded-lg border transition-colors ${
                          uploading && uploadingFileName === recordNames[idx]
                            ? 'bg-blue-100 border-blue-400'
                            : 'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 flex-1">
                            <FileText
                              className={`w-5 h-5 flex-shrink-0 transition-colors ${
                                uploading && uploadingFileName === recordNames[idx]
                                  ? 'text-blue-600 animate-pulse'
                                  : 'text-primary'
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-sm truncate">{file.name}</p>
                              <p className="text-xs text-gray-600">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(idx)}
                            className="text-red-600 hover:bg-red-100 h-6 px-2 flex-shrink-0"
                            disabled={uploading}
                          >
                            ✕
                          </Button>
                        </div>

                        {/* Progress bar for uploading file */}
                        {uploading && uploadingFileName === recordNames[idx] && (
                          <div className="mb-2">
                            <div className="w-full bg-gray-300 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                            <p className="text-xs text-blue-600 font-semibold mt-1">
                              Uploading: {uploadProgress}%
                            </p>
                          </div>
                        )}

                        <div className="space-y-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Record Name *
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., Blood Test Report"
                              value={recordNames[idx] || ''}
                              onChange={(e) => handleUpdateFileName(idx, e.target.value)}
                              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                              disabled={uploading}
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Record Type
                            </label>
                            <select
                              value={recordTypes[idx] || 'Lab Results'}
                              onChange={(e) => handleUpdateFileType(idx, e.target.value)}
                              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                              disabled={uploading}
                            >
                              <option>Lab Results</option>
                              <option>Imaging</option>
                              <option>Prescription</option>
                              <option>Diagnosis</option>
                              <option>Other</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Progress Summary */}
                {uploading && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900">
                      Uploading: {uploadProgress}%
                    </p>
                    {uploadingFileName && (
                      <p className="text-xs text-blue-700 mt-1">
                        Currently uploading: {uploadingFileName}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowUploadModal(false);
                      setUploadedFiles([]);
                      setRecordNames([]);
                      setRecordTypes([]);
                      setError(null);
                    }}
                    className="flex-1"
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleFileUpload}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white"
                    disabled={uploading || uploadedFiles.length === 0}
                  >
                    {uploading ? `Uploading ${uploadProgress}%...` : `Upload ${uploadedFiles.length} File(s)`}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Manage Access Modal */}
        {showAccessModal && selectedRecord && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md border-0 shadow-xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 truncate">
                    Grant Access - {selectedRecord.name}
                  </h2>
                  <button
                    onClick={() => setShowAccessModal(false)}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2"
                  >
                    ✕
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Doctor's Wallet Address
                    </label>
                    <input
                      type="text"
                      placeholder="0x..."
                      value={doctorAddress}
                      onChange={(e) => setDoctorAddress(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the doctor's Ethereum wallet address (starting with 0x)
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAccessModal(false);
                        setDoctorAddress('');
                        setError(null);
                      }}
                      className="flex-1"
                      disabled={uploading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleGrantAccess(selectedRecord)}
                      className="flex-1 bg-primary hover:bg-primary/90 text-white"
                      disabled={!doctorAddress || uploading}
                    >
                      Grant Access
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Record Viewer Modal */}
        {showViewerModal && selectedRecord && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl border-0 shadow-xl max-h-96 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedRecord.name}</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedRecord.type} • Uploaded: {selectedRecord.date}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowViewerModal(false)}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>

                {/* Record Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-xs font-semibold text-blue-600 mb-1">Record Type</p>
                    <p className="font-semibold text-gray-900">{selectedRecord.type}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-xs font-semibold text-green-600 mb-1">Upload Date</p>
                    <p className="font-semibold text-gray-900">{selectedRecord.date}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <p className="text-xs font-semibold text-purple-600 mb-1">IPFS Hash</p>
                    <p className="font-mono text-xs text-purple-900 truncate">{selectedRecord.ipfsHash.substring(0, 16)}...</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <p className="text-xs font-semibold text-orange-600 mb-1">Shared With</p>
                    <p className="font-semibold text-gray-900">{selectedRecord.sharedWith.length} Doctor(s)</p>
                  </div>
                </div>

                {/* Shared With Section */}
                {selectedRecord.sharedWith.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                      Doctors With Access ({selectedRecord.sharedWith.length})
                    </h3>
                    <div className="space-y-2">
                      {selectedRecord.sharedWith.map((doctorAddr) => (
                        <div
                          key={doctorAddr}
                          className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-600">
                              👨‍⚕️
                            </div>
                            <div>
                              <p className="font-mono text-sm text-gray-900">{doctorAddr}</p>
                              <p className="text-xs text-gray-600">Doctor</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-100 h-8 px-3 text-xs"
                            onClick={() => {
                              handleRevokeAccess(selectedRecord.id, doctorAddr);
                              setShowViewerModal(false);
                            }}
                          >
                            Revoke
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => setShowViewerModal(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => handleDownloadRecord(selectedRecord)}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Record
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
