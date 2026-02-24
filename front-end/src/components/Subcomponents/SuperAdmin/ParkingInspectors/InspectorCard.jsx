// InspectorCard.jsx - Individual inspector display card
import React from 'react';
import { Mail, Phone, Edit2, Trash2, MapPin, Building2, Badge } from 'lucide-react';

const InspectorCard = ({ inspector, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header - Inspector ID and Status */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          {/* Inspector ID - Highlighted */}
          <div className="flex items-center gap-2 mb-2">
            <Badge className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
              Inspector ID
            </span>
          </div>
          <h3 className="text-lg font-bold text-blue-700 mb-1">
            {inspector.inspectorId || inspector.id}
          </h3>
          <p className="text-xl font-semibold text-gray-900">{inspector.name}</p>
        </div>

        {/* Status Badge */}
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            inspector.status === 'online'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full mr-2 ${
              inspector.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
            }`}
          />
          {inspector.status === 'online' ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="h-4 w-4 mr-2 text-gray-400" />
          <span>{inspector.mobileNumber}</span>
        </div>

        {inspector.email && (
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2 text-gray-400" />
            <span>{inspector.email}</span>
          </div>
        )}
      </div>

      {/* Assignment Info */}
      <div className="space-y-2 mb-4 pt-4 border-t border-gray-100">
        <div className="flex items-start text-sm">
          <Building2 className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-0.5">Municipal Council</p>
            <p className="text-gray-900 font-medium">
              {inspector.municipalCouncil || (
                <span className="text-gray-400 italic">Not Assigned</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-start text-sm">
          <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-0.5">Assigned Zone</p>
            <p className="text-gray-900 font-medium">
              {inspector.assignedZone || (
                <span className="text-gray-400 italic">Not Assigned</span>
              )}
            </p>
          </div>
        </div>

        {/* Assignment Status Badge */}
        <div className="pt-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
              inspector.isAssigned
                ? 'bg-blue-50 text-blue-700'
                : 'bg-yellow-50 text-yellow-700'
            }`}
          >
            {inspector.isAssigned ? '✓ Assigned to Zone' : '○ Awaiting Assignment'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={() => onEdit(inspector)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Edit2 className="h-4 w-4" />
          <span className="font-medium">Edit</span>
        </button>

        <button
          onClick={() => onDelete(inspector)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          <span className="font-medium">Delete</span>
        </button>
      </div>
    </div>
  );
};

export default InspectorCard;