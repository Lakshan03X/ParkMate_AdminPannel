// OfficerCard.jsx - Individual officer display card with all details
import React from 'react';
import { Mail, Phone, Edit2, Trash2, Calendar, Clock, Building } from 'lucide-react';
import { formatDate } from '../../../../utils/dateUtils';

const OfficerCard = ({ officer, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header - Name and Status */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{officer.name}</h3>
          <p className="text-sm text-blue-600 font-medium mt-1">{officer.officerId}</p>
        </div>
        
        {/* Status Badge */}
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            officer.status === 'online'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full mr-2 ${
              officer.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
            }`}
          />
          {officer.status === 'online' ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
          <span>{officer.mobileNumber}</span>
        </div>
        
        {officer.email && (
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">{officer.email}</span>
          </div>
        )}

        {officer.selectedCouncil && (
          <div className="flex items-center text-sm text-gray-600">
            <Building className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span>{officer.selectedCouncil}</span>
          </div>
        )}
      </div>

      {/* Schedule Info */}
      {(officer.scheduleStartDate || officer.scheduleStartTime) && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-xs font-medium text-gray-500 mb-2">Schedule</p>
          
          {officer.scheduleStartDate && officer.scheduleEndDate && (
            <div className="flex items-start text-xs text-gray-700 mb-1">
              <Calendar className="h-3 w-3 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
              <span>
                {formatDate(officer.scheduleStartDate)} - {formatDate(officer.scheduleEndDate)}
              </span>
            </div>
          )}
          
          {officer.scheduleStartTime && officer.scheduleEndTime && (
            <div className="flex items-start text-xs text-gray-700">
              <Clock className="h-3 w-3 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
              <span>
                {officer.scheduleStartTime} - {officer.scheduleEndTime}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={() => onEdit(officer)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Edit2 className="h-4 w-4" />
          <span className="font-medium">Edit</span>
        </button>
        
        <button
          onClick={() => onDelete(officer)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          <span className="font-medium">Delete</span>
        </button>
      </div>
    </div>
  );
};

export default OfficerCard;