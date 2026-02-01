'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useWallet } from '@/lib/wallet-context';
import { Clock, Lock, Unlock, Upload, Download, User } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  action: 'upload' | 'grant_access' | 'revoke_access' | 'download' | 'view';
  description: string;
  details: Record<string, string>;
  actor: string;
  status: 'success' | 'pending' | 'failed';
}

export function AuditTrail() {
  const { wallet } = useWallet();
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    if (!wallet?.address) return;

    // Load audit logs from localStorage
    const savedLogs = localStorage.getItem(`audit_logs_${wallet.address}`);
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (err) {
        console.log('[v0] Error parsing audit logs:', err);
      }
    }
  }, [wallet?.address]);

  // Function to add a log entry (called from other components)
  const addLog = (
    action: AuditLog['action'],
    description: string,
    details: Record<string, string>,
    status: 'success' | 'pending' | 'failed' = 'success'
  ) => {
    const newLog: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action,
      description,
      details,
      actor: wallet?.address || '',
      status,
    };

    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);

    // Save to localStorage
    if (wallet?.address) {
      localStorage.setItem(`audit_logs_${wallet.address}`, JSON.stringify(updatedLogs));
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'upload':
        return <Upload className="w-4 h-4 text-blue-600" />;
      case 'grant_access':
        return <Unlock className="w-4 h-4 text-green-600" />;
      case 'revoke_access':
        return <Lock className="w-4 h-4 text-red-600" />;
      case 'download':
        return <Download className="w-4 h-4 text-purple-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className="border-0 shadow-md">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Audit Trail</h2>
        <p className="text-sm text-gray-600 mt-1">
          Complete history of all actions on your account
        </p>
      </div>

      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>No activity yet</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className={`p-4 border-l-4 ${getStatusColor(log.status)}`}>
              <div className="flex items-start gap-3">
                <div className="mt-1">{getActionIcon(log.action)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-gray-900">
                      {log.description}
                    </p>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      log.status === 'success'
                        ? 'bg-green-100 text-green-800'
                        : log.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                  {Object.keys(log.details).length > 0 && (
                    <div className="text-xs text-gray-500 mt-2 space-y-1">
                      {Object.entries(log.details).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-medium">{key}:</span> {value}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

// Export addLog function for use in other components
export function useAuditLog() {
  const { wallet } = useWallet();

  const addLog = (
    action: AuditLog['action'],
    description: string,
    details: Record<string, string> = {},
    status: 'success' | 'pending' | 'failed' = 'success'
  ) => {
    const newLog: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action,
      description,
      details,
      actor: wallet?.address || '',
      status,
    };

    if (wallet?.address) {
      const savedLogs = localStorage.getItem(`audit_logs_${wallet.address}`);
      const existingLogs = savedLogs ? JSON.parse(savedLogs) : [];
      const updatedLogs = [newLog, ...existingLogs];
      localStorage.setItem(`audit_logs_${wallet.address}`, JSON.stringify(updatedLogs));
    }
  };

  return { addLog };
}
