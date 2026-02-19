// OwnerCard.jsx - Individual owner display card
import React from 'react';
import { Mail, Phone, Edit2, Trash2 } from 'lucide-react';

const OwnerCard = ({ owner, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header - Name and Status */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{owner.name}</h3>
        </div>
        
        {/* Status Badge */}
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            owner.status === 'online'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full mr-2 ${
              owner.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
            }`}
          />
          {owner.status === 'online' ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="h-4 w-4 mr-2 text-gray-400" />
          <span>{owner.mobileNumber}</span>
        </div>
        
        {owner.email && (
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2 text-gray-400" />
            <span>{owner.email}</span>
          </div>
        )}
      </div>

      {/* Additional Info */}
      {owner.nicNumber && (
        <div className="mb-4 text-xs text-gray-500">
          NIC: {owner.nicNumber}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={() => onEdit(owner)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Edit2 className="h-4 w-4" />
          <span className="font-medium">Edit</span>
        </button>
        
        <button
          onClick={() => onDelete(owner)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          <span className="font-medium">Delete</span>
        </button>
      </div>
    </div>
  );
};

export default OwnerCard;