// AddInspectorModal.jsx - Modal container for adding new inspector
import React, { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import bcrypt from 'bcryptjs';
import AddInspectorForm from './Addinspectorform';

const AddInspectorModal = ({ isOpen, onClose, onSave }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (formData) => {
    try {
      setIsSaving(true);
      setError('');

      const hashedPassword = await bcrypt.hash(formData.password, 10);

      const inspectorData = {
        name: formData.name,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        password: hashedPassword,
        status: 'offline',
      };

      await onSave(inspectorData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add inspector');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-full p-2">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Add Parking Inspector</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSaving}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <AddInspectorForm
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

export default AddInspectorModal;