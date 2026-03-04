import React, { useState } from 'react';
import { User, Mail, Lock, KeyRound, ShieldCheck, Save } from 'lucide-react';

const SettingsForm = ({ userData, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSave(formData);
    
    // If successful, clear ONLY the password fields so the user doesn't accidentally resubmit them
    if (success) {
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Profile Information */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
        <p className="text-sm text-gray-500 mt-1">Update your account's profile information.</p>
      </div>

      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-6 mb-8">
          <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-lg">
            <User className="h-10 w-10 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{formData.name || 'Admin User'}</h3>
            <p className="text-sm text-gray-500">{userData?.role?.replace('_', ' ') || 'Administrator'}</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg sm:text-sm cursor-not-allowed"
                disabled // Disabled because it's the DB Partition Key
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Email address cannot be changed as it is your primary identifier.</p>
          </div>
        </div>
      </div>

      {/*password*/}
      <div className="p-6 border-b border-gray-200 bg-gray-50/50">
        <h2 className="text-xl font-semibold text-gray-800">Update Password</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">Leave these fields blank if you do not want to change your password.</p>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ShieldCheck className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SUBMIT BUTTON  */}
      <div className="p-6 bg-gray-50 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 shadow-sm"
        >
          <Save className="h-5 w-5" />
          <span>{isLoading ? 'Saving Changes...' : 'Save Changes'}</span>
        </button>
      </div>
    </form>
  );
};

export default SettingsForm;