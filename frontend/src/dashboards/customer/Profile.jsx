import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { Card, Button, Input, Badge, Avatar } from '../../components/ui';
import { customers } from '../../mock/data/customers';
import userApi from '../../services/api/userApi';

/**
 * Customer Profile Page — SevaSangam
 * Route: /customer/profile
 *
 * Clean, card-based customer personal information view with read-only and edit modes.
 * Allows updating Name, Email, Contact Number, Gender, Address, and Location.
 */
const CustomerProfile = () => {
  const { user, updateUser } = useAuth();

  // Find matching customer record from mock data or fallback to defaults
  const matchedCustomer = customers.find(
    (c) => c.userId === user?.id || c.email === user?.email || c.name === user?.name
  ) || customers[0];

  // Saved profile state (stored in localStorage for persistence across sessions)
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('sevasangam_customer_profile');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }

    return {
      name: user?.name || matchedCustomer?.name || 'Rahul Sharma',
      email: user?.email || matchedCustomer?.email || 'rahul.sharma@example.com',
      phone: user?.phone || matchedCustomer?.phone || '+91 98230 12345',
      gender: 'Male',
      address: matchedCustomer?.address || 'Flat 402, Green Meadows, Kothrud, Pune, Maharashtra 411038',
      location: matchedCustomer?.area || 'Pune',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',

      registrationDate: '10 January 2025',
      cooperative: 'Pune Central Labour Cooperative Society',
      emergencyContact: matchedCustomer?.emergencyContact || '+91 98230 99999',
    };
  });

  // Edit Mode state & form buffers
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profile });
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync formData whenever profile changes
  useEffect(() => {
    setFormData({ ...profile });
  }, [profile]);

  // Toast notification auto-dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStartEdit = () => {
    setFormData({ ...profile });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({ ...profile });
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    try {
      // Persist to local state & localStorage
      const updated = { ...formData };
      setProfile(updated);
      localStorage.setItem('sevasangam_customer_profile', JSON.stringify(updated));

      // Update user in AuthContext so headers, dropdowns, and layouts reflect name/email
      if (updateUser) {
        updateUser({
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
        });
      }

      // Try calling API endpoint if available (with seamless fallback)
      try {
        await userApi.updateProfile(updated);
      } catch (err) {
        console.warn('Backend API update not available; saved to local state successfully', err);
      }

      setIsEditing(false);
      setToastMessage('Profile updated successfully.');
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-150">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-xl animate-in slide-in-from-top-3 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500/40 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-white/80 hover:text-white cursor-pointer"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* Page Title & Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-700 uppercase tracking-wider mb-1">
            <span>Customer Portal</span>
            <span>•</span>
            <span>Account Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your personal cooperative membership details, contact preferences, and service addresses.
          </p>
        </div>

        {!isEditing && (
          <Button
            variant="primary"
            size="md"
            onClick={handleStartEdit}
            leftIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            }
          >
            Edit Profile
          </Button>
        )}
      </div>

      {/* Top Profile Summary Banner Card */}
      <Card className="p-6 sm:p-7 border border-slate-200/80 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white shadow-md">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative">
            <Avatar
              name={profile.name}
              src={profile.avatar}
              size="xl"
              status="online"
              className="ring-4 ring-white/20"
            />

          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-bold">{profile.name}</h2>
            </div>
            <p className="text-xs sm:text-sm text-primary-100/80">{profile.email}</p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-primary-100/90 font-medium">
              <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                <span>Joined:</span>
                <strong className="text-white">{profile.registrationDate}</strong>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                <span>City:</span>
                <strong className="text-white">{profile.location}</strong>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Profile Information Section */}
      <Card className="p-6 sm:p-8 border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Profile Information</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? 'Update your personal details below and click Save Changes.'
                : 'Your verified personal and residential details on SevaSangam.'}
            </p>
          </div>
          {isEditing && (
            <Badge variant="warning" size="sm">
              Editing Mode
            </Badge>
          )}
        </div>

        {/* Read-Only Mode */}
        {!isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</span>
                <p className="text-base font-semibold text-slate-900 mt-1">{profile.name}</p>
              </div>

              {/* Email Address */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</span>
                <p className="text-base font-semibold text-slate-900 mt-1">{profile.email}</p>
              </div>

              {/* Contact Number */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Number</span>
                <p className="text-base font-semibold text-slate-900 mt-1">{profile.phone}</p>
              </div>

              {/* Gender */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gender</span>
                <p className="text-base font-semibold text-slate-900 mt-1">{profile.gender}</p>
              </div>

              {/* Address */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60 md:col-span-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Address</span>
                <p className="text-base font-semibold text-slate-900 mt-1 leading-relaxed">{profile.address}</p>
              </div>

              {/* Location */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location / Area</span>
                <p className="text-base font-semibold text-slate-900 mt-1">{profile.location}</p>
              </div>

              {/* Emergency Contact */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Emergency Contact</span>
                <p className="text-base font-semibold text-slate-900 mt-1">{profile.emergencyContact}</p>
              </div>
            </div>


          </div>
        ) : (
          /* Edit Mode Form */
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-rose-600">*</span>
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Contact Number <span className="text-rose-600">*</span>
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 98230 XXXXX"
                  required
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-2xs"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Residential Address <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Flat/House No, Building name, Street, Area, Pincode"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-2xs resize-none"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Location / Area <span className="text-rose-600">*</span>
                </label>
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g. Pune, Kothrud"
                  required
                />
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Emergency Contact Number
                </label>
                <Input
                  type="tel"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  placeholder="+91 98230 XXXXX"
                />
              </div>
            </div>

            {/* Action Buttons: Save Changes & Cancel */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="md"
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                type="submit"
                isLoading={isSaving}
                leftIcon={
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                }
              >
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Card>


    </div>
  );
};

export default CustomerProfile;
