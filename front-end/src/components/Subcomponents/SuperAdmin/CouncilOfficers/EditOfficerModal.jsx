// EditOfficerModal.jsx - Modal container for editing officer
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { dateInputToISO } from '../../../../utils/dateUtils';
import EditOfficerForm from './editeOfficerform';

const EditOfficerModal = ({ isOpen, onClose, officer, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Format time from 24h to 12h (09:00 -> 09:00 AM)
  const formatTime = (time24) => {
    if (!time24) return '';
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

      const updates = {
        ...formData,
        scheduleStartDate: formData.scheduleStartDate ? dateInputToISO(formData.scheduleStartDate) : null,
        scheduleEndDate: formData.scheduleEndDate ? dateInputToISO(formData.scheduleEndDate) : null,
        scheduleStartTime: formatTime(formData.scheduleStartTime),
        scheduleEndTime: formatTime(formData.scheduleEndTime),
      };

      await onSave(officer.userId || officer.id, updates);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update officer');
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
          <h2 className="text-xl font-semibold text-gray-900">Edit Officer</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSaving}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form — key ensures the form remounts (and resets) when a different officer is selected */}
        <EditOfficerForm
          key={officer?.userId || officer?.id}
          officer={officer}
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

export default EditOfficerModal;