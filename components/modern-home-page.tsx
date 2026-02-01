'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { WalletButton } from '@/components/wallet-button';
import { OnboardingWizard } from '@/components/onboarding-wizard';
import { PatientDetailsForm } from '@/components/patient-details-form';
import { DoctorDetailsForm } from '@/components/doctor-details-form';
import { SimplifiedPatientDashboard } from '@/components/simplified-patient-dashboard';
import { SimplifiedDoctorDashboard } from '@/components/simplified-doctor-dashboard';
import { useWallet } from '@/lib/wallet-context';
import { LogOut } from 'lucide-react';

type Page = 'onboarding' | 'patient-details' | 'doctor-details' | 'patient' | 'doctor';

export function ModernHomePage() {
  const [currentPage, setCurrentPage] = useState<Page>('onboarding');
  const [userRole, setUserRole] = useState<'patient' | 'doctor' | null>(null);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const { wallet, disconnectWallet } = useWallet();

  // Check if details exist on wallet connect
  useEffect(() => {
    if (!wallet?.isConnected || !userRole || showDetailsForm) return;

    if (userRole === 'patient') {
      const hasDetails = localStorage.getItem(`patient_details_${wallet.address}`);
      if (!hasDetails) {
        setShowDetailsForm(true);
        setCurrentPage('patient-details');
      } else {
        setCurrentPage('patient');
      }
    } else if (userRole === 'doctor') {
      const hasDetails = localStorage.getItem(`doctor_details_${wallet.address}`);
      if (!hasDetails) {
        setShowDetailsForm(true);
        setCurrentPage('doctor-details');
      } else {
        setCurrentPage('doctor');
      }
    }
  }, [wallet?.isConnected, userRole, showDetailsForm]);

  const handleRoleSelect = (role: 'patient' | 'doctor') => {
    setUserRole(role);
    setShowDetailsForm(false);
    
    if (role === 'patient') {
      const hasDetails = localStorage.getItem(`patient_details_${wallet?.address}`);
      if (!hasDetails) {
        setShowDetailsForm(true);
        setCurrentPage('patient-details');
      } else {
        setCurrentPage('patient');
      }
    } else {
      const hasDetails = localStorage.getItem(`doctor_details_${wallet?.address}`);
      if (!hasDetails) {
        setShowDetailsForm(true);
        setCurrentPage('doctor-details');
      } else {
        setCurrentPage('doctor');
      }
    }
  };

  if (!wallet?.isConnected) {
    return <OnboardingWizard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-primary">🏥</div>
            <h1 className="text-2xl font-bold text-gray-900">MediChain</h1>
          </div>

          <div className="flex items-center gap-4">
            {userRole && !showDetailsForm && (
              <div className="flex gap-2 bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => handleRoleSelect('patient')}
                  className={`px-4 py-2 rounded-full transition-all font-medium ${
                    userRole === 'patient'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Patient
                </button>
                <button
                  onClick={() => handleRoleSelect('doctor')}
                  className={`px-4 py-2 rounded-full transition-all font-medium ${
                    userRole === 'doctor'
                      ? 'bg-secondary text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Doctor
                </button>
              </div>
            )}

            <WalletButton />

            <Button
              onClick={() => {
                disconnectWallet();
                setCurrentPage('onboarding');
                setUserRole(null);
                setShowDetailsForm(false);
              }}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50 gap-2 bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-8">
        {!userRole ? (
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to MediChain
              </h2>
              <p className="text-lg text-gray-600">
                Choose your role to get started with secure, decentralized medical records
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              {/* Patient Card */}
              <button
                onClick={() => handleRoleSelect('patient')}
                className="group p-8 bg-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all border-2 border-transparent hover:border-primary"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                  👤
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Patient</h3>
                <p className="text-gray-600 mb-6">
                  Manage your medical records securely on the blockchain. Upload files, control access, and keep your health data private.
                </p>
                <div className="flex flex-col gap-2 text-sm text-gray-600">
                  <div>✓ Upload medical records</div>
                  <div>✓ Control access permissions</div>
                  <div>✓ Share with trusted doctors</div>
                </div>
              </button>

              {/* Doctor Card */}
              <button
                onClick={() => handleRoleSelect('doctor')}
                className="group p-8 bg-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all border-2 border-transparent hover:border-secondary"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                  👨‍⚕️
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Doctor</h3>
                <p className="text-gray-600 mb-6">
                  Access patient medical records that have been shared with you. Review, download, and manage patient health information securely.
                </p>
                <div className="flex flex-col gap-2 text-sm text-gray-600">
                  <div>✓ View shared records</div>
                  <div>✓ Download documents</div>
                  <div>✓ Secure communication</div>
                </div>
              </button>
            </div>
          </div>
        ) : currentPage === 'patient-details' ? (
          <PatientDetailsForm onComplete={() => {
            setShowDetailsForm(false);
            setCurrentPage('patient');
          }} />
        ) : currentPage === 'doctor-details' ? (
          <DoctorDetailsForm onComplete={() => {
            setShowDetailsForm(false);
            setCurrentPage('doctor');
          }} />
        ) : currentPage === 'patient' ? (
          <SimplifiedPatientDashboard />
        ) : (
          <SimplifiedDoctorDashboard />
        )}
      </div>
    </div>
  );
}
