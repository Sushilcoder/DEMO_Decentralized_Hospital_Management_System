'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useWallet } from '@/lib/wallet-context';
import { CheckCircle2, ChevronRight, AlertCircle, Stethoscope, FileText, Award } from 'lucide-react';

interface DoctorDetails {
  fullName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  specialization: string;
  hospital: string;
  yearsOfExperience: string;
  bio: string;
}

interface DoctorDetailsFormProps {
  onComplete: () => void;
}

export function DoctorDetailsForm({ onComplete }: DoctorDetailsFormProps) {
  const { wallet } = useWallet();
  const [currentStep, setCurrentStep] = useState<'info' | 'credentials' | 'summary'>(
    'info'
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<DoctorDetails>({
    fullName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    specialization: '',
    hospital: '',
    yearsOfExperience: '',
    bio: '',
  });

  const validateEmail = (email: string) => {
    return email.includes('@') && email.includes('.');
  };

  const validatePhone = (phone: string) => {
    return /^\d{10,}$/.test(phone.replace(/\D/g, ''));
  };

  const validateStep = (step: string) => {
    const newErrors: Record<string, string> = {};

    if (step === 'info') {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
      else if (!validatePhone(formData.phone)) newErrors.phone = 'Invalid phone format';
    } else if (step === 'credentials') {
      if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
      if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required';
      if (!formData.hospital.trim()) newErrors.hospital = 'Hospital/Clinic is required';
      if (!formData.yearsOfExperience.trim()) newErrors.yearsOfExperience = 'Years of experience is required';
      else if (isNaN(parseInt(formData.yearsOfExperience))) newErrors.yearsOfExperience = 'Must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep === 'info') {
      setCurrentStep('credentials');
    } else if (currentStep === 'credentials') {
      setCurrentStep('summary');
    }
  };

  const handleBack = () => {
    if (currentStep === 'credentials') {
      setCurrentStep('info');
    } else if (currentStep === 'summary') {
      setCurrentStep('credentials');
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      if (!wallet?.address) {
        setErrors({ general: 'Wallet not connected' });
        return;
      }

      const doctorData = {
        ...formData,
        walletAddress: wallet.address,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(`doctor_details_${wallet.address}`, JSON.stringify(doctorData));
      console.log('[v0] Doctor details saved successfully');
      
      setTimeout(() => {
        onComplete();
      }, 500);
    } catch (err) {
      console.log('[v0] Error saving doctor details:', err);
      setErrors({ general: 'Failed to save details. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const specializations = [
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Dermatology',
    'General Practice',
    'Pediatrics',
    'Ophthalmology',
    'Psychiatry',
    'Oncology',
    'Radiology',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                currentStep === 'info' || ['credentials', 'summary'].includes(currentStep)
                  ? 'bg-gradient-to-br from-teal-500 to-blue-500 text-white'
                  : 'bg-gray-300 text-white'
              }`}
            >
              1
            </div>
            <div className={`h-1 flex-1 ${['credentials', 'summary'].includes(currentStep) ? 'bg-teal-500' : 'bg-gray-300'}`} />
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                currentStep === 'credentials' || currentStep === 'summary'
                  ? 'bg-gradient-to-br from-teal-500 to-blue-500 text-white'
                  : 'bg-gray-300 text-white'
              }`}
            >
              2
            </div>
            <div className={`h-1 flex-1 ${currentStep === 'summary' ? 'bg-teal-500' : 'bg-gray-300'}`} />
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                currentStep === 'summary'
                  ? 'bg-gradient-to-br from-teal-500 to-blue-500 text-white'
                  : 'bg-gray-300 text-white'
              }`}
            >
              3
            </div>
          </div>

          <div className="flex justify-between text-center text-sm font-semibold text-gray-600 mb-8">
            <span className={currentStep === 'info' ? 'text-teal-600' : ''}>Personal Info</span>
            <span className={currentStep === 'credentials' ? 'text-teal-600' : ''}>Credentials</span>
            <span className={currentStep === 'summary' ? 'text-teal-600' : ''}>Review</span>
          </div>
        </div>

        <Card className="shadow-2xl border-0 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-6 py-6 md:px-8 md:py-8">
            <div className="flex items-center gap-3 mb-2">
              <Stethoscope className="w-8 h-8 text-white" />
              <h1 className="text-3xl font-bold text-white">Doctor Profile Setup</h1>
            </div>
            <p className="text-teal-100">Complete your professional credentials</p>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-900 font-medium">{errors.general}</p>
              </div>
            )}

            {/* Step 1: Personal Information */}
            {currentStep === 'info' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                      if (errors.fullName) setErrors({ ...errors, fullName: '' });
                    }}
                    placeholder="Dr. John Smith"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                      errors.fullName
                        ? 'border-red-400 focus:border-red-500 bg-red-50'
                        : 'border-gray-300 focus:border-teal-500'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      placeholder="doctor@hospital.com"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                        errors.email
                          ? 'border-red-400 focus:border-red-500 bg-red-50'
                          : 'border-gray-300 focus:border-teal-500'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: '' });
                      }}
                      placeholder="+1 (555) 000-0000"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                        errors.phone
                          ? 'border-red-400 focus:border-red-500 bg-red-50'
                          : 'border-gray-300 focus:border-teal-500'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Bio (Optional)
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell patients about your experience and approach..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Professional Credentials */}
            {currentStep === 'credentials' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Medical License Number *
                    </label>
                    <input
                      type="text"
                      value={formData.licenseNumber}
                      onChange={(e) => {
                        setFormData({ ...formData, licenseNumber: e.target.value });
                        if (errors.licenseNumber) setErrors({ ...errors, licenseNumber: '' });
                      }}
                      placeholder="LIC-12345-ABC"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                        errors.licenseNumber
                          ? 'border-red-400 focus:border-red-500 bg-red-50'
                          : 'border-gray-300 focus:border-teal-500'
                      }`}
                    />
                    {errors.licenseNumber && (
                      <p className="text-red-600 text-sm mt-1">{errors.licenseNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Years of Experience *
                    </label>
                    <input
                      type="number"
                      value={formData.yearsOfExperience}
                      onChange={(e) => {
                        setFormData({ ...formData, yearsOfExperience: e.target.value });
                        if (errors.yearsOfExperience) setErrors({ ...errors, yearsOfExperience: '' });
                      }}
                      placeholder="10"
                      min="0"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                        errors.yearsOfExperience
                          ? 'border-red-400 focus:border-red-500 bg-red-50'
                          : 'border-gray-300 focus:border-teal-500'
                      }`}
                    />
                    {errors.yearsOfExperience && (
                      <p className="text-red-600 text-sm mt-1">{errors.yearsOfExperience}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Specialization *
                  </label>
                  <select
                    value={formData.specialization}
                    onChange={(e) => {
                      setFormData({ ...formData, specialization: e.target.value });
                      if (errors.specialization) setErrors({ ...errors, specialization: '' });
                    }}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                      errors.specialization
                        ? 'border-red-400 focus:border-red-500 bg-red-50'
                        : 'border-gray-300 focus:border-teal-500'
                    }`}
                  >
                    <option value="">Select a specialization...</option>
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                  {errors.specialization && (
                    <p className="text-red-600 text-sm mt-1">{errors.specialization}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Hospital/Clinic *
                  </label>
                  <input
                    type="text"
                    value={formData.hospital}
                    onChange={(e) => {
                      setFormData({ ...formData, hospital: e.target.value });
                      if (errors.hospital) setErrors({ ...errors, hospital: '' });
                    }}
                    placeholder="Central Medical Hospital"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all ${
                      errors.hospital
                        ? 'border-red-400 focus:border-red-500 bg-red-50'
                        : 'border-gray-300 focus:border-teal-500'
                    }`}
                  />
                  {errors.hospital && (
                    <p className="text-red-600 text-sm mt-1">{errors.hospital}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Review & Confirm */}
            {currentStep === 'summary' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <h3 className="font-bold text-green-900">Ready to Complete Setup</h3>
                  </div>
                  <p className="text-green-800 text-sm">Review your information below before submitting.</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs font-semibold text-blue-600 mb-1">Full Name</p>
                      <p className="font-bold text-gray-900">{formData.fullName}</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs font-semibold text-blue-600 mb-1">Email</p>
                      <p className="font-mono text-sm text-gray-900">{formData.email}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-xs font-semibold text-purple-600 mb-1">Specialization</p>
                      <p className="font-bold text-gray-900">{formData.specialization}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-xs font-semibold text-purple-600 mb-1">Years of Experience</p>
                      <p className="font-bold text-gray-900">{formData.yearsOfExperience} years</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 md:col-span-2">
                      <p className="text-xs font-semibold text-orange-600 mb-1">Hospital/Clinic</p>
                      <p className="font-bold text-gray-900">{formData.hospital}</p>
                    </div>
                  </div>

                  {formData.bio && (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs font-semibold text-gray-600 mb-1">Bio</p>
                      <p className="text-gray-900">{formData.bio}</p>
                    </div>
                  )}

                  <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                    <p className="text-xs font-semibold text-teal-600 mb-1">Wallet Address</p>
                    <p className="font-mono text-sm text-teal-900 break-all">{wallet?.address}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 mt-8">
              <Button
                onClick={handleBack}
                disabled={currentStep === 'info' || isSubmitting}
                variant="outline"
                className="flex-1 border-2 border-gray-300 py-3 bg-transparent"
              >
                Back
              </Button>

              {currentStep === 'summary' ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white py-3 font-semibold"
                >
                  {isSubmitting ? 'Saving...' : 'Complete Setup'}
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white py-3 font-semibold"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
