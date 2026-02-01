'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useWallet } from '@/lib/wallet-context';
import { User, Mail, Phone, Calendar, MapPin, Edit2, Save, X, Heart, AlertCircle, Award, Briefcase } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  location?: string;
  bio?: string;
  role: 'patient' | 'doctor';
  licenseNumber?: string;
  specialization?: string;
}

interface PatientDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  allergies: string;
  medicalConditions: string;
}

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

export function UserProfile({ role }: { role: 'patient' | 'doctor' }) {
  const { wallet } = useWallet();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [patientDetails, setPatientDetails] = useState<PatientDetails | null>(null);
  const [doctorDetails, setDoctorDetails] = useState<DoctorDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile | null>(null);

  // Load profile and details from localStorage
  useEffect(() => {
    if (!wallet?.address) return;
    
    const savedProfile = localStorage.getItem(`profile_${wallet.address}`);
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile(parsed);
      setFormData(parsed);
    } else {
      const newProfile: UserProfile = {
        name: '',
        email: '',
        phone: '',
        role,
      };
      setProfile(newProfile);
      setFormData(newProfile);
    }

    // Load patient details if patient
    if (role === 'patient') {
      const savedDetails = localStorage.getItem(`patient_details_${wallet.address}`);
      if (savedDetails) {
        setPatientDetails(JSON.parse(savedDetails));
      }
    }

    // Load doctor details if doctor
    if (role === 'doctor') {
      const savedDetails = localStorage.getItem(`doctor_details_${wallet.address}`);
      if (savedDetails) {
        setDoctorDetails(JSON.parse(savedDetails));
      }
    }
  }, [wallet?.address, role]);

  const handleSaveProfile = () => {
    if (!wallet?.address || !formData) return;
    
    localStorage.setItem(`profile_${wallet.address}`, JSON.stringify(formData));
    setProfile(formData);
    setIsEditing(false);
  };

  if (!profile) return null;

  return (
    <div className="space-y-6">
      {/* Professional Card with gradient header */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-teal-600 to-blue-600"></div>
        <div className="p-6 -mt-12 relative">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full border-4 border-white flex items-center justify-center text-2xl mb-3">
                {role === 'patient' ? '👤' : '👨‍⚕️'}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {profile.name || `${role.charAt(0).toUpperCase() + role.slice(1)} Profile`}
              </h2>
              <p className="text-sm text-gray-600">{wallet?.address?.substring(0, 12)}...</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isEditing ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
            </button>
          </div>

          {isEditing && formData ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>

                {role === 'doctor' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        License Number
                      </label>
                      <input
                        type="text"
                        value={formData.licenseNumber || ''}
                        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Specialization
                      </label>
                      <input
                        type="text"
                        value={formData.specialization || ''}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                      />
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Bio</label>
                <textarea
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 transition-colors resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setFormData(profile);
                    setIsEditing(false);
                  }}
                  variant="outline"
                  className="flex-1 border-2 border-gray-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  className="flex-1 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.email && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{profile.email}</p>
                  </div>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{profile.phone}</p>
                  </div>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">{profile.location}</p>
                  </div>
                </div>
              )}
              {role === 'doctor' && profile.specialization && (
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <User className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-xs text-gray-600">Specialization</p>
                    <p className="font-medium text-gray-900">{profile.specialization}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Patient Medical Details Card */}
      {role === 'patient' && patientDetails && (
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-pink-50">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-red-600" />
              <h3 className="text-xl font-bold text-gray-900">Medical Information</h3>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Key Medical Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                <p className="text-xs font-semibold text-red-600 mb-1">Blood Type</p>
                <p className="text-2xl font-bold text-red-900">{patientDetails.bloodType || 'N/A'}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs font-semibold text-blue-600 mb-1">Gender</p>
                <p className="text-lg font-bold text-blue-900 capitalize">{patientDetails.gender || 'N/A'}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-xs font-semibold text-green-600 mb-1">DOB</p>
                <p className="text-sm font-bold text-green-900">
                  {patientDetails.dateOfBirth
                    ? new Date(patientDetails.dateOfBirth).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <p className="text-xs font-semibold text-purple-600 mb-1">Emergency</p>
                <p className="text-sm font-bold text-purple-900">
                  {patientDetails.emergencyContact ? '✓' : 'Not Set'}
                </p>
              </div>
            </div>

            {/* Allergies */}
            {patientDetails.allergies && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h4 className="font-semibold text-gray-900">Known Allergies</h4>
                </div>
                <p className="p-3 bg-red-50 text-red-900 rounded-lg border border-red-100">
                  {patientDetails.allergies}
                </p>
              </div>
            )}

            {/* Medical Conditions */}
            {patientDetails.medicalConditions && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-orange-600" />
                  <h4 className="font-semibold text-gray-900">Medical Conditions</h4>
                </div>
                <p className="p-3 bg-orange-50 text-orange-900 rounded-lg border border-orange-100">
                  {patientDetails.medicalConditions}
                </p>
              </div>
            )}

            {/* Emergency Contact */}
            {patientDetails.emergencyContact && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <div>
                  <p className="text-xs font-semibold text-yellow-700 mb-1">Emergency Contact</p>
                  <p className="font-semibold text-yellow-900">{patientDetails.emergencyContact}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-yellow-700 mb-1">Emergency Phone</p>
                  <p className="font-semibold text-yellow-900">{patientDetails.emergencyPhone}</p>
                </div>
              </div>
            )}

            {/* Address */}
            {patientDetails.address && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">Address</h4>
                </div>
                <p className="p-3 bg-blue-50 text-blue-900 rounded-lg border border-blue-100">
                  {patientDetails.address}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Doctor Professional Details Card */}
      {role === 'doctor' && doctorDetails && (
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">Professional Credentials</h3>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Key Professional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs font-semibold text-blue-600 mb-1">Specialization</p>
                <p className="text-lg font-bold text-blue-900">{doctorDetails.specialization}</p>
              </div>
              <div className="p-4 bg-teal-50 rounded-lg border border-teal-100">
                <p className="text-xs font-semibold text-teal-600 mb-1">Experience</p>
                <p className="text-lg font-bold text-teal-900">{doctorDetails.yearsOfExperience} years</p>
              </div>
              <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-100 md:col-span-2">
                <p className="text-xs font-semibold text-cyan-600 mb-1">Hospital/Clinic</p>
                <p className="font-bold text-cyan-900">{doctorDetails.hospital}</p>
              </div>
            </div>

            {/* License Number */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-gray-900">Medical License</h4>
              </div>
              <p className="p-3 bg-green-50 text-green-900 rounded-lg border border-green-100 font-mono font-semibold">
                {doctorDetails.licenseNumber}
              </p>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <p className="text-xs font-semibold text-purple-600 mb-1">Email</p>
                <p className="font-mono text-sm text-purple-900 break-all">{doctorDetails.email}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <p className="text-xs font-semibold text-purple-600 mb-1">Phone</p>
                <p className="font-semibold text-purple-900">{doctorDetails.phone}</p>
              </div>
            </div>

            {/* Bio */}
            {doctorDetails.bio && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-5 h-5 text-orange-600" />
                  <h4 className="font-semibold text-gray-900">Professional Bio</h4>
                </div>
                <p className="p-3 bg-orange-50 text-orange-900 rounded-lg border border-orange-100">
                  {doctorDetails.bio}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Wallet Address Card */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Wallet Address:</span>
          <br />
          <span className="font-mono text-xs">{wallet?.address}</span>
        </p>
      </div>
    </div>
  );
}
