'use client';

import React, { useState, useRef } from 'react';
import { uploadFileToPinata } from '@/lib/pinata';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload, Loader2, Check, AlertCircle } from 'lucide-react';

interface UploadStatus {
  status: 'idle' | 'uploading' | 'success' | 'error';
  message: string;
  ipfsHash?: string;
}

export function FileUpload({ onUploadComplete }: { onUploadComplete: (hash: string, fileName: string) => void }) {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ status: 'idle', message: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus({ status: 'idle', message: '' });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus({ status: 'error', message: 'Please select a file' });
      return;
    }

    setUploadStatus({ status: 'uploading', message: 'Uploading to IPFS...' });

    try {
      const ipfsHash = await uploadFileToPinata(selectedFile);
      setUploadStatus({
        status: 'success',
        message: 'File uploaded successfully!',
        ipfsHash,
      });
      onUploadComplete(ipfsHash, selectedFile.name);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadStatus({ status: 'error', message: errorMessage });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Medical Record</CardTitle>
        <CardDescription>Upload your medical files to IPFS via Pinata</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            disabled={uploadStatus.status === 'uploading'}
            accept=".pdf,.jpg,.png,.doc,.docx"
          />
        </div>

        {selectedFile && (
          <p className="text-sm text-slate-600">
            Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}

        <Button
          onClick={handleUpload}
          disabled={!selectedFile || uploadStatus.status === 'uploading'}
          className="w-full gap-2"
        >
          {uploadStatus.status === 'uploading' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Upload File
            </>
          )}
        </Button>

        {uploadStatus.status === 'success' && (
          <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-green-900">{uploadStatus.message}</p>
              <p className="text-green-800 break-all text-xs mt-1">Hash: {uploadStatus.ipfsHash}</p>
            </div>
          </div>
        )}

        {uploadStatus.status === 'error' && (
          <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-900">{uploadStatus.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
