import React, { useEffect } from 'react';
import useSettings from '../../hooks/superAdmin/useSettings';
import ProfileForm from '../../components/Subcomponents/SuperAdmin/Settings/ProfileForm';
import { Settings as SettingsIcon, AlertCircle, CheckCircle2 } from 'lucide-react';


const Settings = () => {
  const {
    userData,
    isLoading,
    error,
    successMsg,
    saveSettings,
    clearMessages
  } = useSettings();

  // Auto clear messages after 5 seconds
  useEffect(() => {
    if (error || successMsg) {
      const timer = setTimeout(() => {
        clearMessages();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMsg, clearMessages]);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <SettingsIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your personal profile and security preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Global Error/Success Banners */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}
        
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            <p className="text-green-700 font-medium">{successMsg}</p>
          </div>
        )}

        {/* Single Combined Form */}
        <ProfileForm 
          userData={userData} 
          onSave={saveSettings} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
};

export default Settings;