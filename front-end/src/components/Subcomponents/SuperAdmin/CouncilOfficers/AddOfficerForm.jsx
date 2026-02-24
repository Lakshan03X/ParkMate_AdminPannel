// AddOfficerForm.jsx - Form fields for adding a new officer
import React, { useState } from 'react';
import { Save, Eye, EyeOff } from 'lucide-react';

const municipalCouncils = [
  'Colombo',
  'Dehiwala-Mount Lavinia',
  'Moratuwa',
  'Sri Jayawardenepura Kotte',
  'Maharagama',
  'Kolonnawa',
  'Kaduwela',
  'Kesbewa',
];

const AddOfficerForm = ({ initialFormData, isSaving, error, onSave, onClose, setError }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return setError('Name is required');
    if (!formData.mobileNumber.trim()) return setError('Mobile number is required');
    if (!formData.email.trim()) return setError('Email is required');
    if (!formData.password || formData.password.length < 6) return setError('Password must be at least 6 characters');
    if (!formData.selectedCouncil) return setError('Please select a municipal council');

    await onSave(formData);

    setFormData(initialFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Enter full name"
            disabled={isSaving}
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="0701234567"
            disabled={isSaving}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="officer@council.com"
            disabled={isSaving}
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none pr-10"
              placeholder="Min 6 characters"
              disabled={isSaving}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Municipal Council */}
        <div className="md:col-span-2">
          <label htmlFor="selectedCouncil" className="block text-sm font-medium text-gray-700 mb-2">
            Municipal Council <span className="text-red-500">*</span>
          </label>
          <select
            id="selectedCouncil"
            name="selectedCouncil"
            value={formData.selectedCouncil}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={isSaving}
          >
            <option value="">Select council...</option>
            {municipalCouncils.map((council) => (
              <option key={council} value={council}>
                {council}
              </option>
            ))}
          </select>
        </div>

        {/* Schedule Start Date */}
        <div>
          <label htmlFor="scheduleStartDate" className="block text-sm font-medium text-gray-700 mb-2">
            Schedule Start Date
          </label>
          <input
            type="date"
            id="scheduleStartDate"
            name="scheduleStartDate"
            value={formData.scheduleStartDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={isSaving}
          />
        </div>

        {/* Schedule End Date */}
        <div>
          <label htmlFor="scheduleEndDate" className="block text-sm font-medium text-gray-700 mb-2">
            Schedule End Date
          </label>
          <input
            type="date"
            id="scheduleEndDate"
            name="scheduleEndDate"
            value={formData.scheduleEndDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={isSaving}
          />
        </div>

        {/* Schedule Start Time */}
        <div>
          <label htmlFor="scheduleStartTime" className="block text-sm font-medium text-gray-700 mb-2">
            Start Time
          </label>
          <input
            type="time"
            id="scheduleStartTime"
            name="scheduleStartTime"
            value={formData.scheduleStartTime}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={isSaving}
          />
        </div>

        {/* Schedule End Time */}
        <div>
          <label htmlFor="scheduleEndTime" className="block text-sm font-medium text-gray-700 mb-2">
            End Time
          </label>
          <input
            type="time"
            id="scheduleEndTime"
            name="scheduleEndTime"
            value={formData.scheduleEndTime}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={isSaving}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Adding...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Add Officer</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddOfficerForm;