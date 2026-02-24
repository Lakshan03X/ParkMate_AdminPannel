// InspectorList.jsx - Grid/List view of all parking inspectors
import React from 'react';
import InspectorCard from './InspectorCard';
import { ShieldAlert } from 'lucide-react';

const InspectorList = ({ inspectors, isLoading, onEdit, onDelete }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading parking inspectors...</p>
      </div>
    );
  }

  if (inspectors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-gray-100 rounded-full p-6 mb-4">
          <ShieldAlert className="h-16 w-16 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No parking inspectors found
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          No parking inspectors match your search criteria. Try adjusting your filters or add a new inspector.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{inspectors.length}</span>{' '}
          {inspectors.length === 1 ? 'inspector' : 'inspectors'}
        </p>
      </div>

      {/* Inspector Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inspectors.map((inspector) => (
          <InspectorCard
            key={inspector.id || inspector.userId || inspector.inspectorId}
            inspector={inspector}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default InspectorList;