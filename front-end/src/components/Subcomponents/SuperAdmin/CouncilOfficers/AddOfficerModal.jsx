// AddOfficerModal.jsx - Modal container for adding new officer
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { dateInputToISO, getTodayDateInput } from '../../../../utils/dateUtils';
import AddOfficerForm from './AddOfficerForm';

const AddOfficerModal = ({ isOpen, onClose, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const initialFormData = {
    name: '',
    email: '',
    mobileNumber: '',
    password: '',
    selectedCouncil: '',
    scheduleStartDate: getTodayDateInput(),
    scheduleEndDate: getTodayDateInput(),
    scheduleStartTime: '09:00',
    scheduleEndTime: '17:00',
  };

  // Format time from 24h to 12h 
  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${String(hour12).padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const handleSave = async (formData) => {
    try {
      setIsSaving(true);
      setError('');

      const officerData = {
        ...formData,
        scheduleStartDate: dateInputToISO(formData.scheduleStartDate),
        scheduleEndDate: dateInputToISO(formData.scheduleEndDate),
        scheduleStartTime: formatTime(formData.scheduleStartTime),
        scheduleEndTime: formatTime(formData.scheduleEndTime),
        status: 'online',
      };

      await onSave(officerData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add officer');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Municipal Council Officer</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSaving}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <AddOfficerForm
          initialFormData={initialFormData}
          isSaving={isSaving}
          error={error}
          onSave={handleSave}
          onClose={onClose}
          setError={setError}
        />
      </div>
    </div>
  );
};

export default AddOfficerModal;