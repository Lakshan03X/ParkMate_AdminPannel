// OfficerList.jsx - Grid/List view of all MC officers
import React from 'react';
import OfficerCard from './OfficerCard';
import { Shield } from 'lucide-react';

const OfficerList = ({ officers, isLoading, onEdit, onDelete }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading officers...</p>
      </div>
    );
  }

  if (officers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-gray-100 rounded-full p-6 mb-4">
          <Shield className="h-16 w-16 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No officers found
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          No municipal council officers match your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{officers.length}</span>{' '}
          {officers.length === 1 ? 'officer' : 'officers'}
        </p>
      </div>

      {/* Officer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {officers.map((officer) => (
          <OfficerCard
            key={officer.id || officer.userId}
            officer={officer}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default OfficerList;